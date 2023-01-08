const permissions = require("../backend/default_permissions");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
module.exports = async function(client) {
    // Main Table Check
    let mySQLTables = await fs.readFileSync(path.join(__dirname, "../", "../", "../", "installme.sql"), "utf-8");
    mySQLTables = mySQLTables.replace("CREATE DATABASE modmail;", "").replace("USE modmail;", "");
    let array = mySQLTables.split("CREATE TABLE");
    for (let table of array) {
        if (table.split("(")[0] == "" || table.includes("ALTER TABLE")) continue;
        client.db.query(`SELECT * FROM ${table.split("(")[0]};`, function(err, found) {
            if (err?.code == "ER_NO_SUCH_TABLE") {
                client.db.query(`CREATE TABLE${table}`, function(_,_) {});
                client.logger(`The MySQL table '${table.split("(")[0].replace(" ", "")}' was missing, it has been created.`, "UPDATE");
            } else {
                for (let column of table.split("\n")) {
                    if (column.includes("(") || !column.includes(",")) continue;
                    column = column.replace(",", "").split(" ").filter(string => string !== "");
                    client.db.query(`SELECT DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '${table.split("(")[0].replace(" ", "")}' AND COLUMN_NAME = '${column[0]}';`, function(err, data) {
                        if (!data?.length) {
                            client.db.query(`ALTER TABLE ${table.split("(")[0].replace(" ", "")} ADD COLUMN ${column.join(" ")}`, function(_,_) {});
                            client.logger(`The MySQL column '${table.split("(")[0].replace(" ", "")}.${column[0]}' was missing, it has been created.`, "UPDATE");
                        } else if (data[0].DATA_TYPE !== column[1].toLowerCase()) {
                            client.db.query(`ALTER TABLE ${table.split("(")[0].replace(" ", "")} MODIFY ${column.join(" ")};`, function(_,_) {});
                        };
                    });
                };
            };
        });
    };
};