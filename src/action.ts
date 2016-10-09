import { EventBus } from './event-bus';


export class Action {

  public constructor(private eb : EventBus){}

  public address(){
    return this.constructor.name; 
  }
  
  public process(data: any, headers: any, reply: (d:any) => void, fail: (e: Error) => void){

  }

}