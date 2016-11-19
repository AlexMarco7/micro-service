"use strict";
const events_1 = require('events');
const nats_rpc_1 = require('./nats-rpc');
class EventBus {
    constructor() {
        this.emitter = new events_1.EventEmitter();
        this.localAddresses = {};
        this.serviceName = "service";
        this.type = 'auto';
        this.rpc = new nats_rpc_1.NatsRPC();
        EventBus._instance = this;
    }
    static instance() {
        return EventBus._instance || new EventBus();
    }
    connect(cb) {
        this.rpc.connect(cb);
    }
    emit(address, data = {}, headers = {}, cb = null) {
        if (this.type != "rpc" && this.localAddresses[address]) {
            this.emitter.emit(address, data, headers, cb);
        }
        else {
            this.rpc.emit(address, data, headers, cb);
        }
    }
    ;
    publish(address, data = {}, headers = {}) {
        if (this.type != "rpc" && this.localAddresses[address]) {
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
            }, (err) => {
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
