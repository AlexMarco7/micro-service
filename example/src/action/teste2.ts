import { Action } from "../../../dist";
//import { Action } from "micro-service";

export default class Teste2 extends Action{

  public async process(data: any, headers: any, reply: (d:any) => void, fail: (e: Error) => void) {
    data.count++;
    reply(data);
  }
}