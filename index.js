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
  db.query('SELECT * FROM roles', (err, roles) => {
    if (err) console.log(err)
    db.query('SELECT * FROM employees', (err, employees) => {
      if (err) console.log(err)
      inquirer.prompt([
        {
          type: 'input',
          name: 'first_name',
          message: "What is the new employee's first name?"
        }, {
          type: 'input',
          name: 'last_name',
          message: "What is the new employee's last name?"
        }, {
          type: 'list',
          name: 'role',
          message: "What role does this employee have?",
          choices: roles.map(role => ({
            name: role.title,
            value: role.id
          }))
        }, {
          type: 'list',
          name: 'manager',
          message: "Who is this employee's manager?",
          choices: employees.map(employee => employee.first_name).concat(['None'])
        }
      ])
        .then(({ first_name, last_name, role, manager }) => {

          if (manager === 'None') manager = null

          let newEmployee = {
            first_name: first_name,
            last_name: last_name,
            role_id: role,
            manager_id: manager
          }

          db.query('INSERT INTO employees SET ?', [newEmployee], err => {
            if (err) console.log(err)
            else console.log("Employee Added!")
          })
        })
        .catch(err => console.log(err))
    })
  })
}

const addRole = () => {

}

manageEmployees()