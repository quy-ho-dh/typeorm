import { BaseEntity } from "../../../../src";
export declare enum OrderStatus {
    placed = "placed",
    paid = "paid",
    confirmed = "confirmed",
    shipped = "shipped",
    completed = "completed",
    cancelled = "cancelled"
}
export declare class Order extends BaseEntity {
    id: string;
    status: OrderStatus;
}
