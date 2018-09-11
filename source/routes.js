const path = require("path");
const express = require("express");

function createRoutes(router, service) {
    router.use("/", express.static(path.resolve(__dirname, "../dist")));
}

module.exports = {
    createRoutes
};
