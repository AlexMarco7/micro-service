
import { readdirSync } from 'fs';
import { EventBus } from './event-bus';

export module MicroService {

  export function start(name:string, dirs: Array<string>, cb: (eb: EventBus) => void) {
    var eb = EventBus.instance();

    eb.connect(() => {
      dirs.forEach((d) => {
        startActions(d);
      });

      cb(eb);
    });
  }

  function startActions(dir: string) {
    var files = readdirSync(__dirname + "/" + dir);

    files.forEach((filename) => {
      new (require(__dirname + "/" + dir + "/" + filename).default);
    });
  }

}