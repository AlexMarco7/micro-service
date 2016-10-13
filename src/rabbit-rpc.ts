import { v1 as uuid } from 'node-uuid';
import { EventEmitter } from 'events';
import { connect } from 'amqplib';
import { Buffer } from 'buffer';

export class RabbitRPC {

  private emitter = new EventEmitter();
  private callbackQueue: String = "cb-" + uuid();
  private ch: any;

  public constructor(public host = "localhost") {

  }

  public connect(cb: () => void) {
    var open = connect('amqp://' + this.host);

    open.then((conn: any) => {
      return conn.createChannel();
    }).then((c) => {
      this.ch = c;
      this.createCallbackQueue(cb);
    });

  }

  private createCallbackQueue(cb: () => void) {
    this.ch.assertQueue(this.callbackQueue, { exclusive: true }).then((ok: boolean) => {
      this.ch.consume(this.callbackQueue, (msg) => {
        this.emitter.emit(msg.properties.correlationId, msg.content.toString(), msg.properties.headers.error);
      }, { noAck: true });
      if (cb)
        cb();
    });
  }


  public emit(address: string, data, headers, cb: (e:Error, d?) => void) {
    this.ch.assertQueue(address, { autoDelete: true, durable : false }).then((ok) => {
      var corrId = uuid();
      this.emitter.once(corrId, (body, error) => {
        cb(error ? new Error(body) : null, error ? null : JSON.parse(body));
      });
      return this.ch.sendToQueue(address, new Buffer(JSON.stringify(data)), { expiration: '30000', correlationId: corrId, replyTo: this.callbackQueue, headers: headers });
    });
  };

  public on(address: string, func) {
    this.ch.assertQueue(address, { autoDelete: true, durable : false }).then((ok) => {
      this.ch.consume(address, (msg) => {
        func(JSON.parse(msg.content.toString()), msg.properties.headers, (err, data) => {
          this.ch.sendToQueue(msg.properties.replyTo, new Buffer(err ? err.message || err : JSON.stringify(data) || {}), { expiration: '30000', correlationId: msg.properties.correlationId });
        });
      }, { noAck: true });
    });
  };

};

