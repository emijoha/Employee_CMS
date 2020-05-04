// ----------------------------------------------------------------------------------------------------------------
// REQUIRE NEEDED PACKAGES/MODULES
// ----------------------------------------------------------------------------------------------------------------

const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

// private password
const password = require("./private/mysqlPassword");

// database query types
const query = require("./lib/query");

// ----------------------------------------------------------------------------------------------------------------
// CONNECT TO DATABASE and START CLI APP
// ----------------------------------------------------------------------------------------------------------------

const connection = mysql.createConnection({
    host: "localhost",
    port:3306,
    user: "root",
    password: password,
    database: "company_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    
    console.log("Connected to Company_DB\n");
    startAction("Welcome! What would you like to do?");
});

// ----------------------------------------------------------------------------------------------------------------
// GENERAL ACTION FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------

// Function to initiate CLI app, runs once connection to database is successful
function startAction(msgString) {
    inquirer
        .prompt({
            // Get user's action choice by category or exit
            name: "startAction",
            type: "list",
            message: msgString,
            choices: ["Manage 'Employees'", "Manage 'Roles'", "Manage 'Departments'", "Exit"]
        }).then(function(answer) {
            switch (answer.startAction) {
            case "Manage 'Employees'":
                employeeAction("What would you like to do with 'Employees'?");
                break;

            case "Manage 'Roles'":
                roleAction("What would you like to do with 'Roles'?");
                break;

            case "Manage 'Departments'":
                departmentAction("What would you like to do with 'Departments'?");
                break;

            case "Exit":
                console.log("\nGoodbye!")
                connection.end();
                break;
            }
        });
};

// Function to get user's action for employee data
function employeeAction(msgString) {
    inquirer
        .prompt({
            name: "employeeAction",
            type: "list",
            message: msgString,
            choices: ["View All Employees", "Add Employee", "Update Employee Role", "Exit 'Employees'"]
        }).then(function(answer) {
            switch (answer.employeeAction) {
                case "View All Employees":
                    viewEmployees();
                    console.log("\nAll Employees\n");
                    break;
    
                case "Add Employee":
                    // addEmployee();
                    console.log("Employee Added");
                    break;
    
                case "Update Employee Role":
                    // updateEmpRole();
                    console.log("Employee role updated");
                    break;
    
                case "Exit 'Employees'":
                    startAction("What would you like to do now?");
                    break;
                }
        });
};

// Function to get user's action for role data
function roleAction(msgString) {
    inquirer
        .prompt({
            name: "roleAction",
            type: "list",
            message: msgString,
            choices: ["View All Roles", "Add Role", "Exit 'Roles'"]
        }).then(function(answer) {
            switch (answer.roleAction) {
                case "View All Roles":
                    // viewRoles();
                    console.log("'View All Roles' selected");
                    break;
    
                case "Add Role":
                    // addRole();
                    console.log("Role added");
                    break;
    
                case "Exit 'Roles'":
                    startAction("What would you like to do now?");
                    break;
                }
        });
}

// Function to get user's action for department data
function departmentAction(msgString) {
    inquirer
        .prompt({
            name: "departmentAction",
            type: "list",
            message: msgString,
            choices: ["View All Departments", "Add Department", "Exit 'Departments'"]
        }).then(function(answer) {
            switch (answer.departmentAction) {
                case "View All Departments":
                    // viewDepartments();
                    console.log("'View All Departments' selected");
                    break;
    
                case "Add Department":
                    // addDepartment();
                    console.log("Department added")
                    break;
    
                case "Exit 'Departments'":
                    startAction("What would you like to do now?");
                    break;
                }
        });
};

// ----------------------------------------------------------------------------------------------------------------
// EMPLOYEE QUERY FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------

// viewEmployees();
function viewEmployees() {
    connection.query(query.allEmp, function(err, res) {
        console.table(res);
        employeeAction("What else would you like to do with 'Employees'?");
    });
};

// addEmployee();

// updateEmpRole();

// ----------------------------------------------------------------------------------------------------------------
// ROLE QUERY FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------

// viewRoles()

// addRole();

// ----------------------------------------------------------------------------------------------------------------
// DEPARTMENT QUERY FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------

// viewDepartments();

// addDepartment();
