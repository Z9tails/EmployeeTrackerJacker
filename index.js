const meatcogs = require("./db/connection");
const inquirer = require("inquirer");
require("console.table");


--// Inquirer question structure function
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
      "delete employee",
    ],
  });


--// Switch case dependant on choice response. 
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
      case "delete employee":
        return deleteEmployee();


    default:
      return;
  }
};

--// Add Employee function
const addEmployee = async () => {
  const answers = await inquirer.prompt([
    { name: "firstName", message: "what is the employee's first name?" },
    { name: "lastName", message: "what is the employee's last name?" },
    { name: "role_id", message: "what is the employee's role ID?" },
  ]);

  meatcogs.query(
    `INSERT INTO employee set ?,?,?`,
    [
      { first_name: answers.firstName },
      { last_name: answers.lastName },
      { role_id: answers.role_id },
    ],
    (err, result) => {
      if (err) console.error(err);
      showEmployees();
    }
  );
};


--// Update employee function
const updateEmployee = () => {
  // showEmployees();

  meatcogs.query(`select * from employee`,  (err, data) => {
    if (err) console.log(err);

    let employees = data.map((employee) => `${employee.last_name}`);

    inquirer.prompt([
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
      ]).then(

      answers=>{

        console.log(answers);
        meatcogs.query(
          "UPDATE EMPLOYEE SET role_id=? WHERE last_name=?",
          [answers.role_id, answers.last_name],
          (err, data) => {
            if (err) throw err;
    
            showEmployees();
          }
        )
      }
      
  
  
      )
    })}



--// Show department function
const showDepartments = () => {
  const query = `SELECT * FROM department`;
  meatcogs.query(query, (err, data) => {
    if (err) console.log(err);
    console.table(data);
    init();
  });
};

--// Show employee function
const showEmployees = () => {
  const query =
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
  meatcogs.query(query, (err, data) => {
    if (err) console.log(err);
    console.table(data);
    init();
  });
};


--// Delete employee function
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

--// Show role function
const showRole = () => {
  const query = `SELECT * FROM role`;
  meatcogs.query(query, (err, data) => {
    if (err) console.log(err);
    console.table(data);
    init();
  });
};

init();
