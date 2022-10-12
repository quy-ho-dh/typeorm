"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chai_1 = require("chai");
const child_process_1 = require("child_process");
const path_1 = require("path");
const rimraf_1 = tslib_1.__importDefault(require("rimraf"));
describe("cli init command", () => {
    const cliPath = `${(0, path_1.dirname)((0, path_1.dirname)((0, path_1.dirname)(__dirname)))}/src/cli.js`;
    const databaseOptions = [
        "mysql",
        "mariadb",
        "postgres",
        "cockroachdb",
        "sqlite",
        "better-sqlite3",
        // "oracle", // as always oracle have issues: dependency installation doesn't work on mac m1 due to missing oracle binaries for m1
        "mssql",
        "mongodb",
    ];
    const testProjectName = Date.now() + "TestProject";
    const builtSrcDirectory = "build/compiled/src";
    before(async () => {
        const chmodPromise = new Promise((resolve) => {
            (0, child_process_1.exec)(`chmod 755 ${cliPath}`, (error, stdout, stderr) => {
                (0, chai_1.expect)(error).to.not.exist;
                (0, chai_1.expect)(stderr).to.be.empty;
                resolve();
            });
        });
        const copyPromise = new Promise((resolve) => {
            (0, child_process_1.exec)(`cp package.json ${builtSrcDirectory}`, (error, stdout, stderr) => {
                (0, chai_1.expect)(error).to.not.exist;
                (0, chai_1.expect)(stderr).to.be.empty;
                resolve();
            });
        });
        await Promise.all([chmodPromise, copyPromise]);
    });
    after((done) => {
        (0, rimraf_1.default)(`./${builtSrcDirectory}/package.json`, (error) => {
            (0, chai_1.expect)(error).to.not.exist;
            done();
        });
    });
    afterEach((done) => {
        (0, rimraf_1.default)(`./${testProjectName}`, (error) => {
            (0, chai_1.expect)(error).to.not.exist;
            done();
        });
    });
    for (const databaseOption of databaseOptions) {
        it(`should work with ${databaseOption} option`, (done) => {
            (0, child_process_1.exec)(`${cliPath} init --name ${testProjectName} --database ${databaseOption}`, (error, stdout, stderr) => {
                (0, chai_1.expect)(error).to.not.exist;
                (0, chai_1.expect)(stderr).to.be.empty;
                done();
            });
        }).timeout(90000);
    }
});
//# sourceMappingURL=issue-8975.js.map