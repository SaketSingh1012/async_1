const fetch = require("node-fetch");

// Write your code here
async function fetchUserData() {
  const response = await fetch("http://localhost:3000/users");
  const userData = await response.json();
  return userData;
}

async function main() {
  const { users } = await fetchUserData();

  const cropCount = 5;

  for (let i = 0; i < users.length; i += cropCount) {
    const chunk = users.slice(i, i + cropCount);

    const todoPromises = await (chunk.map(async (user) => {
      const todosResponse = await fetch(`http://localhost:3000/todos?user_id=${user.id}`);
      const todosData = await todosResponse.json();
      return { user, todos: todosData };
    }));
    const userTodos = await Promise.all(todoPromises)

    // console.log(userTodos);

    await new Promise(resolve => setTimeout(resolve, 1000));

    // console.log(userTodos)

    for (const { user, todos } of userTodos) {
      const completedTodoCount = todos.todos.filter((todo) => todo.isCompleted == true).length
      console.log(completedTodoCount);
    }
  }
}

main();