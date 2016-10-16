
import { Action } from '../action';

export default class Teste3 extends Action{

  public async process(data: any, headers: any, reply: (d:any) => void, fail: (e: Error) => void) {
    //console.log("teste2");
    data.count2+=2;
    reply(data); 
  }
} 