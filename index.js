const meatcogs = require("./db/connection");
const inquirer = require("inquirer");
require("console.table");

// Initial inquirer prompt
const init = async () => {
  const answers = await inquirer.prompt({
    type: "list",
    name: "init",
    message: "Please pick a function:",
    choices: [
      "show all departments",
      "show all employees",
      "show all roles",
      "add employee",
      "update employee",
      "update employee manager",
      "delete employee",
      "add department",
      "add a role",
    ],
  });

  // Switch case function when selecting answers.
  switch (answers.init) {
    case "show all departments":
      return showDepartments();
    case "show all employees":
      return showEmployees();
    case "show all roles":
      return showRole();
    case "add employee":
      return addEmployee();
    case "update employee":
      return updateEmployee();
    case "update employee manager":
      return updateEmployeeManager();
    case "delete employee":
      return deleteEmployee();
      case "add department":
        return addDepartment();
        case "add a role":
        return addRole();

    default:
      return;
  }
};

// Add employee function
const addEmployee = async () => {
  const answers = await inquirer.prompt([
    { name: "firstName", message: "what is the employee's first name?" },
    { name: "lastName", message: "what is the employee's last name?" },
    { name: "role_id", message: "what is the employee's role ID?" },
    { name: "manager_id", message: "what is the employee's manager's id?" },
  ]);

  // Inserts new employee name, id, and role into database
  meatcogs.query(
    `INSERT INTO employee set ?,?,?,?`,
    [
      { first_name: answers.firstName },
      { last_name: answers.lastName },
      { role_id: answers.role_id },
      { manager_id: answers.manager_id },
    ],
    (err, result) => {
      if (err) console.error(err);
      showEmployees();
    }
  );
};

// Updates employee role in table
const updateEmployee = () => {
  meatcogs.query("select * from employee", (err, data) => {
    if (err) console.log(err);

    let employees = data.map((employee) => `${employee.last_name}`);

    inquirer
      .prompt([
        {
          message: "please pick a employee",
          type: "list",
          choices: [...employees],
          name: "last_name",
        },
        {
          message: "please insert a new employee role id",
          type: "input",
          name: "role_id",
        },
      
      ])
      .then((answers) => {
        console.log(answers);
        meatcogs.query(
          "UPDATE EMPLOYEE SET role_id=? WHERE last_name=?",
          [answers.role_id, answers.last_name],
          (err, data) => {
            if (err) throw err;

            showEmployees();
          }
        );
      });
  });
};

// Updates employee manager
const updateEmployeeManager = () => {
  meatcogs.query("select * from employee", (err, data) => {
    if (err) console.log(err);

    let employees = data.map((employee) => `${employee.last_name}`);

    inquirer
      .prompt([
        {
          message: "please pick a employee",
          type: "list",
          choices: [...employees],
          name: "last_name",
        },

        {
          message: "please update employee manager's id",
          type: "input",
          name: "manager_id",
        },
      ])
      .then((answers) => {
        console.log(answers);
        meatcogs.query(
          "UPDATE EMPLOYEE SET manager_id=? WHERE last_name=?",
          [answers.manager_id, answers.last_name],
          (err, data) => {
            if (err) throw err;

            showEmployees();
          }
        );
      });
  });
};

// Shows department information
const showDepartments = () => {
  const query = `SELECT * FROM department`;
  meatcogs.query(query, (err, data) => {
    if (err) console.log(err);
    console.table(data);
    init();
  });
};

// Shows employees
const showEmployees = () => {
  const query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
  meatcogs.query(query, (err, data) => {
    if (err) console.log(err);
    console.table(data);
    init();
  });
};

// Deletes employee from database
const deleteEmployee = () => {
  meatcogs.query(`select * from employee`, (err, data) => {
    if (err) console.log(err);

    let employees = data.map((employee) => `${employee.last_name}`);

    inquirer
      .prompt([
        {
          message: "please pick a employee to delete",
          type: "list",
          choices: [...employees],
          name: "last_name",
        },
      ])
      .then((answers) => {
        console.log(answers);
        meatcogs.query(
          "DELETE FROM EMPLOYEE WHERE last_name=?",
          answers.last_name,
          (err, data) => {
            if (err) throw err;

            showEmployees();
          }
        );
      });
  });
};

// Shows different roles
const showRole = () => {
  const query = `SELECT * FROM role`;
  meatcogs.query(query, (err, data) => {
    if (err) console.log(err);
    console.table(data);
    init();
  });
};

  // Inserts new department into dataset 
  meatcogs.query(
    `INSERT INTO department set ?`,
      [
        { name: answers.name },
      ],
      
    (err, result) => {
      if (err) console.error(err);
      showDepartment();
    }
  );

init();

// creates new role
const addRole = async () => {
  const answers = await inquirer.prompt([
    { name: "title", message: "what is the name of the role" },
    { name: "salary", message: "what is the roles salary" },
    { name: "role_id", message: "what is the new role ID?" },
    
  ]);

  // Inserts new title, salary, and department_id
  meatcogs.query(
    `INSERT INTO role set ?,?,?`,
    [
      { title: answers.title },
      { salary: answers.salary },
      { department_id: answers.department_id },
      
    ],
    (err, result) => {
      if (err) console.error(err);
      showRole();
    }
  );
};