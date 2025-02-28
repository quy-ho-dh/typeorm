"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const tslib_1 = require("tslib");
const src_1 = require("../../../../src");
const SessionSettings_1 = require("./SessionSettings");
let Session = class Session {
};
tslib_1.__decorate([
    (0, src_1.PrimaryGeneratedColumn)(),
    tslib_1.__metadata("design:type", Number)
], Session.prototype, "id", void 0);
tslib_1.__decorate([
    (0, src_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Session.prototype, "title", void 0);
tslib_1.__decorate([
    (0, src_1.Column)({
        nullable: true,
    }),
    tslib_1.__metadata("design:type", String)
], Session.prototype, "description", void 0);
tslib_1.__decorate([
    (0, src_1.OneToOne)((type) => SessionSettings_1.SessionSettings, (sessionSettings) => sessionSettings.session),
    tslib_1.__metadata("design:type", SessionSettings_1.SessionSettings)
], Session.prototype, "settings", void 0);
Session = tslib_1.__decorate([
    (0, src_1.Entity)({
        name: "Sessions",
    })
], Session);
exports.Session = Session;
//# sourceMappingURL=Session.js.map