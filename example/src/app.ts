//import { MicroService } from "../../dist";
import { MicroService } from "micro-service";
//import { Options } from "../../dist";
import { Options } from "micro-service";

var opt = new Options();

MicroService.start("service", opt, (eb) => {


  eb.emit('service@teste', { count: 0, count2: 0 }, { header: 'header' }, (err, data) => {
    
  });  

  
});
 

