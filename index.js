const inquirer = require("inquirer");
// private to protect mysql password
const connection = require("./private/mysql");
const cTable = require('console.table');

connection.connect(function(err) {
    if (err) throw err;
    
    console.log("Connected to company_DB");
    // getAction()
});

function getAction() {
    inquirer
        .prompt({
            // Get user's action choice
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: []

        })
};