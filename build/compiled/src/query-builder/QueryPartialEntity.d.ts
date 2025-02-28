import { ObjectLiteral } from "../common/ObjectLiteral";
/**
 * Make all properties in T optional
 */
export declare type QueryPartialEntity<T> = {
    [P in keyof T]?: T[P] | (() => string);
};
/**
 * Make all properties in T optional. Deep version.
 */
export declare type QueryDeepPartialEntity<T> = _QueryDeepPartialEntity<ObjectLiteral extends T ? unknown : T>;
declare type _QueryDeepPartialEntity<T> = {
    [P in keyof T]?: (T[P] extends Array<infer U> ? Array<_QueryDeepPartialEntity<U>> : T[P] extends ReadonlyArray<infer U> ? ReadonlyArray<_QueryDeepPartialEntity<U>> : _QueryDeepPartialEntity<T[P]>) | (() => string);
};
export {};
