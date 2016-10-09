"use strict";
const action_1 = require('../action');
class Teste extends action_1.Action {
    process(data, headers, reply, fail) {
        console.log("aaquiiii - " + JSON.stringify(data) + " - " + JSON.stringify(headers));
        reply(data);
    }
}
exports.Teste = Teste;
