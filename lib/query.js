const query = {

    // ----------------------------------------------------------------------------------------------------------------
    // 'VIEW ALL' SELECT QUERIES FOR CONSOLE.TABLE
    // ----------------------------------------------------------------------------------------------------------------

    // Query for viewing all 'Employee' row data, using employees table alias 'base_employees'
    // and joining with roles, departments, and employees tables for additional data columns
    // left join on employees table assures that null manager_id values are not ignored
    allEmployees: `
        SELECT 	
            base_employees.id AS "ID", 
            base_employees.first_name AS "First Name", 
            base_employees.last_name AS "Last Name", 
            roles.title AS "Role Title",
            roles.salary AS "Salary",
            departments.name AS "Department",
            CONCAT(employees.first_name, " ", employees.last_name) AS "Manager"
        FROM employees AS base_employees
            INNER JOIN roles
                ON base_employees.role_id = roles.id
            INNER JOIN departments
                ON roles.department_id = departments.id
            LEFT JOIN employees
                ON base_employees.manager_id = employees.id;
    `,

    // Query for viewing all 'Roles' row data, and joining with departments table to show department name
    allRoles: `
        SELECT 
            roles.id AS "ID",
            roles.title AS "Role Title",
            roles.salary AS "Role Salary",
            departments.name AS "Department"
        FROM roles
            INNER JOIN departments
                ON roles.department_id = departments.id;
    `,

    // Query for viewing all 'Departments' row data
    allDepartments: `
        SELECT
            id AS "ID",
            name AS "Department"
        FROM departments
    `,

    // ----------------------------------------------------------------------------------------------------------------
    // SIMPLE SELECT QUERIES FOR INQUIRER LIST CHOICES
    // ----------------------------------------------------------------------------------------------------------------

    // Returns objects array of all existing role ids and titles
    roles: `
        SELECT
            id,
            title
        FROM roles
    `,

    // Returns objects array of all existing employees' first and last names and ids
    // Also used to select an exisiting employee as a new employee's manager
    employees: `
        SELECT 
            id,
            CONCAT(employees.first_name, " ", employees.last_name) AS "employee"
        FROM employees
    `,

    // Returns objects array of all exisiting department ids and names
    departments: `
        SELECT 
            id,
            name
        FROM departments
    `,

    // ----------------------------------------------------------------------------------------------------------------
    // 'ADD' METHODS THAT RETURN INSERT QUERIES 
    // ----------------------------------------------------------------------------------------------------------------
    // Instead of a property, these queries are methods, so that variables existing outside of this module can be passed in
    
    // INSERT query for employees table
    addEmployee(first_name, last_name, role_id, manager_id) {
        return `
            INSERT INTO employees (first_name, last_name, role_id, manager_id)
            VALUES ("${first_name}", "${last_name}", ${role_id}, ${manager_id});
        `;
    },

    // INSERT query for roles table
    addRole(title, salary, department_id) {
        return `
            INSERT INTO roles (title, salary, department_id)
            VALUES ("${title}", ${salary}, ${department_id});
        `;
    },

    // INSERT query for departments table
    addDepartment(name) {
        return `
            INSERT INTO departments (name)
            VALUES ("${name}");
        `;
    },

    // ----------------------------------------------------------------------------------------------------------------
    // 'UPDATE' METHODS THAT RETURN UPDATE QUERIES
    // ----------------------------------------------------------------------------------------------------------------
    // Instead of a property, these queries are methods, so that variables existing outside of this module can be passed in

    // UPDATE query for employee's role
    updateEmpRole(roleID, employeeID) {
        return `
            UPDATE employees
            SET role_id = ${roleID}
            WHERE id = ${employeeID};
        `;
    },

    // UPDATE query for employee's manager
    updateEmpManager(managerID, employeeID) {
        return `
            UPDATE employees
            SET manager_id = ${managerID}
            WHERE id = ${employeeID};
        `;
    }
};

module.exports = query;