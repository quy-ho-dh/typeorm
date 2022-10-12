import { TestFunction } from "mocha";
declare type XFailFunction = {
    it: TestFunction;
    unless: (condition: boolean | (() => boolean)) => {
        it: TestFunction;
    };
};
declare const xfail: XFailFunction;
export { xfail };
