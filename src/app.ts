import { EventBus } from './event-bus';
import { Teste } from './action/teste';

var eb = new EventBus();
eb.connect("service2", ()=>{
  
  eb.register(new Teste(eb));

  var t = new Date().getTime();

  var loop = function(data:any){ 
    if(data.count < 1000)
      eb.emit('service1@Teste', data, {header : 'header'}, (err, data) => {
        loop(data);
      }); 
    else{
      console.log("fim -- " + (new Date().getTime() - t));
    }  
  };

  loop({count:0});

});


