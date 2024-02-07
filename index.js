import inquirer from 'inquirer'

function main() {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'reptile',
                message: 'Which is better?',
                choices: ['alligator', 'crocodile'],
            },
        ])
        .then(answers => {
            console.info('Answer:', answers.reptile);
        })
        .catch(error => {
            console.error('An error occurred:', error);
        });
}

main();