const modeList = document.querySelector('.mode-select');
const modes = modeList.children;
const modeText = document.querySelector('.mode-text');
const modeContent = modeText.children;

const helpMode = 'help';
const todoMode = 'todo';
const shellMode = 'shell';
let currentMode = sessionStorage.getItem('currentMode');

let keysPressed = {};

document.addEventListener('keydown', (e) => {
  keysPressed[e.key] = true;

  if (keysPressed['Control'] && e.key === '1') {
    sessionStorage.setItem('currentMode', helpMode);
    currentMode = sessionStorage.getItem('currentMode');
    changeMode(currentMode);
    changeModeText(currentMode);
  } else if (keysPressed['Control'] && e.key === '2') {
    sessionStorage.setItem('currentMode', todoMode);
    currentMode = sessionStorage.getItem('currentMode');
    changeMode(currentMode);
    changeModeText(currentMode);
  } else if (keysPressed['Control'] && e.key === '3') {
    sessionStorage.setItem('currentMode', shellMode);
    currentMode = sessionStorage.getItem('currentMode');
    changeMode(currentMode);
    changeModeText(currentMode);
  }
});

document.addEventListener('keyup', (e) => {
  delete keysPressed[e.key];
});

const changeMode = (newMode) => {
  [...modes].forEach(mode => {
    if (mode.textContent === newMode) {
      mode.classList.remove('mode-idle');
      mode.classList.add('mode-focus');
    } else {
      mode.classList.remove('mode-focus');
      mode.classList.add('mode-idle');
    }
  });
};

const changeModeText = (newMode) => {
  [...modeContent].forEach(modeContent => {
    if (modeContent.classList.contains(newMode)) {
      modeContent.classList.remove('hide');
      modeContent.classList.add('show');
      if (modeContent.classList.contains(shellMode)) { // pretty hacky
        document.querySelectorAll('.todo-input').forEach(function(node) {
          node.focus();
        });
      }
    } else {
      modeContent.classList.remove('show');
      modeContent.classList.add('hide');
    }
  });
};

if (!currentMode) {
  currentMode = helpMode;
  sessionStorage.setItem('currentMode', currentMode);
}

document.addEventListener('DOMContentLoaded', () => {
  changeMode(currentMode);
  changeModeText(currentMode);
});

//////////////////////////////////////////////////////////////////

const todoInput = document.querySelector('.todo-input');
const todoDisplay = document.querySelector('.todo');
const todoUL = document.createElement('ul');
let todoList = JSON.parse(sessionStorage.getItem('currentTodoList')) || [];
let line = document.querySelector('.line');

todoUL.classList.add('todo-list');
todoDisplay.append(todoUL);

function todoEntry(task) {
  this.task = task;
  this.completed = false;
}

const handleTodoInput = (e) => {
  if (e.target.value === 'todos' && e.key === 'Enter') {
    // log todos on a new line
    let newLine = document.createElement('span');
    newLine.textContent = sessionStorage.getItem('currentTodoList');
    e.target.parentElement.after(newLine);
    e.target.value = ''; // Clear the input
    e.target.disabled = true;

    // Clone the line and add the event listener to the new input
    let newInput = line.cloneNode(true);
    let newTodoInput = newInput.querySelector('.todo-input');
    // Ensure the event listener is only added once
    if (!newTodoInput.hasAttribute('data-listener-attached')) {
      newTodoInput.addEventListener('keyup', handleTodoInput);
      newTodoInput.setAttribute('data-listener-attached', 'true');
      newTodoInput.removeAttribute('disabled');
    }

    // Insert the new input after the new line
    newLine.after(newInput);

    // Set focus on the new input element
    newTodoInput.focus();

    // Only disable the original input if it's the one that was just used
    if (e.target === todoInput) {
      e.target.disabled = true;
    }
  } else if (e.target.value.startsWith('todo ') && e.key === 'Enter') {
    // Process the 'todo' command
    todoList.push(new todoEntry(e.target.value.slice(5)));
    let stringifiedTodoList = JSON.stringify(todoList);
    sessionStorage.setItem('currentTodoList', stringifiedTodoList);
    displayCurrentTodoList(sessionStorage.getItem('currentTodoList'));
    e.target.value = ''; // Clear the input
    e.target.disabled = true;

    // Clone the line and add the event listener to the new input
    let newInput = line.cloneNode(true);
    let newTodoInput = newInput.querySelector('.todo-input');
    // Ensure the event listener is only added once
    if (!newTodoInput.hasAttribute('data-listener-attached')) {
      newTodoInput.addEventListener('keyup', handleTodoInput);
      newTodoInput.setAttribute('data-listener-attached', 'true');
      newTodoInput.removeAttribute('disabled');
    }

    // Append the new input to the parent element
    e.target.parentElement.after(newInput);

    // Set focus on the new input element
    newTodoInput.focus();
  } else if (e.target.value === 'rm -rf .' && e.key === 'Enter') {
    document.querySelectorAll('*').forEach(function(node) {
      node.style.display = 'none';
    });
  }
};


// Attach the initial event listener to the todoInput
todoInput.addEventListener('keyup', handleTodoInput);


const displayCurrentTodoList = (currentTodoList = '[]') => {
  const parsedTodoList = JSON.parse(currentTodoList);

  todoUL.innerHTML = '';

  for (let i = 0; i < parsedTodoList.length; i++) {
    let todoName = document.createElement('label');
    todoName.setAttribute('name', parsedTodoList[i].task);
    todoName.textContent = parsedTodoList[i].task;

    let todoCompleted = document.createElement('input');
    todoCompleted.setAttribute('type', 'checkbox');
    todoCompleted.setAttribute('name', parsedTodoList[i].completed);
    todoCompleted.checked = false;

    let todo = document.createElement('li');
    todo.append(todoCompleted, todoName);

    todoUL.append(todo);
  }
}

displayCurrentTodoList(sessionStorage.getItem('currentTodoList'));


// const handleTodoInput = (e) => {
//   if (e.target.value === 'todos' && e.key === 'Enter') {
//     // log todos on a new line
//     let newLine = document.createElement('span');
//     newLine.textContent = sessionStorage.getItem('currentTodoList');
//     line.after(newLine);
//     e.target.value = ''; // Clear the input

//     // Clone the line and add the event listener to the new input
//     let newInput = line.cloneNode(true);
//     let newTodoInput = newInput.querySelector('.todo-input');
//     newTodoInput.addEventListener('keyup', handleTodoInput);

//     // Insert the new input after the new line
//     newLine.after(newInput);

//     // Set focus on the new input element
//     newTodoInput.focus();

//     // Only disable the original input if it's the one that was just used
//     if (e.target === todoInput) {
//       e.target.disabled = true;
//     }
//   } else if (e.target.value.startsWith('todo') && e.key === 'Enter') {
//     // Process the 'todo' command
//     todoList.push(new todoEntry(e.target.value.slice(5)));
//     let stringifiedTodoList = JSON.stringify(todoList);
//     sessionStorage.setItem('currentTodoList', stringifiedTodoList);
//     displayCurrentTodoList(sessionStorage.getItem('currentTodoList'));
//     e.target.value = ''; // Clear the input

//     // Clone the line and add the event listener to the new input
//     let newInput = line.cloneNode(true);
//     let newTodoInput = newInput.querySelector('.todo-input');
//     newTodoInput.addEventListener('keyup', handleTodoInput);

//     // Find the parent element of the current input to insert the new input after it
//     let inputParent = e.target.parentElement;
//     console.log(inputParent);
//     inputParent.after(newInput);

//     // Set focus on the new input element
//     newTodoInput.focus();

//     // inputParent.querySelector('.todo-input').disabled = true;

//     // Only disable the original input if it's the one that was just used
//     // if (e.target === todoInput) {
//     //   e.target.disabled = true;
//     // }

//   }
// }
