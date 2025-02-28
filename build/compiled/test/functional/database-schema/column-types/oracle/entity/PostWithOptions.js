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
    (0, Column_1.Column)("number", { precision: 10, scale: 5 }),
    tslib_1.__metadata("design:type", Number)
], PostWithOptions.prototype, "number", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("numeric", { precision: 10, scale: 5 }),
    tslib_1.__metadata("design:type", Number)
], PostWithOptions.prototype, "numeric", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("dec", { precision: 10, scale: 5 }),
    tslib_1.__metadata("design:type", Number)
], PostWithOptions.prototype, "dec", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("decimal", { precision: 10, scale: 5 }),
    tslib_1.__metadata("design:type", Number)
], PostWithOptions.prototype, "decimal", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("float", { precision: 24 }),
    tslib_1.__metadata("design:type", Number)
], PostWithOptions.prototype, "float", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("char", { length: 3 }),
    tslib_1.__metadata("design:type", String)
], PostWithOptions.prototype, "char", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("nchar", { length: 3 }),
    tslib_1.__metadata("design:type", String)
], PostWithOptions.prototype, "nchar", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("varchar2", { length: 50 }),
    tslib_1.__metadata("design:type", String)
], PostWithOptions.prototype, "varchar2", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("nvarchar2", { length: 40 }),
    tslib_1.__metadata("design:type", String)
], PostWithOptions.prototype, "nvarchar2", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("raw", { length: 500 }),
    tslib_1.__metadata("design:type", Buffer
    // -------------------------------------------------------------------------
    // Date Types
    // -------------------------------------------------------------------------
    )
], PostWithOptions.prototype, "raw", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("timestamp", { precision: 5 }),
    tslib_1.__metadata("design:type", Date)
], PostWithOptions.prototype, "timestamp", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("timestamp with time zone", { precision: 6 }),
    tslib_1.__metadata("design:type", Date)
], PostWithOptions.prototype, "timestampWithTimeZone", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("timestamp with local time zone", { precision: 7 }),
    tslib_1.__metadata("design:type", Date)
], PostWithOptions.prototype, "timestampWithLocalTimeZone", void 0);
PostWithOptions = tslib_1.__decorate([
    (0, Entity_1.Entity)()
], PostWithOptions);
exports.PostWithOptions = PostWithOptions;
//# sourceMappingURL=PostWithOptions.js.map