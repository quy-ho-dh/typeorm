"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const tslib_1 = require("tslib");
const src_1 = require("../../../../src");
const Column_1 = require("../../../../src/decorator/columns/Column");
let Question = class Question {
};
tslib_1.__decorate([
    (0, src_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Question.prototype, "id", void 0);
tslib_1.__decorate([
    (0, Column_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Question.prototype, "name", void 0);
tslib_1.__decorate([
    (0, src_1.ManyToMany)("categories"),
    (0, src_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], Question.prototype, "categories", void 0);
Question = tslib_1.__decorate([
    (0, src_1.Entity)("questions")
], Question);
exports.Question = Question;
//# sourceMappingURL=Question.js.map