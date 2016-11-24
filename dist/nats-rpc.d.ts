import { RPC } from './rpc';
export declare class NatsRPC implements RPC {
    private nats;
    host: string;
    port: string;
    constructor();
    connect(cb: () => void): void;
    emit(address: string, data: any, headers: any, cb: (e: Error, d?: any) => void, timeout: number): void;
    on(address: string, func: Function): void;
    publish(address: string, data: any, headers: any): void;
}
