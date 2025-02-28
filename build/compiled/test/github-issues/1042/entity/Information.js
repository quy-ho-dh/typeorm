"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Information = void 0;
const tslib_1 = require("tslib");
const Column_1 = require("../../../../src/decorator/columns/Column");
class Information {
}
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Information.prototype, "maritalStatus", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Information.prototype, "gender", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Information.prototype, "address", void 0);
exports.Information = Information;
//# sourceMappingURL=Information.js.map