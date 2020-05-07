// ----------------------------------------------------------------------------------------------------------------
// REQUIRE NEEDED PACKAGES/MODULES
// ----------------------------------------------------------------------------------------------------------------

const inquirer = require("inquirer");
const mysql = require("mysql");
const { printTable } = require('console-table-printer');


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
        .prompt(
            {
                // Get user's action choice by category or exit
                name: "startAction",
                type: "list",
                message: msgString,
                choices: ["Manage 'Employees'", "Manage 'Roles'", "Manage 'Departments'", "Exit"]
            }
        ).then(function(answer) {

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
        .prompt(
            {
                name: "employeeAction",
                type: "list",
                message: msgString,
                choices: ["View All Employees", "Add Employee", "Update Employee", "Exit 'Employees'"]
            }
        ).then(function(answer1) {

            switch (answer1.employeeAction) {
            case "View All Employees":
                viewEmployees();
                break;

            case "Add Employee":
                addEmployee();
                break;

            case "Update Employee":

                inquirer    
                    .prompt(
                        {
                            name: "updateAction",
                            type: "list",
                            message: "Which UPDATE action would you like to perform?",
                            choices: ["Update Employee's Role", "Update Employee's Manager"]
                        }
                    ).then(function(answer2) {

                        switch (answer2.updateAction) {
                        case "Update Employee's Role":
                            updateEmpRole();
                            break;
                            
                        case "Update Employee's Manager":
                            updateEmpManager();
                            break;
                        }

                    });
                
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
        .prompt(
            {
                name: "roleAction",
                type: "list",
                message: msgString,
                choices: ["View All Roles", "Add Role", "Exit 'Roles'"]
            }
        ).then(function(answer) {

            switch (answer.roleAction) {
            case "View All Roles":
                viewRoles();
                break;

            case "Add Role":
                addRole();
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
        .prompt(
            {
                name: "departmentAction",
                type: "list",
                message: msgString,
                choices: ["View All Departments", "Add Department", "Exit 'Departments'"]
            }
        ).then(function(answer) {

            switch (answer.departmentAction) {
            case "View All Departments":
                viewDepartments();
                break;

            case "Add Department":
                addDepartment();
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

// Logs all employee data in table format in the console
function viewEmployees() {

    connection.query(query.allEmployees, function(err, res) {

        console.log("\n All Employees:");
        printTable(res);
        console.log("\n");
        employeeAction("What else would you like to do with 'Employees'?");

    });
};

// Prompts user for inputs to pass into an INSERT query for 'employees' table
function addEmployee() {

    // Query for all roles
    connection.query(query.roles, function(err, res1) {

        // make an array containing role objects with only role title
        let rolesArr = res1.map(obj => obj.title);

        // Query for all employees
        connection.query(query.employees, function(err, res2) {

            // make a managers array containing employee objects with only employee first and last names
            let managersArr = res2.map(obj => obj.employee);

            // Now we run inquirer, using the above arrays to plug in as answer list choices in the prompts below
            inquirer
                .prompt([
                    {
                        name: "firstName",
                        type: "input",
                        message: "What is the employee's FIRST NAME?"
                    }, 
                    {
                        name: "lastName",
                        type: "input",
                        message: "What is the employee's LAST NAME?"
                    }, 
                    {
                        name: "role",
                        type: "list",
                        message: "What is the employee's ROLE?",
                        choices: rolesArr
                    }, 
                    {
                        name: "confirmManager",
                        type: "confirm",
                        message: "Would you like assign a manager for this employee?"
                    }, 
                    {
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
                    let selectedRole = res1.find(obj => obj.title === answers.role);
                    let roleID = selectedRole.id;

                    let managerID;
                    // Set the manager variable equal to NULL -or- equal to id of selected manager
                    if (answers.confirmManager === false) {
                        managerID = null;
                    } else {
                        // go through query response '2' (res2) again to find the object where employee name is equal to manager answer choice 
                        let selectedManager = res2.find(obj => obj.employee === answers.manager);
                        // Assign 'id' value of that object to 'manager' variable
                        managerID = selectedManager.id;
                    };

                    // Query to INSERT new employee values into employees data table
                    connection.query(query.addEmployee(firstName, lastName, roleID, managerID), function(err, res3) {

                        console.log(`\n${firstName} ${lastName} was added to 'Employees'!`);
                        // Render updated employees table, and restart 'Employees' action prompts
                        viewEmployees();

                    });
                });
        });
    });
};

// Prompts user for inputs to pass into an UPDATE query for a specific 'role_id' column in 'employees' table
function updateEmpRole() {

    // Query for all employees
    connection.query(query.employees, function(err, res1) {

        // make an array containing employee objects with only employee names
        let employeesArr = res1.map(obj => obj.employee);

        // Query for all roles
        connection.query(query.roles, function(err, res2) {

            // make a roles array containing role objects with only role titles
            let rolesArr = res2.map(obj => obj.title);

            // Now we run inquirer, using the above arrays to plug in as answer list choices in the prompts below
            inquirer
                .prompt([
                    {
                        name: "employee",
                        type: "list",
                        message: "Which EMPLOYEE'S role would you like to update?",
                        choices: employeesArr
                    }, 
                    {
                        name: "newRole",
                        type: "list",
                        message: "Which ROLE would you like to assign to this employee?",
                        choices: rolesArr
                    }
                ]).then(function(answers) {

                    // Go through query response '1' (res1) again to find the object where the employee is equal to the employee answer choice
                    let selectedEmp = res1.find(obj => obj.employee === answers.employee);
                    let empID = selectedEmp.id;

                    // Go through query response '2' (res2) again to find the object where the role title is equal to the role answer choice
                    let selectedRole = res2.find(obj => obj.title === answers.newRole);
                    let roleID = selectedRole.id;

                    // Query to UPDATE selected employee's role in employees data table
                    connection.query(query.updateEmpRole(roleID, empID), function(err, res3) {

                        console.log(`\n${answers.employee}'s role was changed to '${answers.newRole}'!`);
                        // Render updated employees table, and restart 'Employees' action prompts
                        viewEmployees();

                    });
                });
        });
    });
};

// Prompts user for inputs to pass into an UPDATE query for a specific 'manager_id' column in 'employees' table
function updateEmpManager() {

    // Query for all employees
    connection.query(query.employees, function(err, res1) {

        // make an array containing employee objects with only employee names
        let employeesArr = res1.map(obj => obj.employee);

        // Now we run inquirer, using the above array to plug in answer list choices
        inquirer
            .prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "For which EMPLOYEE would you like to update manager data?",
                    choices: employeesArr
                },
                {
                    name: "managerAction",
                    type: "list",
                    message: "What manager update would you like to do?",
                    choices: ["Change Manager", "Remove Manager"]
                }
            ]).then(function(answer1) {

                // Go through query response '1' (res1) again to find...
                // ...object where the employee is equal to the employee answer choice
                let selectedEmp = res1.find(obj => obj.employee === answer1.employee);
                let empID = selectedEmp.id

                // Go through query response '1' (res1) again to filter and map...
                // ... a managers array containing all employees names EXCEPT the selected employee
                let managersArr = res1.filter(obj => obj.employee !== answer1.employee).map(obj => obj.employee);

                if (answer1.managerAction === "Change Manager") {

                    inquirer
                    .prompt(
                        {
                            name: "newManager",
                            type: "list",
                            message: "Which MANAGER would you like to assign to this employee?",
                            choices: managersArr
                        }
                    ).then(function(answer2) {
                        
                        // Go through query response '1' (res1) again to find...
                        // ...object where the manager employee name is equal to the manager answer choice
                        let selectedManager = res1.find(obj => obj.employee === answer2.newManager);
                        let managerID = selectedManager.id;

                        // Query to UPDATE selected employee's manager in employees data table
                        connection.query(query.updateEmpManager(managerID, empID), function(err, res2) {

                            console.log(`\n${answer1.employee}'s manager was changed to '${answer2.newManager}'!`);
                            // Render updated employees table, and restart 'Employees' action prompts
                            viewEmployees();

                        })

                    });

                } else if (answer1.managerAction === "Remove Manager") {

                    let managerID = null;

                    // Query to UPDATE selected employee's manager in employees data table
                    connection.query(query.updateEmpManager(managerID, empID), function(err, res2) {

                        console.log(`\n${answer1.employee}'s manager was removed!`);
                        // Render updated employees table, and restart 'Employees' action prompts
                        viewEmployees();

                    })

                };
            });
    });
};

// ----------------------------------------------------------------------------------------------------------------
// ROLE QUERY FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------

// Logs all role data in table format in the console
function viewRoles() {

    connection.query(query.allRoles, function(err, res) {

        console.log("\n All Roles:");
        printTable(res);
        console.log("\n");
        roleAction("What else would you like to do with 'Roles'?");

    });
};

// Prompts user for inputs to pass into an INSERT query for 'roles' table
function addRole() {

    // Query for all departments
    connection.query(query.departments, function(err, res1) {

        // make an array containing department objects with only department name
        let deptArr = res1.map(obj => obj.name);

        // Now we run inquirer, using the above array to plug in as answer list choices
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the TITLE of this new role?"
                }, 
                {
                    name: "salary",
                    type: "number",
                    message: "What is the SALARY for this role?\n(NO DOLLAR SIGN, NO COMMAS, INCLUDE CENTS ie: 85500.00)"
                }, 
                {
                    name: "department",
                    type: "list",
                    message: "Select a DEPARTMENT for this role:",
                    choices: deptArr
                }
            ]).then(function(answers) {

                // Assign answers' inputs to variables
                let title = answers.title;
                let salary = answers.salary;
                // Go through query response '1' (res1) again to find the object where the department name is equal to the department answer choice
                let selectedDept = res1.find(obj => obj.name === answers.department);
                let deptID = selectedDept.id;

                // Query to INSERT new role values into roles data table
                connection.query(query.addRole(title, salary, deptID), function(err, res2) {

                    console.log(`\n${title} was added to 'Roles'!`);
                    // Render updated roles table, and restart 'Roles' action prompts
                    viewRoles();

                });
            });
    });
};

// ----------------------------------------------------------------------------------------------------------------
// DEPARTMENT QUERY FUNCTIONS
// ----------------------------------------------------------------------------------------------------------------

// Logs all department data in table format in the console
function viewDepartments() {

    connection.query(query.allDepartments, function(err, res) {

        console.log("\n All Departments:");
        printTable(res);
        console.log("\n");
        departmentAction("What else would you like to do with 'Departments'?");

    });
};

// Prompts user for inputs to pass into an INSERT query for 'departments' table
function addDepartment() {

    // Run inquirer
    inquirer
        .prompt({

            name: "name",
            type: "input",
            message: "What is the NAME of this new department?"

        }).then(function(answer) {

            // Assign answer's input to a variable
            let name = answer.name;

            // Query to INSERT new department value into departments data table
            connection.query(query.addDepartment(name), function(err, res2) {

                console.log(`\n${name} was added to 'Departments'!`);
                // Render updated departments table, and restart 'Departments' action prompts
                viewDepartments();

            });
        });
};
