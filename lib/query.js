const query = {

    allEmp: `
        SELECT 	
            base_employees.id AS "ID", 
            base_employees.first_name AS "First Name", 
            base_employees.last_name AS "Last Name", 
            roles.title AS "Job Title",
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

    
    
    
};

module.exports = query;