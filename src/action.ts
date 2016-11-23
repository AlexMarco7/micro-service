import { EventBus } from './event-bus';


export class Action {

  private eb: EventBus = EventBus.instance();

  public constructor(private serviceName) {

    if(this.options().rest){
     this.registerRest();
     this.listenRestApi();
    }

    this.listen();

  } 

  private registerRest(){
    console.log("registing " + this.options().rest.path);
    this.eb.publish("_micro-service@register-rest", { method : this.options().rest.method, path : this.options().rest.path, address : this.address()}, {});  
  }

  private listenRestApi(){
    this.eb.on("_micro-service@new-rest-api-avaiable",()=>{
      this.registerRest();
    });
  }

  private listen(){
    EventBus.instance().on(this.address(), (data: any, headers: any, reply: (d: any) => void, fail: (e: Error) => void) =>{
      //auth
      try{
        this.process(data, headers, reply, fail);
      }catch(e){
        fail(e);
      }
    });
  }

  public options(): any {
    return { };
  }

  public address(){
    return this.serviceName + "@" + this.constructor.name.split("(?<!(^|[A-Z]))(?=[A-Z])|(?<!^)(?=[A-Z][a-z])").join("-");
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
 
  public static rest(method: string, path: string): Function {
    return Action.defaultOptionDecorator("rest", { method: method || "post", path: path });
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
