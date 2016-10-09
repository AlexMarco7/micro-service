
import { Action } from '../action';

export class Teste extends Action{

  public process(data: any, headers: any, reply: (d:any) => void, fail: (e: Error) => void) {
    reply(data);
  }
}