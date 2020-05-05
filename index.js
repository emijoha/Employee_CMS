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
                    break;
    
                case "Add Employee":
                    addEmployee();
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
                    viewRoles();
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
                    viewDepartments();
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
    connection.query(query.allEmployees, function(err, res) {
        console.table("\nAll Employees", res);
        employeeAction("What else would you like to do with 'Employees'?");
    });
};

// addEmployee(); 
// TO DO: Simplify this code!!!!!
function addEmployee() {

    // Query for all roles
    connection.query(query.roles, function(err, res1) {

        // make an array containing role objects with id and title
        let rolesArr = res1.map(obj => obj.title);

        // Query for all employees as managers
        connection.query(query.managers, function(err, res2) {

            // make an array containing manager objects with employee id and first and last names
            let managersArr = res2.map(obj => obj.manager);

            // Now we run inquirer, using the above arrays to plug in as answer list choices in the prompts below
            inquirer
                .prompt([
                    {
                        name: "firstName",
                        type: "input",
                        message: "What is the employee's FIRST NAME?"
                    }, {
                        name: "lastName",
                        type: "input",
                        message: "What is the employee's LAST NAME?"
                    }, {
                        name: "role",
                        type: "list",
                        message: "What is the employee's ROLE?",
                        choices: rolesArr
                    }, {
                        name: "confirmManager",
                        type: "confirm",
                        message: "Would you like assign a MANAGER for this employee?"
                    }, {
                        name: "manager",
                        type: "list",
                        message: "Who would you like to assign as their MANAGER?",
                        choices: managersArr,
                        // Only if manager is confirmed TRUE does this question get asked
                        when: answers => answers.confirmManager === true
                    }
                ]).then(function(answers) {

                    // Assign answers' inputs to variables
                    let firstName = answers.firstName;
                    let lastName = answers.lastName;
                    // Go through query response '1' (res1) again to find the object where the role title is equal to the role answer choice
                    let role = res1.find(obj => obj.title === answers.role);
                    let manager;
                        // Set the manager variable equal to NULL -or- equal to id of selected manager
                        if (answers.confirmManager === false) {
                            manager = null;
                        } else {
                            // go through query response '2' (res2) again to find the object where manager name is equal to manager answer choice 
                            let managerID = res2.find(obj => obj.manager === answers.manager);
                            // Assign 'id' value of that object to 'manager' variable
                            manager = managerID.id;
                        };

                    // Last query, to INSERT new employee values into employees data table
                    // 'id' value of 'role' object variable is specified when passed into query method 'addEmployee()'
                    connection.query(query.addEmployee(firstName, lastName, role.id, manager), function(err, res3) {
                        console.log(`\n${firstName} ${lastName} was added to 'Employees'!`);
                        // Render updated employees table, and restart 'Employees' action prompts
                        viewEmployees();
                    });
                });
        });
    });
};

// updateEmpRole();

// ----------------------------------------------------------------------------------------------------------------
// ROLE QUERY FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------

// viewRoles()
function viewRoles() {
    connection.query(query.allRoles, function(err, res) {
        console.table("\nAll Roles", res);
        roleAction("What else would you like to do with 'Roles'?");
    });
};

// addRole();

// ----------------------------------------------------------------------------------------------------------------
// DEPARTMENT QUERY FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------

// viewDepartments();
function viewDepartments() {
    connection.query(query.allDepartments, function(err, res) {
        console.table("\nAll Departments", res);
        departmentAction("What else would you like to do with 'Departments'?");
    });
};

// addDepartment();
