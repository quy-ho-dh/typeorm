"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const tslib_1 = require("tslib");
const src_1 = require("../../../../src");
let User = class User {
};
tslib_1.__decorate([
    (0, src_1.PrimaryGeneratedColumn)("identity"),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "id", void 0);
User = tslib_1.__decorate([
    (0, src_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=UserEntity.js.map