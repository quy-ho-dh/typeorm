"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
const tslib_1 = require("tslib");
const index_1 = require("../../../../src/index");
const EventRole_1 = require("./EventRole");
let Event = class Event {
};
tslib_1.__decorate([
    (0, index_1.PrimaryGeneratedColumn)("uuid"),
    tslib_1.__metadata("design:type", String)
], Event.prototype, "id", void 0);
tslib_1.__decorate([
    (0, index_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Event.prototype, "title", void 0);
tslib_1.__decorate([
    (0, index_1.OneToMany)((type) => EventRole_1.EventRole, (role) => role.event, {
        // eager: true,
        // persistence: true,
        cascade: true,
    }),
    tslib_1.__metadata("design:type", Array)
], Event.prototype, "roles", void 0);
Event = tslib_1.__decorate([
    (0, index_1.Entity)()
], Event);
exports.Event = Event;
//# sourceMappingURL=Event.js.map