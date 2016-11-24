
import { EventBus } from './event-bus';
import { Options } from './options';
import * as restify from 'restify';
import { Server } from 'restify';
import { Request } from 'restify';
import { Response } from 'restify';
import { Next } from 'restify';

export class Http{

  public static start(eb: EventBus, cb:() => void) {
    var server:Server = restify.createServer();
    server.use(restify.queryParser());
    server.use(restify.bodyParser());

    var ip = process.env["MS_HTTP_IP"] || "0.0.0.0"; 
    var port = process.env["MS_HTTP_PORT"] || 8080;
    var prefix = process.env["MS_HTTP_PREFIX"] || "/api/v1";   

    server.listen(ip, port, () => {
      if(cb){
        cb();
      }
      eb.publish("micro-service@new-http-api-avaiable");
    });

    eb.on("micro-service@register-http", (data) => {
      console.log("registering " + prefix + data.path);
      server[data.method](prefix + data.path,(req: Request, res: Response, next: Next) => { console.log(req.path());

        var header : any = {}; 

        for(var k in req.query){
          header[k] = req.query[k];
        }

        for(var k in req.params){
          header[k] = req.params[k];
        }
          
        eb.emit(data.address, req.body, header, (err: Error, data: any) => {
          if(err)
            res.send(err.name ? parseInt(err.name) : 500, {error : err.message});
          else
            res.send(data);
        }); 

      });
    });

  }

 
}

