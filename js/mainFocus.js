const mainFocusInput = document.querySelector('input[name="main-focus-input"]');
const mainFocusOutput_Checkbox = document.querySelector('input[name="main-focus-checkbox"]');
const mainFocusOutput_Label = document.querySelector('.main-focus-label');
const mainFocusOutput_Edit = document.querySelector('.edit');
const mainFocusContainer = document.querySelector('.main-focus-container');
const message = document.querySelector('.message');

const handleMainFocusKeyPress = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    storeMainFocusInput();
  }
}

const storeMainFocusInput = () => {
  sessionStorage.setItem('mainFocus', mainFocusInput.value);
  updateMainFocus();
}

const loadMainFocus = () => {
  return sessionStorage.getItem('mainFocus');
}

const updateMainFocus = () => {
  const currentMainFocus = loadMainFocus();
  console.log(currentMainFocus);

  if (currentMainFocus) {
    hideMainFocusInput();
    showMainFocusOutput();
    updateMainFocusOutput(currentMainFocus);
  } else {
    showMainFocusInput();
    hideMainFocusOutput();
    mainFocusOutput_Checkbox.checked = false;
    completedMainFocus(null);
  }
}

const hideMainFocusInput = () => {
  mainFocusInput.classList.remove('show');
  mainFocusInput.classList.add('hide');
}

const showMainFocusInput = () => {
  mainFocusInput.classList.remove('hide');
  mainFocusInput.classList.add('show');
}

const showMainFocusOutput = () => {
  mainFocusOutput_Checkbox.classList.remove('hide');
  mainFocusOutput_Checkbox.classList.add('show');
  mainFocusOutput_Label.classList.remove('hide');
  mainFocusOutput_Label.classList.add('show');
  mainFocusOutput_Edit.classList.remove('hidden');
}

const hideMainFocusOutput = () => {
  mainFocusOutput_Checkbox.classList.remove('show');
  mainFocusOutput_Checkbox.classList.add('hide');
  mainFocusOutput_Label.classList.remove('show');
  mainFocusOutput_Label.classList.add('hide');
  mainFocusOutput_Edit.classList.add('hidden');
}

const updateMainFocusOutput = (mainFocus) => {
  mainFocusOutput_Checkbox.value = mainFocus;
  mainFocusOutput_Label.htmlFor = mainFocus;
  mainFocusOutput_Label.textContent = mainFocus;
}

mainFocusInput.addEventListener('keyup', handleMainFocusKeyPress);

const completedMainFocus = (e) => {
  sessionStorage.setItem('mainFocusCompleted', mainFocusOutput_Checkbox.checked);
  const isMainFocusCompleted = sessionStorage.getItem('mainFocusCompleted');

  if (isMainFocusCompleted === 'true') {
    mainFocusOutput_Label.classList.toggle('completed');
    mainFocusOutput_Checkbox.classList.toggle('hide');
    message.textContent = 'wow. good job,';
  } else if (e === null) {
    mainFocusOutput_Label.classList.remove('completed');
    message.textContent = 'hi,';
  }
}

mainFocusOutput_Checkbox.addEventListener('click', completedMainFocus);

const editMainFocus = (e) => {
  mainFocusInput.value = null;
  sessionStorage.setItem('mainFocus', mainFocusInput.value);
  console.log(sessionStorage.getItem('mainFocus'));
  updateMainFocus();
}

mainFocusOutput_Edit.addEventListener('click', editMainFocus);

document.addEventListener('DOMContentLoaded', completedMainFocus);
updateMainFocus();
