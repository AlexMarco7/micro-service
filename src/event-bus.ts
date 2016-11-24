
import { EventEmitter } from 'events';
import { RPC } from './rpc';
import { NatsRPC } from './nats-rpc';
import { Action } from './action';

export class EventBus {
  private static _instance:EventBus;
  public static instance():EventBus{
    return EventBus._instance || new EventBus();
  }

  private emitter: EventEmitter = new EventEmitter();
  private localAddresses: any = {};
  private rpc: RPC;
  private serviceName:string = "service";
  private type:string = process.env["MS_EVENT_BUS_TYPE"] || 'local';

  public constructor() {
    this.rpc = new NatsRPC();
    EventBus._instance = this;
  }

  public connect(cb: () => void) {
    this.rpc.connect(cb);
  }

  public emit(address: string, data : any = {}, headers : any = {}, cb: (e: Error, d?: any) => void = null, timeout : number = null) {
    let callback = (e: Error, d?: any)=>{
       if(cb)
         cb(e,d);
       cb = null;  
    };

    if (this.type != "rpc" && this.localAddresses[address]) {
      this.emitter.emit(address, data, headers, callback);
      setTimeout(() => {
        var err = new Error("Timeout");
        err.name = "500";
        callback(err, null);
      }, timeout || parseInt(process.env["MS_EVENT_BUS_TIMEOUT"] || "30000"));
    } else {
      this.rpc.emit(address, data, headers, callback, timeout || parseInt(process.env["MS_EVENT_BUS_TIMEOUT"]  || "30000"));
    }
  };

  public publish(address: string, data: any = {}, headers: any = {}) {
    if (this.type != "rpc" && this.localAddresses[address]) {
      this.emitter.emit(address, data, headers);
    } else {
      this.rpc.publish(address, data, headers);
    }
  };

  public on(addr: string, func: (d: any, h: any, reply: (d: any) => void, fail: (e: Error, code: string) => void) => void) {
    this.localAddresses[addr] = true;

    var f = (d: any, h: any, cb: (e: Error, d?: any) => {}) => {
      func(d, h, (d) => {
        cb(null, d || {});
      }, (err: Error, code: string = "500") => {
        err.name = code;
        cb(err);
      });
    };

    this.rpc.on(addr, f);
    this.emitter.on(addr, f);
  };

};
