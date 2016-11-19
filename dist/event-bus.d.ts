export declare class EventBus {
    private static _instance;
    static instance(): EventBus;
    private emitter;
    private localAddresses;
    private rpc;
    private serviceName;
    private type;
    constructor();
    connect(cb: () => void): void;
    emit(address: string, data?: any, headers?: any, cb?: (e: Error, d?: any) => void): void;
    publish(address: string, data?: any, headers?: any): void;
    on(addr: string, func: (d: any, h: any, reply: (d: any) => void, fail: (e: Error) => void) => void): void;
}
