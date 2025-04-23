"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disableSystem = exports.enableSystem = exports.register = exports.World = exports.IoC = void 0;
require("reflect-metadata");
const bitecs_1 = require("bitecs");
const inversify_1 = require("inversify");
exports.IoC = new inversify_1.Container();
exports.World = (0, bitecs_1.createWorld)();
const register = (System, opts = {}) => {
    if (!exports.IoC.isBound(System)) {
        exports.IoC.bind(System).toSelf().inSingletonScope();
    }
    const instance = exports.IoC.get(System);
    exports.World.systems = [...(exports.World.systems ?? []), instance];
};
exports.register = register;
const enableSystem = (System, opts = {}) => {
    if (!exports.IoC.isBound(System)) {
        exports.IoC.bind(System).toSelf().inSingletonScope();
    }
    const instance = exports.IoC.get(System);
    if (!(exports.World.systems ?? []).some((s) => s instanceof System)) {
        exports.World.systems = [...(exports.World.systems ?? []), instance];
    }
};
exports.enableSystem = enableSystem;
const disableSystem = (System) => {
    exports.World.systems = (exports.World.systems ?? []).filter((s) => !(s instanceof System));
};
exports.disableSystem = disableSystem;
