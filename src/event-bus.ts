/// <reference path="../typings/index.d.ts" />

import { EventEmitter } from 'events';
import { RPC } from './rpc';
import { NatsRPC } from './nats-rpc';
import { Action } from './action';

export class EventBus {
  private emitter: EventEmitter = new EventEmitter();
  private localAddresses: any = {};
  private rpc: RPC;
  private serviceName: string;

  public constructor() {
    this.rpc = new NatsRPC();
  }

  public connect(serviceName: string, cb: () => void) {
    this.serviceName = serviceName;
    this.rpc.connect(cb);
  }

  public emit(address: string, data: any, headers: any, cb: (e: Error, d?: any) => void) {
    if (this.localAddresses[address]) {
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

  public register(action: Action) {
    this.on(action.address(), action.process);
  }

};
