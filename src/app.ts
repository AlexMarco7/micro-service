import { MicroService } from './micro-service';

MicroService.start("service", ["action", "flow"], (eb) => {

  var t = new Date().getTime();

  eb.emit('service@Teste', { count: 0, count2: 0 }, { header: 'header' }, (err, data) => {
    console.log("fim -- " + (new Date().getTime() - t) + " - " + JSON.stringify(data) + " - " + (err ? err.message : ""));
  });


});


