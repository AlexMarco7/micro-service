
import { Action } from "../../../dist";

export default class Teste2 extends Action{

  public async process(data: any, headers: any, reply: (d:any) => void, fail: (e: Error) => void) {
    //console.log("teste2");
    data.count++;
    reply(data);
    
    //fail(new Error("teste")); 
  }
}