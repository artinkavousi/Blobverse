"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useJumpFloodSdf = useJumpFloodSdf;
const react_1 = require("react");
const JumpFloodSdfSystem_1 = require("./JumpFloodSdfSystem");
// Hook that returns the current SDF texture and triggers on each SDF compute
function useJumpFloodSdf() {
    return (0, react_1.useSyncExternalStore)((callback) => {
        // no-op: R3F frame loop updates texture in RayMarchMesh
        return () => { };
    }, () => JumpFloodSdfSystem_1.JumpFloodSdfSystem.instance?.texture);
}
