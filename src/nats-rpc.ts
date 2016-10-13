
import { connect } from 'nats';
import { Client } from 'nats';
import { ClientOpts } from 'nats';
import { RPC } from './rpc';

export class NatsRPC implements RPC {
  private nats: Client;

  public constructor(public host = "localhost") {

  }

  public connect(cb: () => void) {
    this.nats = connect(<ClientOpts>{port : 4222});
    if(cb){
      cb();
    } 
  }

  public emit(address: string, data, headers, cb: (e: Error, d?: any) => void) {
    this.nats.request(address, JSON.stringify(data), { 'max': 1 }, (response) => {
      cb(null, JSON.parse(response));
    });
  }

  public on(address: string, func) {
    this.nats.subscribe(address, (request, replyTo) => {
      func(JSON.parse(request), {}, (err, data) => { console.log(replyTo);
        this.nats.publish(replyTo, JSON.stringify(data));
      });
  });
}

};

