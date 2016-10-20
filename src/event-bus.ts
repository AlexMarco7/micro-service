/// <reference path="../typings/index.d.ts" />

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
  private type:string = 'auto';

  public constructor() {
    this.rpc = new NatsRPC();
    EventBus._instance = this;
  }

  public connect(cb: () => void) {
    this.rpc.connect(cb);
  }

  public emit(address: string, data: any, headers: any, cb: (e: Error, d?: any) => void) {
    if (this.type != "rpc" && this.localAddresses[address]) {
      this.emitter.emit(address, data, headers, cb);
    } else {
      this.rpc.emit(address, data, headers, cb);
    }
  };

  public on(address: string, func: (d: any, h: any, reply: (d: any) => void, fail: (e: Error) => void) => void) {
    var addr = this.serviceName + "@" + address;
    this.localAddresses[addr] = true;

    var f = (d: any, h: any, cb: (e: Error, d?: any) => {}) => {
      func(d, h, (d) => {
        cb(null, d || {});
      }, (err: Error) => {
        cb(err);
      });
    };

    this.rpc.on(addr, f);
    this.emitter.on(addr, f);
  };

};
