var Manager = require("mm-module").master.CategoryManager;
var JwtRouterFactory = require("../jwt-router-factory");
const apiVersion = '1.0.0';

function getRouter() {
    var router = JwtRouterFactory(Manager, {
        version: apiVersion,
        defaultOrder: {
            "_updatedDate": -1
        }
    });
    return router;
}
module.exports = getRouter;