"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Photo = void 0;
const tslib_1 = require("tslib");
const src_1 = require("../../../../src");
const User_1 = require("./User");
let Photo = class Photo {
};
tslib_1.__decorate([
    (0, src_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Photo.prototype, "id", void 0);
tslib_1.__decorate([
    (0, src_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Photo.prototype, "description", void 0);
tslib_1.__decorate([
    (0, src_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Photo.prototype, "uri", void 0);
tslib_1.__decorate([
    (0, src_1.Column)(),
    tslib_1.__metadata("design:type", Number)
], Photo.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, src_1.ManyToOne)((type) => User_1.User, (user) => user.photos),
    tslib_1.__metadata("design:type", User_1.User)
], Photo.prototype, "user", void 0);
Photo = tslib_1.__decorate([
    (0, src_1.Entity)()
], Photo);
exports.Photo = Photo;
//# sourceMappingURL=Photo.js.map