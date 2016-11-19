"use strict";
const restify = require('restify');
class Rest {
    static start(options, eb, cb) {
        var server = restify.createServer();
        server.use(restify.queryParser());
        server.use(restify.bodyParser());
        server.listen(options.port, () => {
            if (cb) {
                cb();
            }
            eb.publish("_micro-service@new-rest-api-avaiable");
        });
        var map = {
            get: {}, post: {}, put: {}, del: {}
        };
        for (let method in map) {
            server[method](/(.*)/, (req, res, next) => {
                console.log(req.path());
                if (!map[method][req.path()]) {
                    res.send(404);
                    return;
                }
                var header = {};
                for (var k in req.params) {
                    header[k] = req.params[k];
                }
                eb.emit(map[method][req.path()], req.body, header, (err, data) => {
                    if (err)
                        res.send(500, { error: err.message });
                    else
                        res.send(data);
                });
            });
        }
        eb.on("_micro-service@register-rest", (data) => {
            console.log("registing " + options.prefix + data.path);
            map[data.method][options.prefix + data.path] = data.address;
        });
    }
}
exports.Rest = Rest;
