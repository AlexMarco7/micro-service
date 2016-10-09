"use strict";
class Action {
    constructor(eb) {
        this.eb = eb;
    }
    address() {
        console.log(this.constructor.name);
        return this.constructor.name;
    }
    process(data, headers, reply, fail) {
    }
}
exports.Action = Action;
