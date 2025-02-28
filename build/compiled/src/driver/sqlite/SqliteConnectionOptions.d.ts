import { BaseDataSourceOptions } from "../../data-source/BaseDataSourceOptions";
/**
 * Sqlite-specific connection options.
 */
export interface SqliteConnectionOptions extends BaseDataSourceOptions {
    /**
     * Database type.
     */
    readonly type: "sqlite";
    /**
     * Storage type or path to the storage.
     */
    readonly database: string;
    /**
     * The driver object
     * This defaults to require("sqlite3")
     */
    readonly driver?: any;
    /**
     * Encryption key for for SQLCipher.
     */
    readonly key?: string;
    /**
     * In your SQLite application when you perform parallel writes its common to face SQLITE_BUSY error.
     * This error indicates that SQLite failed to write to the database file since someone else already writes into it.
     * Since SQLite cannot handle parallel saves this error cannot be avoided.
     *
     * To simplify life's of those who have this error this particular option sets a timeout within which ORM will try
     * to perform requested write operation again and again until it receives SQLITE_BUSY error.
     *
     * Enabling WAL can improve your app performance and face less SQLITE_BUSY issues.
     * Time in milliseconds.
     */
    readonly busyErrorRetry?: number;
    /**
     * Enables WAL mode. By default its disabled.
     *
     * @see https://www.sqlite.org/wal.html
     */
    readonly enableWAL?: boolean;
    readonly poolSize?: never;
}
