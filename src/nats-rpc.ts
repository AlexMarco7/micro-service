
import { connect } from 'nats';
import { Client } from 'nats';
import { ClientOpts } from 'nats';
import { RPC } from './rpc';

export class NatsRPC implements RPC {
  private nats: Client;
  public host:string = process.env["NATS_HOST"] || "localhost";
  public port:string = process.env["NATS_PORT"] || "4222";

  public constructor() {

  }

  public connect(cb: () => void) {
    this.nats = connect(<ClientOpts>{ host : this.host, port: parseInt(this.port) });
    if (cb) {
      cb();
    }
  }

  public emit(address: string, data, headers, cb: (e: Error, d?: any) => void) {
    this.nats.request(address, JSON.stringify({b:data,h:headers}), { 'max': 1 }, (response) => {
      cb(null, JSON.parse(response));
    });
  }

  public on(address: string, func: Function) {
    this.nats.subscribe(address, (request, replyTo) => {
      var d:any = JSON.parse(request);
      func(d.b, d.h, (err, data) => {
        this.nats.publish(replyTo, JSON.stringify(data));
      });
    });
  }

  public publish(address: string, data, headers) {
    this.nats.publish(address, JSON.stringify({b:data,h:headers}));
  }

};

