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
      'Add a Role',
      "Update an Employee's Role",
      'View Departments',
      'View Employees',
      'View Roles'
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
        case "Update an Employee's Role":
          updateRole()
          break
        case 'View Departments':
          viewDepartments()
          break
        case 'View Employees':
          viewEmployees()
          break
        case 'View Roles':
          viewRoles()
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
        if (departments.map(department => department.name).indexOf(name) === -1) {
          db.query('INSERT INTO departments SET ?', { name }, err => {
            if (err) console.log(err)
            else console.log("Department Added!")
          })
        } else {
          console.log("This department already exists!")
        }
        manageEmployees()
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
          choices: employees.map(employee => ({
            name: employee.first_name,
            value: employee.id
          })).concat(['None'])
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
            manageEmployees()
          })
        })
        .catch(err => console.log(err))
    })
  })
}

const addRole = () => {
  db.query('SELECT * FROM departments', (err, departments) => {
    if (err) console.log(err)
    db.query('SELECT * FROM roles', (err, roles) => {
      if (err) console.log(err)
      inquirer.prompt([
        {
          type: 'input',
          name: 'title',
          message: 'What is the title of the new role?'
        }, {
          type: 'float',
          name: 'salary',
          message: 'What is the salary for the new role?'
        }, {
          type: 'list',
          name: 'department_id',
          message: 'What department is the new role under?',
          choices: departments.map(department => ({
            name: department.name,
            value: department.id
          }))
        }
      ])
        .then(newRole => {
          if (roles.map(role => role.title).indexOf(newRole.title) === -1) {
            db.query('INSERT INTO roles SET ?', newRole, err => {
              if (err) console.log(err)
              else console.log('Role Added!')
            })
          } else {
            console.log('This role already exists!')
          }
          manageEmployees()
        })
        .catch(err => console.log(err))
    })
  })
}

const updateRole = () => {
  db.query('SELECT * FROM employees', (err, employees) => {
    if (err) console.log(err)
    inquirer.prompt({
      type: 'list',
      name: 'id',
      message: "Which employee's role do you want to update?",
      choices: employees.map(employee => ({
        name: employee.first_name + ' ' + employee.last_name,
        value: employee.id
      }))
    })
      .then(({ id }) => {
        db.query('SELECT * FROM roles', (err, roles) => {
          if (err) console.log(err)
          inquirer.prompt({
            type: 'list',
            name: 'role_id',
            message: 'What is the new role for this employee?',
            choices: roles.map(role => ({
              name: role.title,
              value: role.id
            }))
          })
            .then(({ role_id }) => {
              db.query('UPDATE employees SET ? WHERE ?', [{ role_id }, { id }], err => {
                if (err) console.log(err)
                console.log('Employee Role Updated!')
                manageEmployees()
              })
            })
            .catch(err => console.log(err))
        })
      })
      .catch(err => console.log(err))
  })
}

const viewDepartments = () => {
  db.query('SELECT name FROM departments', (err, departments) => {
    console.table(departments)
    manageEmployees()
  })
}

const viewEmployees = () => {
  db.query('SELECT first_name FROM employees', (err, employees) => {
    console.table(employees)
    manageEmployees()
  })
}

const viewRoles = () => {
  db.query('SELECT title FROM roles', (err, roles) => {
    console.table(roles)
    manageEmployees()
  })
}

manageEmployees()