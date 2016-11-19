
import { EventBus } from './event-bus';
import { Options } from './options';
import * as restify from 'restify';
import { Server } from 'restify';
import { Request } from 'restify';
import { Response } from 'restify';
import { Next } from 'restify';

export class Rest{

  public static start(options:any , eb: EventBus, cb:() => void) {
    var server:Server = restify.createServer();
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    server.listen(options.port, () => {
      if(cb){
        cb();
      }
      eb.publish("_micro-service@new-rest-api-avaiable");
    });

    var map : any = {
      get : {}, post : {}, put : {}, del : {}
    };

    for(let method in  map){
      server[method](/(.*)/,(req: Request, res: Response, next: Next) => { console.log(req.path());
        if(!map[method][req.path()]){
          res.send(404);
          return;
        }
        
        var header : any = {};

        for(var k in req.params){
          header[k] = req.params[k];
        }
          
        eb.emit(map[method][req.path()], req.body, header, (err: Error, data: any) => {
          if(err)
            res.send(500, {error : err.message});
          else
            res.send(data);
        }); 

      });
    }

    eb.on("_micro-service@register-rest", (data) => {
      console.log("registing " + options.prefix + data.path);
      map[data.method][options.prefix + data.path] = data.address;
    });

  }

 
}

