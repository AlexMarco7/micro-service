"use strict";
const event_bus_1 = require('./event-bus');
const teste_1 = require('./action/teste');
var eb = new event_bus_1.EventBus("service1", () => {
    eb.register(new teste_1.Teste(eb));
    eb.emit('service2@Teste', { data: 'data' }, { header: 'header' }, (err, data) => {
        console.log("cbbbb" + JSON.stringify(data));
    });
});
