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
        if (this.options().http) {
            this.registerHttp();
            this.listenHttpApi();
        }
        if (this.options().websocket) {
            this.registerWebSocket();
            this.listenWebSocketApi();
        }
        this.listen();
    }
    registerHttp() {
        if (typeof this.options().http.method == "string")
            this.eb.publish("micro-service@register-http", { method: this.options().http.method, path: this.options().http.path, address: this.address() }, {});
        else
            for (let method in this.options().http.method)
                this.eb.publish("micro-service@register-http", { method: method, path: this.options().http.path, address: this.address() }, {});
    }
    listenHttpApi() {
        this.eb.on("micro-service@new-http-api-avaiable", () => {
            this.registerHttp();
        });
    }
    registerWebSocket() {
        if (typeof this.options().websocket.method == "string")
            this.eb.publish("micro-service@register-web-socket", { websocket: this.options().websocket.address, address: this.address() }, {});
        else
            for (let address in this.options().websocket.address)
                this.eb.publish("micro-service@register-web-socket", { websocket: address, address: this.address() }, {});
    }
    listenWebSocketApi() {
        this.eb.on("micro-service@new-web-socket-api-avaiable", () => {
            this.registerWebSocket();
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
        return this.serviceName + "@" + this.constructor.name.split(/(?=[0-9||A-Z])/).join("-").toLowerCase();
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
    static http(method, path) {
        return Action.defaultOptionDecorator("http", { method: method || "post", path: path });
    }
    static websocket(address) {
        return Action.defaultOptionDecorator("websocket", { address: address });
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
