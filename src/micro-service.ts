
import { readdirSync } from 'fs';
import { EventBus } from './event-bus';
import { Options } from './options';
import { Rest } from './rest';

export class MicroService{

  public static start(name:string, opt: Options = new Options(), cb: (eb: EventBus) => void = null) {
    var eb = EventBus.instance();

    eb.connect(() => {
      if(opt.http){
        Rest.start(opt.http, eb, ()=>{
          MicroService.startDirs(name, opt, eb, cb);
        });
      }else{
        MicroService.startDirs(name, opt, eb, cb);
      }      
    });
  }

  private static startDirs(name:string, opt: Options = new Options(), eb: EventBus, cb: (eb: EventBus) => void = null) {
    opt.dirs.forEach((d) => { 
      MicroService.startActions(name, d);
    });

    cb(eb);
  }

  private static startActions(name:string, dir: string) {
    var files = readdirSync(process.cwd() + "/" + dir);

    files.forEach((filename) => {
      new (require(process.cwd() + "/" + dir + "/" + filename).default)(name);
    });
  }

}

