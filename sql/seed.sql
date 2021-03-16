USE employees_db;

INSERT INTO departments (name)
VALUES('Sales'),
	    ('Engineering'),
      ('Legal'),
      ('Human Resources');

INSERT INTO roles (title, salary, department_id)
VALUES('Sales Representative', 60000, 1),
 	    ('Engineer', 80000, 2),
      ('Lawyer', 100000, 3),
      ('Human Resources Representative', 90000, 4);