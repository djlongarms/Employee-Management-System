const inquirer = require('inquirer')
const mysql = require('mysql2')

const db = mysql.createConnection('mysql://root:rootroot@localhost/employees_db')

const manageEmployees = () => {
  inquirer.prompt({
    type: 'list',
    name: 'action',
    message: 'What would you like to do?',
    choices: [
      'Add a Department',
      'Add an Employee',
      'Add a Role'
    ]
  })
    .then(({ action }) => {
      switch (action) {
        case 'Add a Department':
          addDepartment()
          break
        case 'Add an Employee':
          addEmployee()
          break
        case 'Add a Role':
          addRole()
          break
      }
    })
    .catch(err => console.log(err))
}

const addDepartment = () => {
  db.query('SELECT * FROM departments', (err, departments) => {
    inquirer.prompt({
      type: 'input',
      name: 'name',
      message: 'What is the name of the new department?'
    })
      .then(({ name }) => {
        if (departments.map(department => department.name).indexOf(name) === -1) 
        {
          db.query('INSERT INTO departments SET ?', { name }, err => {
            if (err) console.log(err)
            else console.log("Department Added!")
          })
        } else {
          console.log("This department already exists!")
        }
      })
      .catch(err => console.log(err))
  })
}

const addEmployee = () => {

}

const addRole = () => {

}

manageEmployees()