

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
  });
});

function cleanEnvVars() {
  hardcodedVars.forEach(deleteEnvVar);
  for(i = 0; i < 5; i++) {
    deleteEnvVar('REPO_' + i + '_URL');
  }
}

function deleteEnvVar(key) {
  delete process.env[key];
}
function addEnvVar(key, val) {
  process.env[key] = val;
}
function config() {
  delete require.cache[require.resolve('../../config/client.js')]
  return require('../../config/client.js');
}
