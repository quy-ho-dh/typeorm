"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostWithOptions = void 0;
const tslib_1 = require("tslib");
const Entity_1 = require("../../../../../../src/decorator/entity/Entity");
const PrimaryColumn_1 = require("../../../../../../src/decorator/columns/PrimaryColumn");
const Column_1 = require("../../../../../../src/decorator/columns/Column");
let PostWithOptions = class PostWithOptions {
};
tslib_1.__decorate([
    (0, PrimaryColumn_1.PrimaryColumn)(),
    tslib_1.__metadata("design:type", Number)
], PostWithOptions.prototype, "id", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("numeric", { precision: 5, scale: 2 }),
    tslib_1.__metadata("design:type", String)
], PostWithOptions.prototype, "numeric", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("decimal", { precision: 5, scale: 2 }),
    tslib_1.__metadata("design:type", String)
], PostWithOptions.prototype, "decimal", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("char", { length: 3 }),
    tslib_1.__metadata("design:type", String)
], PostWithOptions.prototype, "char", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("character", { length: 3 }),
    tslib_1.__metadata("design:type", String)
], PostWithOptions.prototype, "character", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("varchar", { length: 30 }),
    tslib_1.__metadata("design:type", String)
], PostWithOptions.prototype, "varchar", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("character varying", { length: 30 }),
    tslib_1.__metadata("design:type", String)
], PostWithOptions.prototype, "characterVarying", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("timestamp", { precision: 3 }),
    tslib_1.__metadata("design:type", Date)
], PostWithOptions.prototype, "timestamp", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("timestamp with time zone", { precision: 5 }),
    tslib_1.__metadata("design:type", Date)
], PostWithOptions.prototype, "timestampWithTimeZone", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("time", { precision: 3 }),
    tslib_1.__metadata("design:type", String)
], PostWithOptions.prototype, "time", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("time with time zone", { precision: 5 }),
    tslib_1.__metadata("design:type", String)
], PostWithOptions.prototype, "timeWithTimeZone", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("int4range", { nullable: true }),
    tslib_1.__metadata("design:type", String)
], PostWithOptions.prototype, "int4range", void 0);
PostWithOptions = tslib_1.__decorate([
    (0, Entity_1.Entity)()
], PostWithOptions);
exports.PostWithOptions = PostWithOptions;
//# sourceMappingURL=PostWithOptions.js.map