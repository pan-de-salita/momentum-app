const modeList = document.querySelector('.mode-select');
const modes = modeList.children;
const modeText = document.querySelector('.mode-text');
const modeContent = modeText.children;

const helpButton = document.querySelector('.help-clickable');
const todoButton = document.querySelector('.todo-clickable');
const shellButton = document.querySelector('.shell-clickable');

const helpMode = 'help';
const todoMode = 'todo';
const shellMode = 'shell';
let currentMode = sessionStorage.getItem('currentMode');

const setInStorage = (key, value) => {
  sessionStorage.setItem(key, value);
}

const getFromStorage = (key) => {
  return sessionStorage.getItem(key);
}

////////////////////////////////////////////////////////////
//// invokes default mode (helpMode) when user first signs on
////////////////////////////////////////////////////////////

if (!currentMode) {
  setInStorage('currentMode', helpMode) // helpMode as default mode
  currentMode = getFromStorage('currentMode');
}

document.addEventListener('DOMContentLoaded', () => {
  changeMode(currentMode);
  changeModeText(currentMode);
});

////////////////////////////////////////////////////////////
//// change mode by key ////////////////////////////////////
////////////////////////////////////////////////////////////

// collects keys pressed
let keysPressed = {};

// handles mode changes according to key presses
document.addEventListener('keydown', (e) => {
  e.stopPropagation();
  keysPressed[e.key] = true;

  if (keysPressed['Control']) {
    currentMode = confirmModeByKey(e.key);
    changeMode(currentMode);
    changeModeText(currentMode);
  }
});

// determines appropriate mode according to key presses
const confirmModeByKey = (key) => {
  keysPressed[key] = true;

  if (keysPressed['x'] && key === 'm') {
    setInStorage('currentMode', helpMode);
  } else if (keysPressed['x'] && key === ',') {
    setInStorage('currentMode', todoMode);
  } else if (keysPressed['x'] && key === '.') {
    setInStorage('currentMode', shellMode);
  }

  return getFromStorage('currentMode');
}

// refreshes keys pressed
document.addEventListener('keyup', (e) => {
  delete keysPressed[e.key];
});

////////////////////////////////////////////////////////////
//// change mode by button click ///////////////////////////
////////////////////////////////////////////////////////////

// handles mode changes according to button clicked
document.addEventListener('click', (e) => {
  confirmModeByClick(e.target);

  currentMode = getFromStorage('currentMode');
  changeMode(currentMode);
  changeModeText(currentMode);
})

// determines appropriate mode according to button clicked
const confirmModeByClick = (button) => {
  if (button === helpButton) {
    setInStorage('currentMode', helpMode);
  } else if (button === todoButton) {
    setInStorage('currentMode', todoMode);
  } else if (button === shellButton) {
    setInStorage('currentMode', shellMode);
  }
}

////////////////////////////////////////////////////////////
//// change mode display ///////////////////////////////////
////////////////////////////////////////////////////////////

// changes mode
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

// changes mode text
const changeModeText = (newMode) => {
  [...modeContent].forEach(modeContent => {
    if (modeContent.classList.contains(newMode)) {
      modeContent.classList.remove('hide');
      modeContent.classList.add('show');
      // autofocus on input when in shellMode
      if (modeContent.classList.contains(shellMode)) {
        document.querySelector('.todo-input').focus();
      }
    } else {
      modeContent.classList.remove('show');
      modeContent.classList.add('hide');
    }
  });
};

////////////////////////////////////////////////////////////
// shell ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////

const todoInput = document.querySelector('.todo-input');
const todoDisplay = document.querySelector('.todo');
const todoUL = document.createElement('ul');
const quoteAPI = 'https://torvalds-quotes.herokuapp.com/';
let todoList = JSON.parse(sessionStorage.getItem('currentTodoList')) || [];
let quoteList = JSON.parse(sessionStorage.getItem('currentQuoteList')) || [];
let line = document.querySelector('.line');

todoUL.classList.add('todo-list');
todoDisplay.append(todoUL);

function todoEntry(task) {
  this.task = task;
  this.completed = false;
}

const handleShellInput = (e) => {
  if (e.target.value === 'rd --todo' && e.key === 'Enter') {
    let newLine = document.createElement('span');
    newLine.textContent = sessionStorage.getItem('currentTodoList');
    e.target.parentElement.after(newLine);
    e.target.value = '';
    e.target.disabled = true;

    let newInput = line.cloneNode(true);
    let newTodoInput = newInput.querySelector('.todo-input');
    if (!newTodoInput.hasAttribute('data-listener-attached')) {
      newTodoInput.addEventListener('keyup', handleShellInput);
      newTodoInput.setAttribute('data-listener-attached', 'true');
      newTodoInput.removeAttribute('disabled');
    }

    newLine.after(newInput);

    newTodoInput.focus();

  } else if (e.target.value.startsWith('add --todo ') && e.key === 'Enter') {
    todoList.push(new todoEntry(e.target.value.slice(11)));
    let stringifiedTodoList = JSON.stringify(todoList);
    sessionStorage.setItem('currentTodoList', stringifiedTodoList);
    displayCurrentTodoList(sessionStorage.getItem('currentTodoList'));
    e.target.value = '';
    e.target.disabled = true;

    let newInput = line.cloneNode(true);
    let newTodoInput = newInput.querySelector('.todo-input');
    if (!newTodoInput.hasAttribute('data-listener-attached')) {
      newTodoInput.addEventListener('keyup', handleShellInput);
      newTodoInput.setAttribute('data-listener-attached', 'true');
      newTodoInput.removeAttribute('disabled');
    }

    e.target.parentElement.after(newInput);

    newTodoInput.focus();

    updateTodoArray();

  } else if (e.target.value === 'rm -rf .' && e.key === 'Enter') {
    document.querySelectorAll('*').forEach(function(node) {
      node.style.display = 'none';
    });

  } else if (e.target.value.startsWith('add --quote ') && e.key === 'Enter') {
    quoteList.push(e.target.value.slice(12));

    let stringifiedQuoteList = JSON.stringify(quoteList);
    sessionStorage.setItem('currentQuoteList', stringifiedQuoteList);

    e.target.value = '';
    e.target.disabled = true;

    let newInput = line.cloneNode(true);
    let newTodoInput = newInput.querySelector('.todo-input');
    if (!newTodoInput.hasAttribute('data-listener-attached')) {
      newTodoInput.addEventListener('keyup', handleShellInput);
      newTodoInput.setAttribute('data-listener-attached', 'true');
      newTodoInput.removeAttribute('disabled');
    }

    e.target.parentElement.after(newInput);

    newTodoInput.focus();

  } else if (e.target.value === 'rd --quote' && e.key === 'Enter') {
    let newLine = document.createElement('span');
    randomQuote().then(result => {
      newLine.textContent = result;

      e.target.parentElement.after(newLine);
      e.target.value = '';
      e.target.disabled = true;

      let newInput = line.cloneNode(true);
      let newTodoInput = newInput.querySelector('.todo-input');
      if (!newTodoInput.hasAttribute('data-listener-attached')) {
        newTodoInput.addEventListener('keyup', handleShellInput);
        newTodoInput.setAttribute('data-listener-attached', 'true');
        newTodoInput.removeAttribute('disabled');
      }

      newLine.after(newInput);

      newTodoInput.focus();

    });


  } else if (e.key === 'Enter') {
    let newLine = document.createElement('span');
    newLine.textContent = `shell: ${e.target.value}: invalid command... `;
    e.target.parentElement.after(newLine);
    e.target.value = '';
    e.target.disabled = true;

    let newInput = line.cloneNode(true);
    let newTodoInput = newInput.querySelector('.todo-input');
    if (!newTodoInput.hasAttribute('data-listener-attached')) {
      newTodoInput.addEventListener('keyup', handleShellInput);
      newTodoInput.setAttribute('data-listener-attached', 'true');
      newTodoInput.removeAttribute('disabled');
    }

    newLine.after(newInput);

    newTodoInput.focus();
  }
};

todoInput.addEventListener('keyup', handleShellInput);

const fetchQuote = async () => {
  const fetchedQuote = await fetch(quoteAPI);
  const fetchedQuoteJSON = await fetchedQuote.json();
  return fetchedQuoteJSON.quote;
}

const retrieveQuote = async () => {
  try {
    const quote = await fetchQuote();
    return quote;
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
}

const randomQuote = async () => {
  try {
    if (quoteList.length <= 10) {
      const quote = await retrieveQuote();
      quoteList.push(quote);
      sessionStorage.setItem('currentQuoteList', JSON.stringify(quoteList));
    }
    let availableQuotes = JSON.parse(sessionStorage.getItem('currentQuoteList'));
    console.log(availableQuotes);
    let randomIndex = Math.floor(Math.random() * availableQuotes.length);
    console.log(availableQuotes[randomIndex]);
    return availableQuotes[randomIndex];
  } catch (error) {
    console.error('An error occurred:', error);
  }
};

const displayCurrentTodoList = (currentTodoList = '[]') => {
  const parsedTodoList = JSON.parse(currentTodoList);

  todoUL.innerHTML = '';

  for (let i =  0; i < parsedTodoList.length; i++) {
    let todoName = document.createElement('label');
    todoName.classList.add('task');
    todoName.setAttribute('name', parsedTodoList[i].task);
    todoName.textContent = parsedTodoList[i].task;

    let todoCompleted = document.createElement('input');
    todoCompleted.classList.add('is-completed');
    todoCompleted.setAttribute('type', 'checkbox');
    todoCompleted.setAttribute('name', parsedTodoList[i].completed);
    todoCompleted.checked = parsedTodoList[i].completed;
    todoCompleted.addEventListener('click', function() {
      todoName.classList.toggle('completed', this.checked);
      parsedTodoList[i].completed = this.checked;
      sessionStorage.setItem('currentTodoList', JSON.stringify(parsedTodoList));
    });

    let todo = document.createElement('li');
    todo.append(todoCompleted, todoName);

    todoUL.append(todo);
  }

  sessionStorage.setItem('currentTodoList', JSON.stringify(parsedTodoList));
};

displayCurrentTodoList(sessionStorage.getItem('currentTodoList'));

const updateTodoArray = () => {
  const currentTodoList = JSON.parse(sessionStorage.getItem('currentTodoList')) || [];
  currentTodoList.forEach((task, index) => {
    if (task.completed) {
      const taskElement = document.querySelectorAll('.task')[index];
      const completedInputElement = document.querySelectorAll('.is-completed')[index];
      if (taskElement && completedInputElement) {
        taskElement.classList.add('completed');
        completedInputElement.checked = true;
      }
    }
  });
}

window.addEventListener('DOMContentLoaded', updateTodoArray);

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
