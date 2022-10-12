/// <reference types="node" />
export declare class Post {
    id: number;
    name: string;
    integer: number;
    int4: number;
    int: number;
    smallint: number;
    int2: number;
    bigint: string;
    int8: string;
    numeric: string;
    decimal: string;
    doublePrecision: number;
    float8: number;
    real: number;
    float4: number;
    money: string;
    char: string;
    character: string;
    varchar: string;
    characterVarying: string;
    text: string;
    citext: string;
    hstore: string;
    bytea: Buffer;
    date: string;
    interval: any;
    time: string;
    timeWithTimeZone: string;
    timetz: string;
    timestamp: Date;
    timestampWithTimeZone: Date;
    timestamptz: Date;
    boolean: boolean;
    bool: boolean;
    enum: string;
    point: string | Object;
    line: string;
    lseg: string | string[];
    box: string | Object;
    path: string;
    polygon: string;
    circle: string | Object;
    cidr: string;
    inet: string;
    macaddr: string;
    bit: string;
    varbit: string;
    bitVarying: string;
    uuid: string;
    xml: string;
    json: Object;
    jsonb: Object;
    int4range: string;
    int8range: string;
    numrange: string;
    tsrange: string;
    tstzrange: string;
    daterange: string;
    array: number[];
    simpleArray: string[];
    simpleJson: {
        param: string;
    };
    simpleEnum: string;
}
