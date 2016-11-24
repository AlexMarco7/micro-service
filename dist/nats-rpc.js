"use strict";
const nats_1 = require('nats');
class NatsRPC {
    constructor() {
        this.url = process.env["MS_NATS_URL"] || "nats://nats:4222";
    }
    connect(cb) {
        this.nats = nats_1.connect(this.url);
        if (cb) {
            cb();
        }
    }
    emit(address, data, headers, cb, timeout) {
        let callback = (e, d) => {
            if (cb)
                cb(e, d);
            cb = null;
        };
        let sid = this.nats.request(address, JSON.stringify({ b: data, h: headers }), { max: 1 }, (response) => {
            response = JSON.parse(response);
            if (response.e) {
                var err = new Error(response.e);
                err.name = response.c || "500";
                callback(err, null);
            }
            else {
                callback(null, response.d);
            }
        });
        this.nats.timeout(sid, timeout || 30000, 1, () => {
            var err = new Error("Timeout");
            err.name = "500";
            callback(err, null);
        });
    }
    on(address, func) {
        this.nats.subscribe(address, (request, replyTo) => {
            var d = JSON.parse(request);
            func(d.b, d.h, (err, data) => {
                this.nats.publish(replyTo, JSON.stringify(err ? { e: err.message, c: err.name } : { d: data }));
            });
        });
    }
    publish(address, data, headers) {
        this.nats.publish(address, JSON.stringify({ b: data, h: headers }));
    }
}
exports.NatsRPC = NatsRPC;
;
