# TABLERO [![Build Status](https://snap-ci.com/TWtablero/tablero/branch/master/build_image)](https://snap-ci.com/TWtablero/tablero/branch/master)

A kanban board for developers that connects with GitHub projects and synchronizes the issues of multiple repositories and the contributors that are working on them.

IMPORTANT: For the correct operation of the project, make sure your GitHub repositories have issues' use permission

* [Quick Installation](https://github.com/TWtablero/tablero#quick-installation)
* [Manual Installation](https://github.com/TWtablero/tablero#manual-installation)
* [Static file server](https://github.com/TWtablero/tablero#static-file-server)
* [Unit tests](https://github.com/TWtablero/tablero#unit-tests)
* [Contributing to this project](https://github.com/TWtablero/tablero#contributing-to-this-project)


## Quick Installation

Open a terminal and execute this:
```
wget -qO- https://raw.githubusercontent.com/TWtablero/tablero/master/install.sh | sh
```

This script will check if your system satisfies the pre requisites, download tablero and its dependencies and finally start the application

## Manual Installation

* Install [Node.js](https://github.com/joyent/node/wiki/installing-node.js-via-package-manager)

* Install [Bower](http://bower.io/) running:
```
sudo npm install -g bower
```

* Clone this repository in https
```
git clone https://github.com/TWtablero/tablero.git
```
 
* Install the project dependences inside the project directory
```
npm install
```
 
* Configure development environment: 

  - Register **Tablero** as a [new OAuth application](https://github.com/settings/applications/new) with the following configuration:
```
Application Name: tablero
Homepage URL: http://localhost
Authorization callback URL: http://localhost:3000/request_auth_token
```
  - Set __PX_CLIENT_ID__ and __PX_CLIENT_SECRET__ environment variables with application's client id and client secret values generated in the last step:
   ![image of applications variable]
   (http://www.sumoware.com/images/temp/xzqgemqimmkkdcrr.png )
  
   
    - To make them persistent you can add them to `~/.bash_profile` or `~/.profile` on OS X. E.g:
    ```
    export PX_CLIENT_ID="your_client_id"
    ```
     ```
    export PX_CLIENT_SECRET="your_client_secret"
    ```
    - Reload `Terminal` settings to set the new variables:
      ```
      source ~/.profile
      ``` 
 
* Use __REPOS__ environment variable to define which repositories you want to display. It is a semi-colon (;) separated list specifying each repository.
 
 For example, to set [tableroRepoTest1](https://api.github.com/repos/TWtablero/repoTest1) and [tablerRepoTest2](https://api.github.com/repos/TWtablero/repoTest2) repositories use:
 ```
 export REPOS="https://api.github.com/repos/TWtablero/repoTest1;https://api.github.com/repos/TWtablero/repoTest2"
 ```
 
 Optionally, you can just set the owner and name in __Owner/Name__ format. I.e:
 ```
 export REPOS="TWtablero/repoTest1;TWtablero/repoTest2"
 ```
 
   - To make it persistent you can add them to `~/.bash_profile` or `~/.profile` on OS X. E.g:
   ```
   export REPOS="TWtablero/repoTest1;TWtablero/repoTest2"
   ```
   - Reload `Terminal` settings to set the new variables:
     ```
     source ~/.profile
     ``` 
 

*  Start the application:
```
npm start
```

* Access the project through the browser
http://localhost:3000
 
***Before create issues, please check if it is actually pointing to the fake repository!*** 



## Static file server

A local installation of [Gulp](http://gulpjs.com) provides a Node-based
foundation for running development and build tasks.

The watch task serves the contents of the 'app' directory on
`http://localhost:8080/`, and watches files for changes. Install Chrome's
[LiveReload extension](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
to have the browser tab automatically refresh when files are changed.

```
npm run watch
```

Alternatively, the server (which is a local installation of
[node-static](https://github.com/cloudhead/node-static/)) and can be run on its
own:

```
npm run server
```

Additional tasks can be included in the `gulpfile.js`. For further information
about using Gulp, please refer to the [Gulp website](http://gulpjs.com/).


## Unit Tests

A local installation of Karma is used to run the JavaScript unit tests.
Karma makes it easy to watch files and run unit tests in real browsers:

```
npm run watch-test
```

This is the recommended approach because the moment your unit tests start
failing, you'll be notified in the terminal.

To run the unit tests just once in PhantomJS (for CI), you must install
PhantomJS and then run:

```
npm test
```

For further information about configuring Karma, please refer to the [Karma
website](http://karma-runner.github.io/).

## Functional Tests

Functional tests are written in Java using [Selenium](http://www.seleniumhq.org/) (Firefox web driver by default).

Before executing the test you need to have the application running and __TABLERO_TEST_USER__ and __TABLERO_TEST_PASS__ environment variables set (Test user GitHub credentials).

After that, you can execute them all running:
```
npm run functional-test
```
or, specifying environment variables on the fly:
```
TABLERO_TEST_USER=user TABLERO_TEST_PASS=pass npm run functional-test
```
or, if you want to run specific tests, you will need to directly invoke maven (from root directory):
```
mvn -f test/spec/functionalTest/rocketboard/pom.xml -Dtest=rocketboard.TEST_CLASS_NAME test
```
or, you can run them from as JUnit tests from any IDE. 

It is worth noting, that in this case you __will need to specify the environment variables for its run configuration__. 

## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* [Workflow](WORKFLOW.md)
