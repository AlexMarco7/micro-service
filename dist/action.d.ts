export declare class Action {
    private serviceName;
    private eb;
    constructor(serviceName: any);
    private registerHttp();
    private listenHttpApi();
    private registerWebSocket();
    private listenWebSocketApi();
    private listen();
    options(): any;
    address(): string;
    process(data: any, headers: any, reply: (d: any) => void, fail: (e: Error) => void): Promise<void>;
    call(address: string, data?: any, headers?: any): Promise<any>;
    static http(method: string, path: string): Function;
    static websocket(address: string): Function;
    static auth(context: string, permissions?: Array<string>): Function;
    private static defaultOptionDecorator(optName, optValue);
}
