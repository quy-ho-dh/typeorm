"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const tslib_1 = require("tslib");
const Column_1 = require("../../../../../../../src/decorator/columns/Column");
const Entity_1 = require("../../../../../../../src/decorator/entity/Entity");
const PrimaryGeneratedColumn_1 = require("../../../../../../../src/decorator/columns/PrimaryGeneratedColumn");
const ManyToOne_1 = require("../../../../../../../src/decorator/relations/ManyToOne");
const JoinColumn_1 = require("../../../../../../../src/decorator/relations/JoinColumn");
const Post_1 = require("./Post");
let User = class User {
};
tslib_1.__decorate([
    (0, PrimaryGeneratedColumn_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], User.prototype, "id", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", String)
], User.prototype, "name", void 0);
tslib_1.__decorate([
    (0, ManyToOne_1.ManyToOne)((type) => Post_1.Post, (post) => post.counters.subcounters.watchedUsers),
    (0, JoinColumn_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], User.prototype, "posts", void 0);
User = tslib_1.__decorate([
    (0, Entity_1.Entity)()
], User);
exports.User = User;
//# sourceMappingURL=User.js.map