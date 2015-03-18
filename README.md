# TABLERO [![Build Status](https://snap-ci.com/TWtablero/tablero/branch/master/build_image)](https://snap-ci.com/TWtablero/tablero/branch/master) [![Code Climate](https://codeclimate.com/github/TWtablero/tablero/badges/gpa.svg)](https://codeclimate.com/github/TWtablero/tablero)

A kanban board for developers that connects with GitHub projects and synchronizes the issues of multiple repositories and the contributors that are working on them.

IMPORTANT: For the correct operation of the project, make sure your GitHub repositories have issues' use permission

* Installation
  * [Quick Installation](https://github.com/TWtablero/tablero#quick-installation)
  * [Quick Install in a VM](https://github.com/TWtablero/tablero#quick-install-in-a-vm)
  * [Manual Installation](https://github.com/TWtablero/tablero#manual-installation)
* [Configuration](https://github.com/TWtablero/tablero#configuration)
* [Starting the Application](https://github.com/TWtablero/tablero#starting-the-application)
* [Static File Server](https://github.com/TWtablero/tablero#static-file-server)
* [Optional Features](https://github.com/TWtablero/tablero#optional-features)
  * [Saving the Order of Issues](https://github.com/TWtablero/tablero#saving-the-order-of-issues)
* [Unit Tests](https://github.com/TWtablero/tablero#unit-tests)
* [Functional Tests](https://github.com/TWtablero/tablero#functional-tests)
* [Contributing to this Project](https://github.com/TWtablero/tablero#contributing-to-this-project)


## Quick Installation

Open a terminal and execute this:
```
wget -qO- https://raw.githubusercontent.com/TWtablero/tablero/master/install.sh | sh
```

This script will check if your system satisfies the pre requisites, download tablero and its dependencies.

After the installation, you'll need to proceed with the Tablero [configuration](https://github.com/TWtablero/tablero#configuration).

## Quick Install in a VM

1. Install [ANSIBLE](http://www.ansible.com "ansible")

  If you want you can install a software for Mac called [brew]("http://brew.sh/") and run in your terminal:

  ```bash
  $ brew install ansible
  ```

2. Install [VAGRANT](http://www.vagrantup.com/ "vagrant") and [VirtualBox]("https://www.virtualbox.org/wiki/Downloads")

  __Note__: Don't forget to install the __VirtualBox Extension Pack__ too which can be found in the website above!

3. Go to [configuration](https://github.com/TWtablero/tablero#configuration) first step to generate the PX_CLIENT variables.

4. From tablero directory in your terminal, use the variables from the last step to run:

  ```bash
  $ PX_CLIENT_ID=<your px client id> PX_CLIENT_SECRET=<your px secret> vagrant up
  ```

#### Some tips

Turn on/Create the machine with: ``vagrant up``

Shutdown: ``vagrant halt``

Get in: ``vagrant ssh``

Destroy the machine: ``vagrant destroy``

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

After the installation, you'll need to proceed with the Tablero [configuration](https://github.com/TWtablero/tablero#configuration).

## Configuration

1. Register **Tablero** as a [new OAuth application](https://github.com/settings/applications/new) with the following configuration:

  ```
  Application Name: tablero
  Homepage URL: http://localhost
  Authorization callback URL: http://localhost:3000/request_auth_token
  ```

2. Generate a [personal access token](https://github.com/settings/tokens/new) with the access rights you'd like to grant users that don't have a Github account. If you'd like users to only be able to view your Tablero and not make changes, unselect all the checkboxes. Use the generated token in the next step.

3. Create a __config.json__ file with application's values generated in the last step:
  ![image of applications variable]
  (http://www.sumoware.com/images/temp/xzqgemqimmkkdcrr.png )

  You can just rename the example.config.json and change the values:
  ```
  {
    "PX_OAUTH_URL" : "https://github.com/login/oauth",
    "REPOS" : "",
    "PX_CLIENT_SECRET" : "your_client_secret",
    "PX_CLIENT_ID" : "your_client_id",
    "DEFAULT_ACCESS_TOKEN" : "your_personal_access_token",
    "REDISCLOUD_URL" : ""
  }
  ```

  Remember to put the __repositories you want to display__ on the __REPOS__ key. It is a semi-colon (;) separated list specifying each repository.
  I.e:
  ```
  "REPOS" : "https://api.github.com/repos/OWNER/REPO_NAME;https://api.github.com/repos/OWNER/REPO2_NAME"
  ```
  Optionally, you can just set the owner and repository name in __Owner/Name__ format. I.e:
  ```
  "REPOS" : "owner/repo_name;owner/repo2_name"
  ```

## Starting the Application

```
npm start
```

Then access the project through the browser

[http://localhost:3000](http://localhost:3000)

## Static File Server

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


## Optional Features

### Saving the order of issues

If you want to prioritize your issues and persist them for future sessions, then you will also need to have [Redis](http://redis.io/) installed.

If you want to use it locally, just start the server from your terminal:
```
redis-server
```

If you would like to use a __remote Redis__, define the __REDISCLOUD_URL__ variable on the __config.json__ file.
I.e:
```
{
  "PX_OAUTH_URL" : "https://github.com/login/oauth",
  "REPOS" : "",
  "PX_CLIENT_SECRET" : "",
  "PX_CLIENT_ID" : "",

  "REDISCLOUD_URL" : "your_redis_url"
}
```

## Unit Tests

A local installation of Karma is used to run the JavaScript unit tests.
Karma makes it easy to watch files and run unit tests in real browsers:

```
npm run watch-test
```

This is the recommended approach because the moment your unit tests start
failing, you'll be notified in the terminal.

To run the unit tests just once in PhantomJS (for CI), you must install
[PhantomJS](http://phantomjs.org/) and then run:

```
npm test
```

For further information about configuring Karma, please refer to the [Karma
website](http://karma-runner.github.io/).

## Functional Tests

Functional tests are written in Java using [Selenium](http://www.seleniumhq.org/) (Firefox web driver by default).

__Note: To avoid making changes to your repository, you need to pass two test repositories as an environment variable REPOS when running the functional tests.__

Before executing the test you need to have the application running and __TABLERO_TEST_USER__ and __TABLERO_TEST_PASS__ environment variables set (Test user GitHub credentials).

After that, you can execute them all running:
```
REPOS="TWtablero/repoTest1;TWtablero/repoTest2" npm run functional-test
```
or specifying environment variables on the fly:
```
REPOS="TWtablero/repoTest1;TWtablero/repoTest2" TABLERO_TEST_USER=user TABLERO_TEST_PASS=pass npm run functional-test
```
or, if you want to run specific tests, you will need to directly invoke maven (from root directory):
```
mvn -f test/spec/functionalTest/rocketboard/pom.xml -Dtest=rocketboard.TEST_CLASS_NAME test
```
or, you can run them from as JUnit tests from any IDE. 

It is worth noting, that in this case you __will need to specify the environment variables for its run configuration__. 

__Note:__
To make the environment variables persistent you can add them to ```~/.bash_profile``` or ```~/.profile``` on OS X. E.g:
```
export REPOS="TWtablero/repoTest1;TWtablero/repoTest2"
```

## Contributing to this project

Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* [Workflow](WORKFLOW.md)
