# Employee Content Management System
# (Employee_CMS)

[![Maintained Badge](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/emijoha)

## Description

A command-line application that allows the user to view and interact with employee information stored in a MySQL company database. 

This application uses Node and the following npm packages:

* inquirer
* console.table
* mysql

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [Upcoming Features](#upcoming-features)
* [License](#license)
* [Contributing](#contributing)
* [Tests](#tests)
* [Questions](#questions)

## Installation

1. Clone this repo 
2. Open the terminal in the main directory ("Employee_CMS") 
3. Run `npm install` to install all dependencies 
4. Run `npm start` to begin using the application.

## Usage

### User Story

```
As a business owner
I want to be able to view and manage the departments, roles, and employees in my company
So that I can organize and plan my business
```

This application was built to make it easy for non-developers to manage a company's employees. The user is prompted for what they would like to do in plain English, and depending on their choice selections and text inputs, varying database query functions are triggered to make that happen in the backend.

### How To Use:

1. Follow all steps in [Installation](#installation)
2. Once `npm start` is executed, read and answer the prompts.
3. Select a data category to manage: employees, roles, or departments
4. Then select whether you would like to view, add, or update data
    * Viewing data logs it in table format on the console
    * Adding data asks for choice selections and/or text inputs regarding the employee, role, or department you are adding to the database. Then, it adds it to the database and logs the updated table.
    * Updating data asks for choice selections and/or text inputs regarding the employee,
    role, or department you want to update, and its new value. Then, it updates it on the database and logs the updated table.
5. When you are done with your first action, select if you would like perform another view/add/update action OR exit the employeess/roles/departments data category you are in.
6. When exiting a data category, you are asked if you would like to manage a different data category or exit the application.

## Upcoming Features

Currently, updating data functionality is limited to employees' roles. I will be very soon adding more update functions. 
Also, there is no data deletion functionality. That will be added in the near future!

## License

MIT
Copyright 2020 Emilia Josefina Hartline.

## Contributing

Pull request are welcome! For major changes, open a issue first.

## Tests

There are currently no tests written for this application

## Questions

Feel free to contact us with any questions regarding this project!

<img src="https://avatars0.githubusercontent.com/u/60240293?v=4" alt="Image of Emilia Josefina Hartline" width="250"/>

[![Followers Badge](https://img.shields.io/badge/Followers-2-yellow)](https://github.com/emijoha)

Email Emilia Josefina Hartline at ejhartline@gmail.com 
