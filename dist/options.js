"use strict";
class Options {
    constructor() {
        this.dirs = ["action", "flow"];
        this.http = { ip: "0.0.0.0", port: 8080, prefix: "/api/v1" };
    }
}
exports.Options = Options;
