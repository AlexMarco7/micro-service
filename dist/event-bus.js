"use strict";
const events_1 = require('events');
const nats_rpc_1 = require('./nats-rpc');
class EventBus {
    constructor() {
        this.emitter = new events_1.EventEmitter();
        this.localAddresses = {};
        this.serviceName = "service";
        this.type = process.env["MS_EVENT_BUS_TYPE"] || 'local';
        this.rpc = new nats_rpc_1.NatsRPC();
        EventBus._instance = this;
    }
    static instance() {
        return EventBus._instance || new EventBus();
    }
    connect(cb) {
        this.rpc.connect(cb);
    }
    emit(address, data = {}, headers = {}, cb = null, timeout = null) {
        let callback = (e, d) => {
            if (cb)
                cb(e, d);
            cb = null;
        };
        if (this.type == "local" || (this.type != "rpc" && this.localAddresses[address])) {
            this.emitter.emit(address, data, headers, callback);
            setTimeout(() => {
                var err = new Error("Timeout");
                err.name = "500";
                callback(err, null);
            }, timeout || parseInt(process.env["MS_EVENT_BUS_TIMEOUT"] || "30000"));
        }
        else {
            this.rpc.emit(address, data, headers, callback, timeout || parseInt(process.env["MS_EVENT_BUS_TIMEOUT"] || "30000"));
        }
    }
    ;
    publish(address, data = {}, headers = {}) {
        if (this.type == "local" || (this.type != "rpc" && this.localAddresses[address])) {
            this.emitter.emit(address, data, headers);
        }
        else {
            this.rpc.publish(address, data, headers);
        }
    }
    ;
    on(addr, func) {
        this.localAddresses[addr] = true;
        var f = (d, h, cb) => {
            func(d, h, (d) => {
                cb(null, d || {});
            }, (err, code = "500") => {
                err.name = code;
                cb(err);
            });
        };
        this.rpc.on(addr, f);
        this.emitter.on(addr, f);
    }
    ;
}
exports.EventBus = EventBus;
;
