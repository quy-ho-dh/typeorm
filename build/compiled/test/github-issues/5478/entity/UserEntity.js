"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const tslib_1 = require("tslib");
const src_1 = require("../../../../src");
const src_2 = require("../../../../src");
var UserType;
(function (UserType) {
    UserType["ADMIN"] = "ADMIN";
    UserType["USER"] = "USER";
})(UserType || (UserType = {}));
let UserEntity = class UserEntity {
};
tslib_1.__decorate([
    (0, src_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
tslib_1.__decorate([
    (0, src_1.Column)({ type: "enum", enum: UserType }),
    tslib_1.__metadata("design:type", String)
], UserEntity.prototype, "userType", void 0);
UserEntity = tslib_1.__decorate([
    (0, src_2.Entity)("user")
], UserEntity);
exports.UserEntity = UserEntity;
//# sourceMappingURL=UserEntity.js.map