
import { connect } from 'nats';
import { Client } from 'nats';
import { ClientOpts } from 'nats';
import { RPC } from './rpc';

export class NatsRPC implements RPC {
  private nats: Client;
  public host: string = process.env["MS_NATS_HOST"] || "localhost";
  public port: string = process.env["MS_NATS_PORT"] || "4222";

  public constructor() {

  }

  public connect(cb: () => void) {
    this.nats = connect(<ClientOpts>{ host: this.host, port: parseInt(this.port) });
    if (cb) {
      cb();
    }
  }

  public emit(address: string, data, headers, cb: (e: Error, d?: any) => void, timeout: number) {
    let callback = (e: Error, d?: any) => {
      if (cb)
        cb(e, d);
      cb = null;
    };

    let sid = this.nats.request(address, JSON.stringify({ b: data, h: headers }), { max: 1 }, (response) => {
      if (response.e) {
        var err = new Error(response.e);
        err.name = response.c || "500";
        callback(err, null);
      } else {
        callback(null, JSON.parse(response));
      }
    });
    this.nats.timeout(sid, timeout || 30000, 1, () => {
      var err = new Error("Timeout");
      err.name = "500";
      callback(err, null);
    });
  }

  public on(address: string, func: Function) {
    this.nats.subscribe(address, (request, replyTo) => {
      var d: any = JSON.parse(request);
      func(d.b, d.h, (err, data) => {
        this.nats.publish(replyTo, JSON.stringify(err ? { e: err.message, c: err.name } : { d: data }));
      });
    });
  }

  public publish(address: string, data, headers) {
    this.nats.publish(address, JSON.stringify({ b: data, h: headers }));
  }

};

