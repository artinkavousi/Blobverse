"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUniformGrid = createUniformGrid;
exports.neighbours = neighbours;
var bitecs_1 = require("bitecs");
var components_1 = require("./components");
var key = function (x, y, z, h) {
    return "".concat(Math.floor(x / h), "_").concat(Math.floor(y / h), "_").concat(Math.floor(z / h));
};
/** Build a uniform-grid hashmap so neighbor look-ups are O(1). */
function createUniformGrid(world, h) {
    var _a;
    var map = new Map();
    var q = (0, bitecs_1.enterQuery)((0, bitecs_1.defineQuery)([components_1.Position]))(world);
    for (var _i = 0, q_1 = q; _i < q_1.length; _i++) {
        var eid = q_1[_i];
        var k = key(components_1.Position.x[eid], components_1.Position.y[eid], components_1.Position.z[eid], h);
        var cell = (_a = map.get(k)) !== null && _a !== void 0 ? _a : [];
        cell.push(eid);
        map.set(k, cell);
    }
    return map;
}
/** Iterate nearby particles and run `fn(j)` for each neighbor j. */
function neighbours(eid, grid, h, fn) {
    var baseKey = key(components_1.Position.x[eid], components_1.Position.y[eid], components_1.Position.z[eid], h);
    var _a = baseKey.split('_').map(Number), cx = _a[0], cy = _a[1], cz = _a[2];
    for (var dx = -1; dx <= 1; dx++)
        for (var dy = -1; dy <= 1; dy++)
            for (var dz = -1; dz <= 1; dz++) {
                var cell = grid.get("".concat(cx + dx, "_").concat(cy + dy, "_").concat(cz + dz));
                if (!cell)
                    continue;
                for (var _i = 0, cell_1 = cell; _i < cell_1.length; _i++) {
                    var j = cell_1[_i];
                    fn(j);
                }
            }
}
