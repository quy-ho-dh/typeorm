"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const tslib_1 = require("tslib");
const PrimaryGeneratedColumn_1 = require("../../../../../src/decorator/columns/PrimaryGeneratedColumn");
const Entity_1 = require("../../../../../src/decorator/entity/Entity");
const Column_1 = require("../../../../../src/decorator/columns/Column");
const Index_1 = require("../../../../../src/decorator/Index");
let Post = class Post {
};
tslib_1.__decorate([
    (0, PrimaryGeneratedColumn_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Post.prototype, "id", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("geometry", {
        nullable: true,
    }),
    (0, Index_1.Index)({
        spatial: true,
    }),
    tslib_1.__metadata("design:type", Object)
], Post.prototype, "geom", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("geometry", {
        nullable: true,
        spatialFeatureType: "Point",
    }),
    tslib_1.__metadata("design:type", Object)
], Post.prototype, "pointWithoutSRID", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("geometry", {
        nullable: true,
        spatialFeatureType: "Point",
        srid: 4326,
    }),
    tslib_1.__metadata("design:type", Object)
], Post.prototype, "point", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)("geography", {
        nullable: true,
    }),
    tslib_1.__metadata("design:type", Object)
], Post.prototype, "geog", void 0);
Post = tslib_1.__decorate([
    (0, Entity_1.Entity)()
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map