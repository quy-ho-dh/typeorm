"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Example = void 0;
const tslib_1 = require("tslib");
const src_1 = require("../../../../../src");
let Example = class Example {
};
tslib_1.__decorate([
    (0, src_1.PrimaryColumn)(),
    tslib_1.__metadata("design:type", String)
], Example.prototype, "id", void 0);
Example = tslib_1.__decorate([
    (0, src_1.Entity)()
], Example);
exports.Example = Example;
//# sourceMappingURL=Example.js.map