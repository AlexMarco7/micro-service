
import { Action } from '../action';

export class Teste2 extends Action{

  public process(data: any, headers: any, reply: (d:any) => void, fail: (e: Error) => void) {
    data.count++;
    reply(data); 
  }
}