"use strict";
const events_1 = require('events');
const rpc_1 = require('./rpc');
class EventBus {
    constructor(serviceName, cb) {
        this.serviceName = serviceName;
        this.emitter = new events_1.EventEmitter();
        this.localAddresses = {};
        this.rpc = new rpc_1.RPC();
        this.rpc.connect(cb);
    }
    emit(address, data, headers, cb) {
        if (this.localAddresses[address]) {
            this.emitter.emit(address, data, headers, cb);
        }
        else {
            this.rpc.emit(address, data, headers, cb);
        }
    }
    ;
    on(address, func) {
        var addr = this.serviceName + "@" + address;
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
    register(action) {
        console.log("sdasdsad");
        this.on(action.address(), action.process);
    }
}
exports.EventBus = EventBus;
;
