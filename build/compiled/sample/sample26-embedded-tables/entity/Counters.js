"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Counters = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../src/index");
class Counters {
}
tslib_1.__decorate([
    (0, index_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Counters.prototype, "raiting", void 0);
tslib_1.__decorate([
    (0, index_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Counters.prototype, "stars", void 0);
tslib_1.__decorate([
    (0, index_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Counters.prototype, "commentCount", void 0);
tslib_1.__decorate([
    (0, index_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Counters.prototype, "metadata", void 0);
exports.Counters = Counters;
//# sourceMappingURL=Counters.js.map