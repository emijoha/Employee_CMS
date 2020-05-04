const query = {

    allEmp: `
        SELECT employees.id, first_name, last_name, roles.title, departments.name AS department
        FROM employees
            INNER JOIN roles
                ON employees.role_id = roles.id
            INNER JOIN departments
                ON roles.department_id = departments.id;
    `,

    
    
    
};

module.exports = query;