var Router = require('restify-router').Router;
var router = new Router();
var ItemMigration = require('mm-module').etl.itemsMigration;
var db = require('../../../db');
var resultFormatter = require("../../../result-formatter");

const apiVersion = '1.0.0';

router.get('/', (request, response, next) => {

    db.get().then(db => {
        var instance = new ItemMigration(db, {
            username: "etl"
        });
        instance.getDataItems()
            .then(() => {
                response.send(200);
            })
    });
});

module.exports = router;
