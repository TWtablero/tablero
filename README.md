# ROCKETBOARD

* [Installation](https://github.com/RocketBoard/rocketboard#installation)
* [Static file server](https://github.com/RocketBoard/rocketboard#static-file-server)
* [Unit tests](https://github.com/RocketBoard/rocketboard#unit-tests)
* [Contributing to this project](https://github.com/RocketBoard/rocketboard#contributing-to-this-project)

## Installation

* Install [Node.js](http://nodejs.org/download/)

* Install Bower 
```
sudo npm install -g bower
```

* Clone this repository in https
```
git clone https://github.com/RocketBoard/rocketboard.git
```
 
* Install the project dependences
```
npm install & bower install
```
 
* Configure development environment: 

  - Register **Rocketboard** as a new OAuth application [here](https://github.com/settings/applications/new) with the below configuration:
```
Application Name: rocketboard
Homepage URL: http://localhost
Authorization callback URL: http://localhost:3000/request_auth_token
```
  - Add this variables to your environment (`~/.profile` on OS X):
```
export PX_CLIENT_ID="your_client_id"
export PX_CLIENT_SECRET="your_client_secret"
export PX_USER_AGENT="https://api.github.com/repos/RocketBoard/test_issues_kanboard"
export PX_DISPATCHER="https://api.github.com/repos/RocketBoard/test_issues_kanboard"
export PX_PROJECT_ISSUES="https://api.github.com/repos/RocketBoard/test_issues_kanboard"
export PX_PLATFORM="https://api.github.com/repos/RocketBoard/test_issues_kanboard"
```
  - Run this to refresh `Terminal` so we can recongnize those new variables:
```
source ~/.profile
```  

*  Run the project with:
```
node app.js
```

* Access the project through the browser
https://localhost:3000
 
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


## Unit tests

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


## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* [Workflow](WORKFLOW.md)
