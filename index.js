// Importing inquirer and requiring the connections file
const inquirer = require('inquirer')
const db = require('./connections/connect.js')

//Main menu questions 
function mainQuestions() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'choice',
                message: 'What would you like to do? (Use arrow keys to navigate list)',
                choices: ['View All Employees',
                    'Add Employee',
                    'Update Employee Role',
                    'View All Roles',
                    'Add Role',
                    'View All Departments',
                    'Add Department',
                    'Quit'
                ],
            },
        ])
        //Once questions are done being asked, launch a specific function
        .then(answers => {
            if (answers.choice === "View All Employees") {
                viewAllEmployees()
            }
            else if (answers.choice === "Add Employee") {
                addEmployees()
            }
            else if (answers.choice === "Update Employee Role") {
                updateEmployeeRole()
            }
            else if (answers.choice === "View All Roles") {
                viewAllRoles()
            }
            else if (answers.choice === "Add Role") {
                addRole()
            }
            else if (answers.choice === "View All Departments") {
                viewAllDepartments()
            }
            else if (answers.choice === "Add Department") {
                addDepatment()
            }
            else if (answers.choice === "Quit") {
                quit()
            }


        })
        .catch(error => {
            console.error('An error occurred:', error);
        });
}

//Function to view all employees (complete)
function viewAllEmployees() {
    db.query('SELECT employee.id AS employeeID,  employee.first_name AS FIRST_NAME, employee.last_name AS LAST_NAME, roles.title AS TITLE, roles.salary AS SALARY, department.name AS DEPARTMENT,manager.id AS MANAGER_ID,manager.first_name AS MANAGER_FIRST_NAME,manager.last_name AS MANAGER_LAST_NAME FROM employee INNER JOIN roles ON employee.role_id = roles.id INNER JOIN department ON roles.department_id = department.id LEFT JOIN	employee manager ON  employee.manager_id = manager.id ORDER BY employee.id ASC;', (error, answers) => {
        if (error) throw error;
        console.log("   ")
        console.table(answers)
        mainQuestions()

    })

}

//Function to add employees 
function addEmployees() {
    function getListRolesAndManagers() {
        //Need promise.all() to complete 2 promises, normally only 1 promise can be satisfied
        return Promise.all([
            //Makes sure the roles get selected and stored in roles
            new Promise((resolve, reject) => {
                const roles = [];

                db.query('SELECT id, title FROM roles', (error, answers, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        for (let x = 0; x < answers.length; x++) {
                            roles.push({
                                name: answers[x].title,
                                id: answers[x].id
                            });
                        }

                        resolve(roles);
                    }
                });
            }),
            //Makes sure the managers get selected and stored in managers
            new Promise((resolve, reject) => {
                const managers = [];
                db.query('SELECT  id, first_name, last_name FROM employee WHERE manager_id IS NULL', (error, answers, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        for (let x = 0; x < answers.length; x++) {
                            managers.push({
                                name: `${answers[x].first_name} ${answers[x].last_name}`,
                                id: answers[x].id
                            })
                        }
                        managers.push('NONE')
                        resolve(managers);
                    }
                });
            })
        ]);
    }
    //Once both managers and roles arrays have been filled, those are then passed onto the next part of the line.
    getListRolesAndManagers().then(([roles, managers]) => {
        const questions = [{
            type: 'input',
            name: 'first_name',
            message: "What is the employee's first name? "
        }, {
            type: 'input',
            name: 'last_name',
            message: "What is the employee's last name? "
        },
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's role? ",
            choices: roles
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who is the employee's manager? ",
            choices: managers
        }];
        return inquirer.prompt(questions).then((answers) => {

            const rolesID = []

            for (let x = 0; x < roles.length; x++) {
                if (answers.role === roles[x].name) {
                    rolesID.push(roles[x].id)
                }
            }
            const managerID = []

            for (let x = 0; x < managers.length; x++) {
                if (answers.manager === managers[x].name) {
                    managerID.push(managers[x].id)
                }
            }

            if (answers.manager === 'NONE') {
                db.query(`INSERT INTO employee (first_name, last_name , role_id, manager_id) VALUES ('${answers.first_name}','${answers.last_name}', (SELECT id FROM roles WHERE title = 'HR Manager'), NULL)`)
            }
            else {
                db.query(`INSERT INTO employee (first_name, last_name , role_id, manager_id) VALUES ('${answers.first_name}','${answers.last_name}', ${rolesID}, '${managerID}')`)
            }


            console.log(`Successfully added ${answers.first_name} ${answers.last_name} to the employee table!`)
        });
    }).catch(error => {
        console.error("An error occurred:", error);
    });
}

function updateEmployeeRole() {

    // runa query to return all the roles, then use tha t data to creatae and array with objects with name and value propoerties.
// ran a query that returns all the available employees and map the data to return an array of objects with name and value properties
// run inquirer that will wask for the employee first name and last name, and have the user select a role and manager. 
// once that inquirer is completed I would run a query that would insert my new data into the db

    function getListRolesAndEmployees() {
        //Need promise.all() to complete 2 promises, normally only 1 promise can be satisfied
        return Promise.all([
            //Makes sure the roles get selected and stored in roles
            new Promise((resolve, reject) => {
                const roles = [];

                db.query('SELECT id, title FROM roles', (error, answers, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        for (let x = 0; x < answers.length; x++) {
                            roles.push({
                                name: answers[x].title,
                                id: answers[x].id
                            });
                        }

                        resolve(roles);
                    }
                });
            }),
            //Makes sure the managers get selected and stored in managers
            new Promise((resolve, reject) => {
                const employees = [];
                db.query('SELECT  id, first_name, last_name, role_id FROM employee', (error, answers, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        for (let x = 0; x < answers.length; x++) {
                            employees.push({
                                name: `${answers[x].first_name} ${answers[x].last_name}`,
                                id: answers[x].id,
                                roleID: answers.role_id
                            })
                        }

                        resolve(employees);
                    }
                });
            })
        ]);
    }
    getListRolesAndEmployees().then(([roles, employees]) => {
        inquirer.prompt([{
            type: 'list',
            name: 'employee',
            choices: employees,
            message: 'Which employee would you like to update?'

        },
        {
            type: 'list',
            name: 'role',
            choices: roles,
            message: 'What role would you like to update the role of the selected employee'
        }]
        ).then((answers) => {
            const employeeID = []
            for (let x = 0; x < employees.length; x++) {
                if (answers.employee === employees[x].name) {
                    employeeID.push(employees[x].id)
                }
            }
            const rolesID = []
            for (let x = 0; x < roles.length; x++) {
                if (answers.role === roles[x].name) {
                    rolesID.push(roles[x].id)
                }
            }


            db.query(`UPDATE employee SET role_id = ${rolesID} WHERE id = ${employeeID};`)


        }).then(() => {
            console.log("SUCCESS!")
            console.log("         ")
            mainQuestions()
        })
    })


}

//Allows user to view all roles currently existing (complete)
function viewAllRoles() {
    db.query('SELECT roles.id, title, salary, name FROM roles INNER JOIN department ON roles.department_id = department.id ', (error, answers) => {
        if (error) {
            throw (error)
        }
        console.table(answers)
        // for (let x = 0; x < answers.length; x++) {

        //     console.log(`${answers[x].id}      ${answers[x].title}              ${answers[x].name}            $${answers[x].salary} `)
        // }
        // console.log(' ')
        mainQuestions()
    })
}
//Succesfully Adds a role the user has defined 
function addRole() {
    db.query('SELECT id, name FROM department', (error, answers, fields) => {
        if (error) {
            throw (error)
        }
        else {
            const departmentObj = answers
            const departmentName = []
            for (let x = 0; x < answers.length; x++) {
                departmentName.push(answers[x].name)
            }

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'roleName',
                    message: 'What is the name of the role? '
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role '
                },
                {
                    type: 'list',
                    name: 'department',
                    choices: departmentName,
                    message: 'What depeartment does the role belong to? '
                }
            ]).then((answers) => {
                const selectedDepartmentID = []
                for (let x = 0; x < departmentObj.length; x++) {
                    if (answers.department === departmentObj[x].name) {
                        selectedDepartmentID.push(departmentObj[x].id)
                    }
                }
                db.query(`INSERT INTO roles (title, salary, department_id) VALUES ('${answers.roleName}',${answers.salary},${selectedDepartmentID})`)
                console.log(`Successfully added ${answers.roleName} to the database!`)

                mainQuestions()
            })

        }
    })
}
//A function to view all departments (complete)
function viewAllDepartments() {
    db.query('SELECT id, name FROM department', (error, answers, fields) => {
        if (error) {
            throw (error)
        }
        console.log(" ")
        for (let x = 0; x < answers.length; x++) {
            console.log(`${answers[x].id}     ${answers[x].name}`)
        }
        console.log(" ")
        mainQuestions()
    })
}

//Function to add a department (complete)
function addDepatment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department? '
        }
    ]).then((answers) => {
        db.query(`INSERT INTO department (name) VALUES ('${answers.departmentName}');`)
        console.log(`Successfully Added ${answers.departmentName} to the list of departments`)
        console.log(' ')
        mainQuestions()

    })
}
//Function to exit the terminal (complete)
function quit() {
    process.exit()
}

mainQuestions()

