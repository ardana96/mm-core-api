var Router = require('restify-router').Router;
var router = new Router();
var updateProductFactPenjualan = require('mm-module').etl.updateProductFactPenjualan;
var db = require('../../../db');
var SqlHelper = require('../../../sql-helper')
var resultFormatter = require("../../../result-formatter");

const apiVersion = '1.0.0';

router.get('/', (request, response, next) => {

    var mongoDbConnection = db.get();
    // var sql = new SqlHelper();
    var sqlConnection = SqlHelper.startConnection();

    Promise.all([mongoDbConnection, sqlConnection])
        .then(result => {
            var _db = result[0];
            var instance = new updateProductFactPenjualan(_db, {
                username: "etl"
            }, SqlHelper);

            instance.run()
                .then(() => {
                    response.send(200);
                })
                .catch(e => {
                    var error = resultFormatter.fail(apiVersion, 400, e);
                    response.send(400, error);
                });
        });
});

module.exports = router;