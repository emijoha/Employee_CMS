-- create departments
INSERT INTO departments (name) 
VALUES  ("Sales"), 
        ("Engineering"), 
        ("Finance"), 
        ("Legal");

-- create roles
INSERT INTO roles (title, salary, department_id) 
VALUES  ("Sales Lead", 100000.00, 1), 
        ("Salesperson", 80000.00, 1), 
        ("Lead Engineer", 150000.00, 2), 
        ("Software Engineer", 120000.00, 2), 
        ("Account Manager", 140000.00, 3), 
        ("Accountant", 125000.00, 3), 
        ("Legal Team Lead", 250000.00, 4), 
        ("Lawyer", 190000.00, 4);

-- create employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) 
VALUES  ("Arthur", "Pendragon", 7, null),
        ("Merlin", "Ambrosius", 3, null),
        ("Lancelot", "DuLac", 1, null),
        ("Guinevere", "Pendragon", 5, null),
        ("Gawain", "Orkney", 8, 1),
        ("Nimue", "Diones", 4, 2),
        ("Galahad", "DuLac", 2, 3),
        ("Isolde", "LaBeale", 6, 4);