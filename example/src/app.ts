import { MicroService } from 'micro-service';
import { Options } from 'micro-service';

var opt = new Options();

MicroService.start("service", opt, (eb) => {

  var t = new Date().getTime();

  eb.emit('service@Teste', { count: 0, count2: 0 }, { header: 'header' }, (err, data) => {
    console.log("fim -- " + (new Date().getTime() - t) + " - " + JSON.stringify(data) + " - " + (err ? err.message : ""));
  });


});


