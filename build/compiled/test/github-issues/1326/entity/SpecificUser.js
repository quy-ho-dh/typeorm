"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecificUser = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../../src/index");
let SpecificUser = class SpecificUser {
};
tslib_1.__decorate([
    (0, index_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], SpecificUser.prototype, "id", void 0);
tslib_1.__decorate([
    (0, index_1.Column)(),
    tslib_1.__metadata("design:type", String)
], SpecificUser.prototype, "name", void 0);
SpecificUser = tslib_1.__decorate([
    (0, index_1.Entity)("user", { database: "db_2" })
], SpecificUser);
exports.SpecificUser = SpecificUser;
//# sourceMappingURL=SpecificUser.js.map