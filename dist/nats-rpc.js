"use strict";
const nats_1 = require('nats');
class NatsRPC {
    constructor() {
        this.host = process.env["NATS_HOST"] || "localhost";
        this.port = process.env["NATS_PORT"] || "4222";
    }
    connect(cb) {
        this.nats = nats_1.connect({ host: this.host, port: parseInt(this.port) });
        if (cb) {
            cb();
        }
    }
    emit(address, data, headers, cb) {
        this.nats.request(address, JSON.stringify({ b: data, h: headers }), { 'max': 1 }, (response) => {
            cb(null, JSON.parse(response));
        });
    }
    on(address, func) {
        this.nats.subscribe(address, (request, replyTo) => {
            var d = JSON.parse(request);
            func(d.b, d.h, (err, data) => {
                this.nats.publish(replyTo, JSON.stringify(data));
            });
        });
    }
    publish(address, data, headers) {
        this.nats.publish(address, JSON.stringify({ b: data, h: headers }));
    }
}
exports.NatsRPC = NatsRPC;
;
