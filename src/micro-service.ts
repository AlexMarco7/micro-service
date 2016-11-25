
import { readdirSync } from 'fs';
import { EventBus } from './event-bus';
import { Options } from './options';
import { Http } from './http';

export class MicroService{

  public static start(name:string, opt: Options = new Options(), cb: (eb: EventBus) => void = null) {
    var eb = EventBus.instance();

    eb.connect(() => {
      MicroService.startDirs(name, opt, eb, ()=>{
        if(process.env["MS_HTTP"]){
          Http.start(eb, ()=>{});
        }
        cb(eb);
      });
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

