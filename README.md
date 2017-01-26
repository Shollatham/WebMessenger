# WebMessenger

This project use nodeJs technology.

## Table of Contents
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Directory Layout](#directory-layout)

## Prerequisites

### 1. Git

Install the latest stable version of Git from [http://git-scm.com/downloads](http://git-scm.com/downloads).

### 2. Node.js

Install the latest stable version of Node.js from [http://nodejs.org](http://nodejs.org)

### 3. Grunt

[Grunt](http://gruntjs.com) is an awesome Node.js module for performing essential automation tasks.

Install via NPM:

    npm install -g grunt-cli

## Installation

1. Checkout project from Github
2. Run `npm install`
3. Run `grunt dist` for compile source code by google closure library
4. Run `npm run server` for compiled version or `npm run dev` for development version
5. Open Browser on URL http://localhost:3000/ for compiled version or http://localhost:3000/dev/ for development version

## Directory Layout

    dist/               --> The compiled source code that ready for deploy
    server/             --> Backend source for run on nodeJs
    web/                --> FrontEnd source for run on Browser
      third-party/      --> Google closure use for compile FrontEnd source code
      src/              --> Development source code
        compiled/       --> Compiled javascript files from google closure
        css/            --> Css files
        js/             --> Javascript files
          common/       --> Javascript for common use in application
          enums/        --> Javascript enumerate for use in application
          events/       --> Event handler object for use in application
          models/       --> Application data models
          services/     --> Javascript for call server API
        deps.js         --> Dependencies injection file for google library
        main.js         --> Main javascript file
      lib/              --> Third party javascript library
      index.html        --> Main html file
    ChatDB              --> Sqlite database file
    Gruntfile.js        --> Build automation script
    nodemon.js          --> Nodemon config for development mode
    package.json        --> Project configuration
    server.js           --> Server script for start server
