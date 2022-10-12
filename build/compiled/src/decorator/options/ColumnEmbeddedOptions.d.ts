/**
 * Column options specific to embedded column.
 */
export interface ColumnEmbeddedOptions {
    /**
     * Embedded column prefix.
     * If set to empty string or false, then prefix is not set at all.
     */
    prefix?: string | boolean;
    /**
     * Indicates if this embedded is in array mode.
     *
     * This option works only in mongodb.
     */
    array?: boolean;
}
