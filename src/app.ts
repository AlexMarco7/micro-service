import { EventBus } from './event-bus';
import { Teste } from './action/teste';

var eb = new EventBus();
eb.connect("service1", ()=>{
  
  eb.register(new Teste(eb));

  eb.emit('service2@Teste', {data : 'data'}, {header : 'header'}, (err, data) => {
     console.log("cbbbb" + JSON.stringify(data));
  });
  
});


