export interface RPC {
    connect(cb: () => void): any;
    emit(address: string, data: any, headers: any, cb: (e: Error, d?) => void): any;
    on(address: string, func: any): any;
    publish(address: string, data: any, headers: any): any;
}
