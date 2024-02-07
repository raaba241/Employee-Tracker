import inquirer from 'inquirer'

function mainQuestions() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'reptile',
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
            
        })
        .catch(error => {
            console.error('An error occurred:', error);
        });
}

mainQuestions()