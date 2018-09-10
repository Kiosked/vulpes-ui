const { Router } = require("express");
const { createRoutes } = require("./routes.js");

/**
 * Create an Express Router instance for use with an express app
 * @param {Vulpes.Service} vulpesService The Vulpes service to create the app for
 * @returns {Express.Router} An express router
 * @example
 *  const router = createVulpesRouter(service);
 *  app.use("/", router);
 * @see https://expressjs.com/en/guide/routing.html#express-router
 */
function createVulpesRouter(vulpesService) {
    const router = Router();
    createRoutes(router, vulpesService);
    return router;
}

module.exports = {
    createVulpesRouter
};
