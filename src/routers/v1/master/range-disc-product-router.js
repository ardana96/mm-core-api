var Router = require('restify-router').Router;
var router = new Router();
var RangeDiscProductManager = require('mm-module').master.RangeDiscProductManager;
var db = require('../../../db');
var resultFormatter = require("../../../result-formatter");
var passport = require('../../../passports/jwt-passport');

const apiVersion = '1.0.0';

router.get('/', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new RangeDiscProductManager(db, {
            username: 'router'
        });
        var query = request.query;

        manager.read(query)
            .then(docs => {
                var result = resultFormatter.ok(apiVersion, 200, docs.data);
                delete docs.data;
                result.info = docs;
                result.data.sort((dataA, dataB) => {return new Date(dataB._updatedDate).getTime() - new Date(dataA._updatedDate).getTime()});
                response.send(200, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            });

    });
});

router.get('/:id', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new RangeDiscProductManager(db, request.user);
        var id = request.params.id;

        manager.getSingleById(id)
            .then(doc => {
                var result = resultFormatter.ok(apiVersion, 200, doc);
                response.send(200, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            });

    });
});

router.post('/', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new RangeDiscProductManager(db, request.user);
        var data = request.body;

        manager.create(data)
            .then(docId => {
                response.header('Location', `/range-disc-products/${docId.toString()}`);
                var result = resultFormatter.ok(apiVersion, 201);
                response.send(201, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            });

    });
});

router.put('/:id', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new RangeDiscProductManager(db, request.user);
        var id = request.params.id;
        var data = request.body;

        manager.update(data)
            .then(docId => {
                var result = resultFormatter.ok(apiVersion, 204);
                response.send(204, result);
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            });

    });
});

router.del('/:id', passport, (request, response, next) => {
    db.get().then(db => {
        var manager = new RangeDiscProductManager(db, request.user);
        var now = new Date();
        var id = request.params.id;

        manager.getSingleById(id)
            .then(data => {
                manager.delete(data)
                    .then(docId => {
                        data._updatedDate = now;
                        var result = resultFormatter.ok(apiVersion, 204);
                        response.send(204, result);
                    })
                    .catch(e => {
                        var error = resultFormatter.fail(apiVersion, 400, e);
                        response.send(400, error);
                    });
            })
            .catch(e => {
                var error = resultFormatter.fail(apiVersion, 400, e);
                response.send(400, error);
            });
    });
});

module.exports = router;