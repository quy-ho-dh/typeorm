"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoftDeleteQueryBuilder = void 0;
const QueryBuilder_1 = require("./QueryBuilder");
const UpdateResult_1 = require("./result/UpdateResult");
const ReturningStatementNotSupportedError_1 = require("../error/ReturningStatementNotSupportedError");
const ReturningResultsEntityUpdator_1 = require("./ReturningResultsEntityUpdator");
const LimitOnUpdateNotSupportedError_1 = require("../error/LimitOnUpdateNotSupportedError");
const MissingDeleteDateColumnError_1 = require("../error/MissingDeleteDateColumnError");
const UpdateValuesMissingError_1 = require("../error/UpdateValuesMissingError");
const error_1 = require("../error");
const DriverUtils_1 = require("../driver/DriverUtils");
const InstanceChecker_1 = require("../util/InstanceChecker");
/**
 * Allows to build complex sql queries in a fashion way and execute those queries.
 */
class SoftDeleteQueryBuilder extends QueryBuilder_1.QueryBuilder {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(connectionOrQueryBuilder, queryRunner) {
        super(connectionOrQueryBuilder, queryRunner);
        this["@instanceof"] = Symbol.for("SoftDeleteQueryBuilder");
        this.expressionMap.aliasNamePrefixingEnabled = false;
    }
    // -------------------------------------------------------------------------
    // Public Implemented Methods
    // -------------------------------------------------------------------------
    /**
     * Gets generated SQL query without parameters being replaced.
     */
    getQuery() {
        let sql = this.createUpdateExpression();
        sql += this.createCteExpression();
        sql += this.createOrderByExpression();
        sql += this.createLimitExpression();
        return sql.trim();
    }
    /**
     * Executes sql generated by query builder and returns raw database results.
     */
    async execute() {
        const queryRunner = this.obtainQueryRunner();
        let transactionStartedByUs = false;
        try {
            // start transaction if it was enabled
            if (this.expressionMap.useTransaction === true &&
                queryRunner.isTransactionActive === false) {
                await queryRunner.startTransaction();
                transactionStartedByUs = true;
            }
            // call before soft remove and recover methods in listeners and subscribers
            if (this.expressionMap.callListeners === true &&
                this.expressionMap.mainAlias.hasMetadata) {
                if (this.expressionMap.queryType === "soft-delete")
                    await queryRunner.broadcaster.broadcast("BeforeSoftRemove", this.expressionMap.mainAlias.metadata);
                else if (this.expressionMap.queryType === "restore")
                    await queryRunner.broadcaster.broadcast("BeforeRecover", this.expressionMap.mainAlias.metadata);
            }
            // if update entity mode is enabled we may need extra columns for the returning statement
            const returningResultsEntityUpdator = new ReturningResultsEntityUpdator_1.ReturningResultsEntityUpdator(queryRunner, this.expressionMap);
            if (this.expressionMap.updateEntity === true &&
                this.expressionMap.mainAlias.hasMetadata &&
                this.expressionMap.whereEntities.length > 0) {
                this.expressionMap.extraReturningColumns =
                    returningResultsEntityUpdator.getSoftDeletionReturningColumns();
            }
            // execute update query
            const [sql, parameters] = this.getQueryAndParameters();
            const queryResult = await queryRunner.query(sql, parameters, true);
            const updateResult = UpdateResult_1.UpdateResult.from(queryResult);
            // if we are updating entities and entity updation is enabled we must update some of entity columns (like version, update date, etc.)
            if (this.expressionMap.updateEntity === true &&
                this.expressionMap.mainAlias.hasMetadata &&
                this.expressionMap.whereEntities.length > 0) {
                await returningResultsEntityUpdator.update(updateResult, this.expressionMap.whereEntities);
            }
            // call after soft remove and recover methods in listeners and subscribers
            if (this.expressionMap.callListeners === true &&
                this.expressionMap.mainAlias.hasMetadata) {
                if (this.expressionMap.queryType === "soft-delete")
                    await queryRunner.broadcaster.broadcast("AfterSoftRemove", this.expressionMap.mainAlias.metadata);
                else if (this.expressionMap.queryType === "restore")
                    await queryRunner.broadcaster.broadcast("AfterRecover", this.expressionMap.mainAlias.metadata);
            }
            // close transaction if we started it
            if (transactionStartedByUs)
                await queryRunner.commitTransaction();
            return updateResult;
        }
        catch (error) {
            // rollback transaction if we started it
            if (transactionStartedByUs) {
                try {
                    await queryRunner.rollbackTransaction();
                }
                catch (rollbackError) { }
            }
            throw error;
        }
        finally {
            if (queryRunner !== this.queryRunner) {
                // means we created our own query runner
                await queryRunner.release();
            }
        }
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Specifies FROM which entity's table select/update/delete/soft-delete will be executed.
     * Also sets a main string alias of the selection data.
     */
    from(entityTarget, aliasName) {
        entityTarget = InstanceChecker_1.InstanceChecker.isEntitySchema(entityTarget)
            ? entityTarget.options.name
            : entityTarget;
        const mainAlias = this.createFromAlias(entityTarget, aliasName);
        this.expressionMap.setMainAlias(mainAlias);
        return this;
    }
    /**
     * Sets WHERE condition in the query builder.
     * If you had previously WHERE expression defined,
     * calling this function will override previously set WHERE conditions.
     * Additionally you can add parameters used in where expression.
     */
    where(where, parameters) {
        this.expressionMap.wheres = []; // don't move this block below since computeWhereParameter can add where expressions
        const condition = this.getWhereCondition(where);
        if (condition)
            this.expressionMap.wheres = [
                { type: "simple", condition: condition },
            ];
        if (parameters)
            this.setParameters(parameters);
        return this;
    }
    /**
     * Adds new AND WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    andWhere(where, parameters) {
        this.expressionMap.wheres.push({
            type: "and",
            condition: this.getWhereCondition(where),
        });
        if (parameters)
            this.setParameters(parameters);
        return this;
    }
    /**
     * Adds new OR WHERE condition in the query builder.
     * Additionally you can add parameters used in where expression.
     */
    orWhere(where, parameters) {
        this.expressionMap.wheres.push({
            type: "or",
            condition: this.getWhereCondition(where),
        });
        if (parameters)
            this.setParameters(parameters);
        return this;
    }
    /**
     * Adds new AND WHERE with conditions for the given ids.
     */
    whereInIds(ids) {
        return this.where(this.getWhereInIdsCondition(ids));
    }
    /**
     * Adds new AND WHERE with conditions for the given ids.
     */
    andWhereInIds(ids) {
        return this.andWhere(this.getWhereInIdsCondition(ids));
    }
    /**
     * Adds new OR WHERE with conditions for the given ids.
     */
    orWhereInIds(ids) {
        return this.orWhere(this.getWhereInIdsCondition(ids));
    }
    /**
     * Optional returning/output clause.
     */
    output(output) {
        return this.returning(output);
    }
    /**
     * Optional returning/output clause.
     */
    returning(returning) {
        // not all databases support returning/output cause
        if (!this.connection.driver.isReturningSqlSupported("update")) {
            throw new ReturningStatementNotSupportedError_1.ReturningStatementNotSupportedError();
        }
        this.expressionMap.returning = returning;
        return this;
    }
    /**
     * Sets ORDER BY condition in the query builder.
     * If you had previously ORDER BY expression defined,
     * calling this function will override previously set ORDER BY conditions.
     */
    orderBy(sort, order = "ASC", nulls) {
        if (sort) {
            if (typeof sort === "object") {
                this.expressionMap.orderBys = sort;
            }
            else {
                if (nulls) {
                    this.expressionMap.orderBys = {
                        [sort]: { order, nulls },
                    };
                }
                else {
                    this.expressionMap.orderBys = { [sort]: order };
                }
            }
        }
        else {
            this.expressionMap.orderBys = {};
        }
        return this;
    }
    /**
     * Adds ORDER BY condition in the query builder.
     */
    addOrderBy(sort, order = "ASC", nulls) {
        if (nulls) {
            this.expressionMap.orderBys[sort] = { order, nulls };
        }
        else {
            this.expressionMap.orderBys[sort] = order;
        }
        return this;
    }
    /**
     * Sets LIMIT - maximum number of rows to be selected.
     */
    limit(limit) {
        this.expressionMap.limit = limit;
        return this;
    }
    /**
     * Indicates if entity must be updated after update operation.
     * This may produce extra query or use RETURNING / OUTPUT statement (depend on database).
     * Enabled by default.
     */
    whereEntity(entity) {
        if (!this.expressionMap.mainAlias.hasMetadata)
            throw new error_1.TypeORMError(`.whereEntity method can only be used on queries which update real entity table.`);
        this.expressionMap.wheres = [];
        const entities = Array.isArray(entity) ? entity : [entity];
        entities.forEach((entity) => {
            const entityIdMap = this.expressionMap.mainAlias.metadata.getEntityIdMap(entity);
            if (!entityIdMap)
                throw new error_1.TypeORMError(`Provided entity does not have ids set, cannot perform operation.`);
            this.orWhereInIds(entityIdMap);
        });
        this.expressionMap.whereEntities = entities;
        return this;
    }
    /**
     * Indicates if entity must be updated after update operation.
     * This may produce extra query or use RETURNING / OUTPUT statement (depend on database).
     * Enabled by default.
     */
    updateEntity(enabled) {
        this.expressionMap.updateEntity = enabled;
        return this;
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates UPDATE express used to perform insert query.
     */
    createUpdateExpression() {
        const metadata = this.expressionMap.mainAlias.hasMetadata
            ? this.expressionMap.mainAlias.metadata
            : undefined;
        if (!metadata)
            throw new error_1.TypeORMError(`Cannot get entity metadata for the given alias "${this.expressionMap.mainAlias}"`);
        if (!metadata.deleteDateColumn) {
            throw new MissingDeleteDateColumnError_1.MissingDeleteDateColumnError(metadata);
        }
        // prepare columns and values to be updated
        const updateColumnAndValues = [];
        switch (this.expressionMap.queryType) {
            case "soft-delete":
                updateColumnAndValues.push(this.escape(metadata.deleteDateColumn.databaseName) +
                    " = CURRENT_TIMESTAMP");
                break;
            case "restore":
                updateColumnAndValues.push(this.escape(metadata.deleteDateColumn.databaseName) +
                    " = NULL");
                break;
            default:
                throw new error_1.TypeORMError(`The queryType must be "soft-delete" or "restore"`);
        }
        if (metadata.versionColumn)
            updateColumnAndValues.push(this.escape(metadata.versionColumn.databaseName) +
                " = " +
                this.escape(metadata.versionColumn.databaseName) +
                " + 1");
        if (metadata.updateDateColumn)
            updateColumnAndValues.push(this.escape(metadata.updateDateColumn.databaseName) +
                " = CURRENT_TIMESTAMP"); // todo: fix issue with CURRENT_TIMESTAMP(6) being used, can "DEFAULT" be used?!
        if (updateColumnAndValues.length <= 0) {
            throw new UpdateValuesMissingError_1.UpdateValuesMissingError();
        }
        // get a table name and all column database names
        const whereExpression = this.createWhereExpression();
        const returningExpression = this.createReturningExpression("update");
        if (returningExpression === "") {
            return `UPDATE ${this.getTableName(this.getMainTableName())} SET ${updateColumnAndValues.join(", ")}${whereExpression}`; // todo: how do we replace aliases in where to nothing?
        }
        if (this.connection.driver.options.type === "mssql") {
            return `UPDATE ${this.getTableName(this.getMainTableName())} SET ${updateColumnAndValues.join(", ")} OUTPUT ${returningExpression}${whereExpression}`;
        }
        return `UPDATE ${this.getTableName(this.getMainTableName())} SET ${updateColumnAndValues.join(", ")}${whereExpression} RETURNING ${returningExpression}`;
    }
    /**
     * Creates "ORDER BY" part of SQL query.
     */
    createOrderByExpression() {
        const orderBys = this.expressionMap.orderBys;
        if (Object.keys(orderBys).length > 0)
            return (" ORDER BY " +
                Object.keys(orderBys)
                    .map((columnName) => {
                    if (typeof orderBys[columnName] === "string") {
                        return (this.replacePropertyNames(columnName) +
                            " " +
                            orderBys[columnName]);
                    }
                    else {
                        return (this.replacePropertyNames(columnName) +
                            " " +
                            orderBys[columnName].order +
                            " " +
                            orderBys[columnName].nulls);
                    }
                })
                    .join(", "));
        return "";
    }
    /**
     * Creates "LIMIT" parts of SQL query.
     */
    createLimitExpression() {
        let limit = this.expressionMap.limit;
        if (limit) {
            if (DriverUtils_1.DriverUtils.isMySQLFamily(this.connection.driver)) {
                return " LIMIT " + limit;
            }
            else {
                throw new LimitOnUpdateNotSupportedError_1.LimitOnUpdateNotSupportedError();
            }
        }
        return "";
    }
}
exports.SoftDeleteQueryBuilder = SoftDeleteQueryBuilder;
//# sourceMappingURL=SoftDeleteQueryBuilder.js.map