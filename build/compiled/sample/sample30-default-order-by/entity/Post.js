"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../src/index");
const ManyToMany_1 = require("../../../src/decorator/relations/ManyToMany");
const Category_1 = require("./Category");
const JoinTable_1 = require("../../../src/decorator/relations/JoinTable");
let Post = class Post {
    constructor(title, text, categories) {
        this.title = title;
        this.text = text;
        this.categories = categories;
    }
};
tslib_1.__decorate([
    (0, index_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Post.prototype, "id", void 0);
tslib_1.__decorate([
    (0, index_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "title", void 0);
tslib_1.__decorate([
    (0, index_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Post.prototype, "text", void 0);
tslib_1.__decorate([
    (0, ManyToMany_1.ManyToMany)((type) => Category_1.Category),
    (0, JoinTable_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], Post.prototype, "categories", void 0);
Post = tslib_1.__decorate([
    (0, index_1.Entity)("sample30_post", {
        orderBy: {
            title: "ASC",
            id: "DESC",
        },
    }),
    tslib_1.__metadata("design:paramtypes", [String, String, Array])
], Post);
exports.Post = Post;
//# sourceMappingURL=Post.js.map