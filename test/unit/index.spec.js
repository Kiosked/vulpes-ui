const { Service } = require("vulpes");
const { Router } = require("express");
const { createVulpesRouter } = require("../../source/index.js");

describe("index", function() {
    describe("createVulpesRouter", function() {
        beforeEach(function() {
            this.service = new Service();
            return this.service.initialise();
        });

        it("returns a Router instance", function() {
            const router = createVulpesRouter(this.service);
            expect(router.constructor === Router.constructor).to.be.true;
        });
    });
});
