
import { EventBus } from "../../../dist";
import { Action } from "../../../dist";

@Action.rest("post","/teste")
@Action.auth("account", [])
export default class Teste extends Action {

  public async process(data: any, headers: any, reply: Function, fail: Function) {
    try{

      //console.log("teste");
      for (var i: number = 0; i < 1; i++) {
          let arr = await Promise.all([this.call("service@Teste2", data, headers), this.call("service@Teste3", data, headers)]);
          data = { 
            count: arr[0].count, 
            count2: arr[1].count2
          };
          //console.log(i + " -- " + JSON.stringify(data));     
      }

      reply(data);

    }catch(e){
      fail(e);
    }
  }
}
