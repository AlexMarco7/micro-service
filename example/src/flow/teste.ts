//import { Action } from "../../../dist";
import { Action } from "micro-service";
//import { EventBus } from "../../../dist";
import { EventBus } from "micro-service";

@Action.http("post","/teste")
@Action.auth("account", [])
export default class Teste extends Action {

  public async process(data: any, headers: any, reply: Function, fail: Function) {
    try{
      //fail(new Error("Unauthorized"),401);
      //console.log("teste");
      for (var i: number = 0; i < 1000; i++) {
        //parallel  call
         // let arr = await Promise.all([this.call("service@teste-2", data, headers), this.call("service@teste-3", data, headers)]);
        /*  data = { 
            count: arr[0].count, 
            count2: arr[1].count2
          };*/ 
         //console.log(i + " -- " + JSON.stringify(data));  
         data = await this.call("service@teste-3", data, headers);   
      }

      reply(data);

    }catch(e){ 
      fail(e);
    }
  }
}
