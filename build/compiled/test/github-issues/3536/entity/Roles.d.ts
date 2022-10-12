export declare enum AccountPermission {
    Thing1 = 1,
    Thing2 = 4,
    Thing3 = 3,
    Thing4 = 2
}
export declare class Roles {
    id: string;
    accountPermission: AccountPermission[];
}
