"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Image = void 0;
const tslib_1 = require("tslib");
const Entity_1 = require("../../../../../src/decorator/entity/Entity");
const PrimaryGeneratedColumn_1 = require("../../../../../src/decorator/columns/PrimaryGeneratedColumn");
const Column_1 = require("../../../../../src/decorator/columns/Column");
const ImageInfo_1 = require("./ImageInfo");
const OneToMany_1 = require("../../../../../src/decorator/relations/OneToMany");
let Image = class Image {
    constructor() {
        this.informations = [];
    }
};
tslib_1.__decorate([
    (0, PrimaryGeneratedColumn_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Image.prototype, "id", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Image.prototype, "title", void 0);
tslib_1.__decorate([
    (0, OneToMany_1.OneToMany)((type) => ImageInfo_1.ImageInfo, (imageInfo) => imageInfo.image),
    tslib_1.__metadata("design:type", Array)
], Image.prototype, "informations", void 0);
Image = tslib_1.__decorate([
    (0, Entity_1.Entity)()
], Image);
exports.Image = Image;
//# sourceMappingURL=Image.js.map