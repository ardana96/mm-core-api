const Manager = require('mm-module').manufacture.DesignTrackingStageManager;
const JwtRouterFactory = require('../jwt-router-factory');
const apiVersion = '1.0.0';

function getRouter() {
    var router = JwtRouterFactory(Manager, {
        version: apiVersion,
        defaultOrder: {
            "_createdDate": 1
        }
    });
    return router;
}

module.exports = getRouter;