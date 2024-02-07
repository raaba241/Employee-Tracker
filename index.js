import inquirer from 'inquirer'

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
            if (answers.choice === "View All Employees"){
                viewAllEmployees()
            }
            else if (answers.choice === "Add Employee"){
                addEmployees()
            }
            else if (answers.choice === "Update Employee Role"){
                updateEmployeeRole()
            }
            else if (answers.choice === "View All Roles"){
                viewAllRoles()
            }
            else if (answers.choice === "Add Role"){
                addRole()
            }
            else if (answers.choice === "View All Departments"){
                viewAllDepartments()
            }
            else if (answers.choice === "Add Department"){
                addDepatment()
            }
            else if (answers.choice === "Quit"){
                quit()
            }
         

        })
        .catch(error => {
            console.error('An error occurred:', error);
        });
}

function viewAllEmployees(){}
function addEmployees(){}
function updateEmployeeRole(){}
function viewAllRoles(){}
function addRole(){}
function viewAllDepartments(){}
function addDepatment(){}
function quit(){}

mainQuestions()

