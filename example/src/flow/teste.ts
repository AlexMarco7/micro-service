import { Action } from "../../../dist";
//import { Action } from "micro-service";
import { EventBus } from "../../../dist";
//import { EventBus } from "micro-service";

@Action.http("post","/teste")
export default class Teste extends Action {

  public async process(data: any, headers: any, reply: Function, fail: Function) {
    try{
      //fail(new Error("Unauthorized"),401);
      
      var t = new Date().getTime();

      for (var i: number = 0; i < 10000; i++) {
        //parallel  call
         let arr = await Promise.all([this.call("service@teste-2", data, headers), this.call("service@teste-3", data, headers)]);
         data = { 
            count: arr[0].count, 
            count2: arr[1].count2
         };      
      } 

      console.log("time: " + (new Date().getTime() - t) + " - " + JSON.stringify(data) );

      reply(data);
 
    }catch(e){  
      fail(e);
    }
  }
}
