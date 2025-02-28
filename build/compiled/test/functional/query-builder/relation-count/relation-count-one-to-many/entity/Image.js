"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const tslib_1 = require("tslib");
const Entity_1 = require("../../../../../../src/decorator/entity/Entity");
const PrimaryGeneratedColumn_1 = require("../../../../../../src/decorator/columns/PrimaryGeneratedColumn");
const Column_1 = require("../../../../../../src/decorator/columns/Column");
const Category_1 = require("./Category");
const ManyToOne_1 = require("../../../../../../src/decorator/relations/ManyToOne");
let Image = class Image {
    constructor() {
        this.isRemoved = false;
    }
};
tslib_1.__decorate([
    (0, PrimaryGeneratedColumn_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Image.prototype, "id", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Image.prototype, "name", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", Boolean)
], Image.prototype, "isRemoved", void 0);
tslib_1.__decorate([
    (0, ManyToOne_1.ManyToOne)((type) => Category_1.Category, (category) => category.images),
    tslib_1.__metadata("design:type", Array)
], Image.prototype, "category", void 0);
Image = tslib_1.__decorate([
    (0, Entity_1.Entity)()
], Image);
exports.Image = Image;
//# sourceMappingURL=Image.js.map