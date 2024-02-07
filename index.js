const inquirer = require('inquirer')
const db = require('./connections/connect.js')
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
                    'Quit',
                    'View All Employee'
                ],
            },
        ])
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

function viewAllEmployees() {
    db.query('SELECT employee.id AS employeeID,  employee.first_name AS FIRST_NAME, employee.last_name AS LAST_NAME, roles.title AS TITLE, roles.salary AS SALARY, department.name AS DEPARTMENT,manager.id AS MANAGER_ID,manager.first_name AS MANAGER_FIRST_NAME,manager.last_name AS MANAGER_LAST_NAME FROM employee INNER JOIN roles ON employee.role_id = roles.id INNER JOIN department ON roles.department_id = department.id LEFT JOIN	employee manager ON  employee.manager_id = manager.id;', (error, answers, fields) => {
        if (error) throw error;
        console.log("   ")
        console.log("id   First Name     Last Name          Title               department        salary         manager");
        console.log("--   -------------  --------------     -------             ---------------   ----------     --------------");

        for (let x = 0; x < answers.length; x++) {
            console.log(answers[x].employeeID + "    " + answers[x].FIRST_NAME + "            " + answers[x].LAST_NAME + "             " + answers[x].TITLE + "         " + answers[x].DEPARTMENT + "     " + answers[x].SALARY + "            " + answers[x].MANAGER_FIRST_NAME + " " + answers[x].MANAGER_LAST_NAME)
        }

    })
    mainQuestions()
}
function addEmployees() {
    function getListRolesAndManagers() {
        return Promise.all([
            new Promise((resolve, reject) => {
                const roles = [];
                db.query('SELECT title FROM roles', (error, answers, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        for (let x = 0; x < answers.length; x++) {
                            roles.push(answers[x].title);
                        }
                        resolve(roles);
                    }
                });
            }),
            new Promise((resolve, reject) => {
                const managers = [];
                db.query('SELECT first_name, last_name FROM employee WHERE manager_id IS NULL', (error, answers, fields) => {
                    if (error) {
                        reject(error);
                    } else {
                        for (let x = 0; x < answers.length; x++) {
                            managers.push(`${answers[x].first_name} ${answers[x].last_name}`);
                        }
                        resolve(managers);
                    }
                });
            })
        ]);
    }
    
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
            console.log (answers)
        });
    }).catch(error => {
        console.error("An error occurred:", error);
    });
}
function updateEmployeeRole() {
    mainQuestions()
}
function viewAllRoles() {
    db.query('SELECT roles.id, title, salary, name FROM roles INNER JOIN	department ON roles.department_id = department.id ', (error, answers, fields) => {
        if (error){
            throw(error)
        }
        console.log(" ")
        for (let x = 0; x < answers.length; x++){

            console.log(`${answers[x].id}      ${answers[x].title}              ${answers[x].name}            $${answers[x].salary} `)
        }
    })

}
function addRole() {
    mainQuestions()
}
function viewAllDepartments() {
    mainQuestions()
}
function addDepatment() {
    mainQuestions()
}
function quit() {
    process.exit()
}

mainQuestions()

