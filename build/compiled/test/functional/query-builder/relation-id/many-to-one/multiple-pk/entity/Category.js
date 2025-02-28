"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Category = void 0;
const tslib_1 = require("tslib");
const Entity_1 = require("../../../../../../../src/decorator/entity/Entity");
const Column_1 = require("../../../../../../../src/decorator/columns/Column");
const PrimaryColumn_1 = require("../../../../../../../src/decorator/columns/PrimaryColumn");
const JoinTable_1 = require("../../../../../../../src/decorator/relations/JoinTable");
const OneToMany_1 = require("../../../../../../../src/decorator/relations/OneToMany");
const ManyToOne_1 = require("../../../../../../../src/decorator/relations/ManyToOne");
const Post_1 = require("./Post");
const Image_1 = require("./Image");
let Category = class Category {
    constructor() {
        this.isRemoved = false;
    }
};
tslib_1.__decorate([
    (0, PrimaryColumn_1.PrimaryColumn)(),
    tslib_1.__metadata("design:type", Number)
], Category.prototype, "id", void 0);
tslib_1.__decorate([
    (0, PrimaryColumn_1.PrimaryColumn)(),
    tslib_1.__metadata("design:type", Number)
], Category.prototype, "code", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Category.prototype, "name", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", Boolean)
], Category.prototype, "isRemoved", void 0);
tslib_1.__decorate([
    (0, OneToMany_1.OneToMany)((type) => Post_1.Post, (post) => post.category),
    tslib_1.__metadata("design:type", Array)
], Category.prototype, "posts", void 0);
tslib_1.__decorate([
    (0, ManyToOne_1.ManyToOne)((type) => Image_1.Image, (image) => image.categories),
    (0, JoinTable_1.JoinTable)(),
    tslib_1.__metadata("design:type", Image_1.Image)
], Category.prototype, "image", void 0);
Category = tslib_1.__decorate([
    (0, Entity_1.Entity)()
], Category);
exports.Category = Category;
//# sourceMappingURL=Category.js.map