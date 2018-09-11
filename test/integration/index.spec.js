const { Service } = require("vulpes");
const { Router } = require("express");
const { createVulpesRouter } = require("../../source/index.js");

describe("index", function() {
    describe("createVulpesRouter", function() {
        beforeEach(function() {
            this.service = new Service();
            return this.service.initialise();
        });

        describe("returned router", function() {
            beforeEach(function() {
                this.router = createVulpesRouter(this.service);
            });

            it("routes static assets", function() {
                const staticRoute = this.router.stack.find(layer => layer.name === "serveStatic");
                expect(staticRoute).to.not.be.undefined;
            });
        });
    });
});
