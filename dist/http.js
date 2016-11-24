"use strict";
const restify = require('restify');
class Http {
    static start(options, eb, cb) {
        var server = restify.createServer();
        server.use(restify.queryParser());
        server.use(restify.bodyParser());
        server.listen(options.port, () => {
            if (cb) {
                cb();
            }
            eb.publish("micro-service@new-http-api-avaiable");
        });
        eb.on("micro-service@register-http", (data) => {
            console.log("registing " + options.prefix + data.path);
            server[data.method](options.prefix + data.path, (req, res, next) => {
                console.log(req.path());
                var header = {};
                for (var k in req.query) {
                    header[k] = req.query[k];
                }
                for (var k in req.params) {
                    header[k] = req.params[k];
                }
                eb.emit(data.address, req.body, header, (err, data) => {
                    if (err)
                        res.send(err.name ? parseInt(err.name) : 500, { error: err.message });
                    else
                        res.send(data);
                });
            });
        });
    }
}
exports.Http = Http;
