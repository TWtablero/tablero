var nconf = require('nconf');

var configurable = require('../../lib/configurable');

configurable.setSilentMode(true);

var hardcodedVars = [ 'PX_PROJECT_ISSUES', 
  'PX_PLATFORM', 
  'PX_DISPATCHER', 
  'PX_USER_AGENT', 
  'PX_PAGES'];

  describe("Client config", function() {
    beforeEach(cleanEnvVars);

    it("contains repos", function() {
      var cfg = config();
      expect(cfg.repos).not.toBe(null);
      console.log(Object.keys(cfg.repos)[0]);
      expect(Object.keys(cfg.repos).length).toBe(0);
    });
    it("contains labels", function() {
      var cfg = config();
      expect(cfg.labels).not.toBe(null);
      expect(Object.keys(cfg.labels).length).toBe(Object.keys(cfg.repos).length);
    });

    describe("Pixelated repos", function(){
      it("adds Website repo", function(){
        var url =  'https://github.com/xxx';
        addEnvVar('PX_PAGES', url);
        var cfg = config();

        expect(cfg.repos['website']).toBe(url);
        expect(cfg.labels['website']).toBe('Website');
      });

      it("adds only supported repos", function(){
        var url =  'https://github.com/xxx';
        var setUrl = function(key) {
          addEnvVar(key, url);
        }
        hardcodedVars.forEach(setUrl)
        setUrl('PX_OTHER');
        var cfg = config();

        expect(Object.keys(cfg.repos).length).toBe(hardcodedVars.length);
      });
    });

    describe("Dynamic repos", function() {
      it('adds repo from REPO_x_URL env var', function(){
        var url =  'https://github.com/xxx';
        addEnvVar('REPO_0_URL', url);
        var cfg = config();

        expect(cfg.repos['0th']).toBe(url);
        expect(cfg.labels['0th']).toBe(url);
      });

      it('adds repo from REPOS env var', function(){
        var url =  'https://api.github.com/repos/Org/Name';
        addEnvVar('REPOS', url);
        var cfg = config();

        expect(cfg.repos['org_name']).toBe(url);
        expect(cfg.labels['org_name']).toBe('Org/Name');
      });

      it('adds repos from name', function(){
        var name =  'Org/Name';
        addEnvVar('REPOS', name);
        var cfg = config();

        expect(cfg.repos['org_name']).toBe('https://api.github.com/repos/' + name);
        expect(cfg.labels['org_name']).toBe('Org/Name');
      });

      it('adds repos separated by ";" from REPOS env var', function(){
        addEnvVar('REPOS', 'A/b;C/d');
        var cfg = config();

        expect(cfg.repos['a_b']).toBe('https://api.github.com/repos/A/b');
        expect(cfg.repos['c_d']).toBe('https://api.github.com/repos/C/d');
      });

    });
  });

  function cleanEnvVars() {
    // hardcodedVars.forEach(deleteEnvVar);
    // for(i = 0; i < 5; i++) {
    //   deleteEnvVar('REPO_' + i + '_URL');
    // }
    nconf.reset();
  }

  function deleteEnvVar(key) {
    configurable.remove(key);
  }
  function addEnvVar(key, val) {   
    configurable.set(key,val);
  }
  function config() {
    delete require.cache[require.resolve('../../config/client.js')]
    return require('../../config/client.js');
  }
