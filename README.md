# Vulpes UI
> Web-based GUI for Vulpes

[![Build Status](https://travis-ci.org/Kiosked/vulpes-ui.svg?branch=master)](https://travis-ci.org/Kiosked/vulpes-ui)

## About

Vulpes-UI is a plugin for the Vulpes platform that provides a web-based user interface to manage Vulpes jobs. Vulpes provides a `Service` which can be used to connect with Vulpes-UI to display jobs and their properties. Vulpes-UI provides a basic API (not related to [Vulpes-API](https://github.com/Kiosked/vulpes-api)) for handling UI events.

## Installation

Install by running `npm install vulpes-ui --save`. Vulpes-UI depends on vulpes as a peer dependency, so you must have that installed as well.

## Usage

Usage is simple enough - we recommend attaching the Vulpes UI router to the root `/` route:

```javascript
const express = require("express");
const { Service } = require("vulpes");
const { createVulpesRouter } = require("vulpes-ui");
const app = express();
const port = 3000;

// Create a new service
const service = new Service();

service.initialise().then(() => {
    app.use("/", createVulpesRouter(service));

    app.listen(port, () => {
        console.log(`Application listening on port ${port}`);
    });
});
```

The method `createVulpesRouter` takes a Vulpes `Service` instance:

```javascript
// Returns an Express router instance
createVulpesRouter(service);
```

The returned value is a router instance from [`express-promise-router`](https://github.com/express-promise-router/express-promise-router).
