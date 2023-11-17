const fetch = require("node-fetch");

let totalTasks = [];

async function fetchData(url) {
  let data = await fetch(url);
  data = await data.json();
  return data;
}

async function main() {
  // Fetch all the users by calling the /users API using node-fetch
  const getAllUsers = await fetchData("http://localhost:3000/users");
  console.log(getAllUsers);

  // Fetch todos for each user in chunks of 5 users by calling the /todos API, i.e,
  // Fetch the todos for first 5 users concurrently.
  // Once the todos for the first 5 users are fetched, wait for 1 second
  // and then fetch the todos of the next 5 users concurrently
  // wait for 1 more second and fetch the todos of the next 5 users concurrently and so on until todos for all users are fetched. We fetch the todos in chunks so as to not overload the server.

  for (let i = 1; i < 16; i++) {
    if (i % 5 === 1 && i !== 1) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    let response = await fetchData(`http://localhost:3000/todos?user_id=${i}`);
    console.log(`user ${i}`);
    console.log(response);
  }

  // Once todos for all users are fetched, calculate how many todos are completed for each user and print the result
  let todotasks = getAllUsers.users;
  for (i in todotasks) {
    let response = await fetchData(`http://localhost:3000/todos?user_id=${i}`);
    let count = 0;
    for (j of response.todos) {
      if (j.isCompleted) {
        count++;
      }
    }
    todotasks[i].todos = count;
    totalTasks.push(todotasks[i]);
  }
  console.log(totalTasks);
}

main();
