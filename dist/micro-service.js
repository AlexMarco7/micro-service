"use strict";
const fs_1 = require('fs');
const event_bus_1 = require('./event-bus');
const options_1 = require('./options');
const http_1 = require('./http');
class MicroService {
    static start(name, opt = new options_1.Options(), cb = null) {
        var eb = event_bus_1.EventBus.instance();
        eb.connect(() => {
            if (process.env["MS_HTTP"]) {
                http_1.Http.start(eb, () => {
                    MicroService.startDirs(name, opt, eb, cb);
                });
            }
            else {
                MicroService.startDirs(name, opt, eb, cb);
            }
        });
    }
    static startDirs(name, opt = new options_1.Options(), eb, cb = null) {
        opt.dirs.forEach((d) => {
            MicroService.startActions(name, d);
        });
        cb(eb);
    }
    static startActions(name, dir) {
        var files = fs_1.readdirSync(process.cwd() + "/" + dir);
        files.forEach((filename) => {
            new (require(process.cwd() + "/" + dir + "/" + filename).default)(name);
        });
    }
}
exports.MicroService = MicroService;
