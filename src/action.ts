import { EventBus } from './event-bus';


export class Action {

  private eb: EventBus = EventBus.instance();

  public constructor() {
    console.log((this.options().rest || {}).path + "  -  " + (this.options().auth || {}).context);
  }

  public options(): any {
    return { address: this.address() };
  }

  public address(){
    return this.constructor.name;
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
 
  public static rest(path: string): Function {
    return Action.defaultOptionDecorator("rest", { path: path });
  }

  public static auth(context: string, permissions: Array<string> = []): Function {
    return Action.defaultOptionDecorator("auth", { context: context, permissions: permissions });
  }

  private static defaultOptionDecorator(optName: string, optValue: any) {
    return function(constructor: Function){
      var currOption = constructor.prototype.options;
      constructor.prototype.options = () => {
        var opt = currOption.apply(constructor.prototype);
        opt[optName] = optValue;
        return opt;
      };
    }
  }

}
