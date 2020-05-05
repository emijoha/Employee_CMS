const query = {

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
    `
};

module.exports = query;