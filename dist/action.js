"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const event_bus_1 = require('./event-bus');
class Action {
    constructor(serviceName) {
        this.serviceName = serviceName;
        this.eb = event_bus_1.EventBus.instance();
        if (this.options().rest) {
            this.registerRest();
            this.listenRestApi();
        }
        this.listen();
    }
    registerRest() {
        console.log("registing " + this.options().rest.path);
        this.eb.publish("_micro-service@register-rest", { method: this.options().rest.method, path: this.options().rest.path, address: this.address() }, {});
    }
    listenRestApi() {
        this.eb.on("_micro-service@new-rest-api-avaiable", () => {
            this.registerRest();
        });
    }
    listen() {
        event_bus_1.EventBus.instance().on(this.address(), (data, headers, reply, fail) => {
            //auth
            try {
                this.process(data, headers, reply, fail);
            }
            catch (e) {
                fail(e);
            }
        });
    }
    options() {
        return {};
    }
    address() {
        return this.serviceName + "@" + this.constructor.name;
    }
    process(data, headers, reply, fail) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    call(address, data, headers) {
        return new Promise((resolve, reject) => {
            this.eb.emit(address, data || {}, headers || {}, (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(data);
                }
            });
        });
    }
    //static
    static rest(method, path) {
        return Action.defaultOptionDecorator("rest", { method: method || "post", path: path });
    }
    static auth(context, permissions = []) {
        return Action.defaultOptionDecorator("auth", { context: context, permissions: permissions });
    }
    static defaultOptionDecorator(optName, optValue) {
        return function (constructor) {
            var currOption = constructor.prototype.options;
            constructor.prototype.options = () => {
                var opt = currOption.apply(constructor.prototype);
                opt[optName] = optValue;
                return opt;
            };
        };
    }
}
exports.Action = Action;
