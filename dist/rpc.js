"use strict";
const node_uuid_1 = require('node-uuid');
const events_1 = require('events');
const amqplib_1 = require('amqplib');
const buffer_1 = require('buffer');
class RPC {
    constructor(host = "localhost") {
        this.host = host;
        this.emitter = new events_1.EventEmitter();
        this.callbackQueue = "cb-" + node_uuid_1.v1();
    }
    connect(cb) {
        var open = amqplib_1.connect('amqp://' + this.host);
        open.then((conn) => {
            return conn.createChannel();
        }).then((c) => {
            this.ch = c;
            this.createCallbackQueue(cb);
        });
    }
    createCallbackQueue(cb) {
        this.ch.assertQueue(this.callbackQueue, { exclusive: true }).then((ok) => {
            this.ch.consume(this.callbackQueue, (msg) => {
                this.emitter.emit(msg.properties.correlationId, msg.content.toString(), msg.properties.headers.error);
            }, { noAck: true });
            if (cb)
                cb();
        });
    }
    emit(address, data, headers, cb) {
        this.ch.assertQueue(address, { autoDelete: true }).then((ok) => {
            var corrId = node_uuid_1.v1();
            this.emitter.once(corrId, (body, error) => {
                cb(error ? new Error(body) : null, error ? null : JSON.parse(body));
            });
            return this.ch.sendToQueue(address, new buffer_1.Buffer(JSON.stringify(data)), { expiration: '30000', correlationId: corrId, replyTo: this.callbackQueue, headers: headers });
        });
    }
    ;
    on(address, func) {
        this.ch.assertQueue(address, { autoDelete: true }).then((ok) => {
            this.ch.consume(address, (msg) => {
                func(JSON.parse(msg.content.toString()), msg.properties.headers, (err, data) => {
                    this.ch.sendToQueue(msg.properties.replyTo, new buffer_1.Buffer(err ? err.message || err : JSON.stringify(data) || {}), { expiration: '30000', correlationId: msg.properties.correlationId });
                });
            }, { noAck: true });
        });
    }
    ;
}
exports.RPC = RPC;
;
