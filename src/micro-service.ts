
import { readdirSync } from 'fs';
import { EventBus } from './event-bus';

export module MicroService {

  export function start(dirs: Array<string>, cb: (eb: EventBus) => void) {
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
      EventBus.register(require(__dirname + "/" + dir + "/" + filename).default);
    });
  }

}