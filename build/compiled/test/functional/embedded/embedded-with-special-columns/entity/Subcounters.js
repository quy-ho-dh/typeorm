"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subcounters = void 0;
const tslib_1 = require("tslib");
const Column_1 = require("../../../../../src/decorator/columns/Column");
const VersionColumn_1 = require("../../../../../src/decorator/columns/VersionColumn");
class Subcounters {
}
tslib_1.__decorate([
    (0, VersionColumn_1.VersionColumn)(),
    tslib_1.__metadata("design:type", Number)
], Subcounters.prototype, "version", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Subcounters.prototype, "watches", void 0);
exports.Subcounters = Subcounters;
//# sourceMappingURL=Subcounters.js.map