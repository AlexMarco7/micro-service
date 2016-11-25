import { EventBus } from './event-bus';


export class Action {

  private eb: EventBus = EventBus.instance();

  public constructor(private serviceName) {
    this.listen();

    if (this.options().http) {
      this.registerHttp();
      this.listenHttpApi();
    }

    if (this.options().websocket) {
      this.registerWebSocket();
      this.listenWebSocketApi();
    }

  }

  private registerHttp() {
    if (typeof this.options().http.method == "string")
      this.eb.publish("micro-service@register-http", { method: this.options().http.method, path: this.options().http.path, address: this.address() }, {});
    else
      for (let method in this.options().http.method)
        this.eb.publish("micro-service@register-http", { method: method, path: this.options().http.path, address: this.address() }, {});

  }

  private listenHttpApi() {
    this.eb.on("micro-service@new-http-api-avaiable", () => {
      this.registerHttp();
    });
  }
  
  private registerWebSocket() {
    if (typeof this.options().websocket.method == "string")
      this.eb.publish("micro-service@register-web-socket", { websocket: this.options().websocket.address, address: this.address() }, {});
    else
      for (let address in this.options().websocket.address)
        this.eb.publish("micro-service@register-web-socket", { websocket: address, address: this.address() }, {});
  }

  private listenWebSocketApi() {
    this.eb.on("micro-service@new-web-socket-api-avaiable", () => {
      this.registerWebSocket();
    });
  }

  private listen() {
    EventBus.instance().on(this.address(), (data: any, headers: any, reply: (d: any) => void, fail: (e: Error) => void) => {
      //auth
      
      try {
        this.process(data, headers, reply, fail);
      } catch (e) { 
        fail(e);
      }
    });
  }

  public options(): any {
    return {};
  }

  public address() {
    return this.serviceName + "@" + this.constructor.name.split(/(?=[0-9||A-Z])/).join("-").toLowerCase();
  }

  public async process(data: any, headers: any, reply: (d: any) => void, fail: (e: Error) => void) { }

  public call(address: string, data?: any, headers?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.eb.emit(address, data || {}, headers || {}, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }


  //static

  public static http(method: string, path: string): Function {
    return Action.defaultOptionDecorator("http", { method: method || "post", path: path });
  }

  public static websocket(address: string): Function {
    return Action.defaultOptionDecorator("websocket", { address: address });
  }

  public static auth(context: string, permissions: Array<string> = []): Function {
    return Action.defaultOptionDecorator("auth", { context: context, permissions: permissions });
  }

  private static defaultOptionDecorator(optName: string, optValue: any) {
    return function (constructor: Function) {
      var currOption = constructor.prototype.options;
      constructor.prototype.options = () => {
        var opt = currOption.apply(constructor.prototype);
        opt[optName] = optValue;
        return opt;
      };
    }
  }

}
