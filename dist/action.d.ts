export declare class Action {
    private serviceName;
    private eb;
    constructor(serviceName: any);
    private registerRest();
    private listenRestApi();
    private listen();
    options(): any;
    address(): string;
    process(data: any, headers: any, reply: (d: any) => void, fail: (e: Error) => void): Promise<void>;
    call(address: string, data?: any, headers?: any): Promise<any>;
    static rest(method: string, path: string): Function;
    static auth(context: string, permissions?: Array<string>): Function;
    private static defaultOptionDecorator(optName, optValue);
}
