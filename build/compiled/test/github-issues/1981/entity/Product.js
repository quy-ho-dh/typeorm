"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const tslib_1 = require("tslib");
const src_1 = require("../../../../src");
let Product = class Product {
};
tslib_1.__decorate([
    (0, src_1.PrimaryGeneratedColumn)("uuid"),
    tslib_1.__metadata("design:type", String)
], Product.prototype, "id", void 0);
tslib_1.__decorate([
    (0, src_1.Column)(),
    tslib_1.__metadata("design:type", Boolean)
], Product.prototype, "liked", void 0);
Product = tslib_1.__decorate([
    (0, src_1.Entity)()
], Product);
exports.Product = Product;
//# sourceMappingURL=Product.js.map