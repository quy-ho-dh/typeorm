"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Foo = void 0;
const tslib_1 = require("tslib");
const src_1 = require("../../../../src");
let Foo = class Foo extends src_1.BaseEntity {
};
tslib_1.__decorate([
    (0, src_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Foo.prototype, "id", void 0);
tslib_1.__decorate([
    (0, src_1.Column)({ default: 1, type: "int" }),
    tslib_1.__metadata("design:type", Number)
], Foo.prototype, "bar_default_1", void 0);
tslib_1.__decorate([
    (0, src_1.Column)({ default: -1, type: "int" }),
    tslib_1.__metadata("design:type", Number)
], Foo.prototype, "bar_default_minus_1", void 0);
Foo = tslib_1.__decorate([
    (0, src_1.Entity)("foo")
], Foo);
exports.Foo = Foo;
//# sourceMappingURL=foo.entity.js.map