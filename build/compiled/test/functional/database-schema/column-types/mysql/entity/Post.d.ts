/// <reference types="node" />
import { FruitEnum } from "../enum/FruitEnum";
export declare class Post {
    id: number;
    bit: Buffer;
    int: number;
    integer: number;
    tinyint: number;
    smallint: number;
    mediumint: number;
    bigint: string;
    float: number;
    double: number;
    doublePrecision: number;
    real: number;
    dec: string;
    decimal: string;
    numeric: string;
    fixed: string;
    boolean: boolean;
    bool: boolean;
    char: string;
    nChar: string;
    nationalChar: string;
    varchar: string;
    nVarchar: string;
    nationalVarchar: string;
    text: string;
    tinytext: string;
    mediumtext: string;
    longtext: string;
    binary: Buffer;
    varbinary: Buffer;
    blob: Buffer;
    tinyblob: Buffer;
    mediumblob: Buffer;
    longblob: Buffer;
    date: string;
    datetime: Date;
    timestamp: Date;
    time: string;
    year: number;
    geometry: string;
    point: string;
    linestring: string;
    polygon: string;
    multipoint: string;
    multilinestring: string;
    multipolygon: string;
    geometrycollection: string;
    enum: string;
    classEnum1: FruitEnum;
    json: Object;
    simpleArray: string[];
    simpleJson: {
        param: string;
    };
    simpleEnum: string;
    simpleClassEnum1: FruitEnum;
}
