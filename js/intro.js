// select the username input element
const usernameInput = document.querySelector('input[name="username"]');

// handle key press in the username input field
const handleUsernameKeyPress = (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    storeUsernameAndUpdatePage();
  }
}

// store the username in the session storage
const storeUsernameAndUpdatePage = () => {
  sessionStorage.setItem('username', usernameInput.value);
  updateVisibility();
}

// load the username from the session storage
const loadUser = () => {
  return sessionStorage.getItem('username');
}

// update the visibility of elements based on whether a user is logged in
const updateVisibility = () => {
  const currentUser = loadUser();

  if (currentUser) {
    hideIntroSection();
    showAppInterface();
    updateNameText(currentUser);
  }
}

// hide the intro section
const hideIntroSection = () => {
  const introSection = document.querySelector('.intro');
  introSection.classList.remove('show');
  introSection.classList.add('hide');
}

// show the app interface
const showAppInterface = () => {
  const appInterfaceElements = document.querySelectorAll('.app-interface');
  appInterfaceElements.forEach((element) => {
    element.classList.remove('hide');
    element.classList.add('show');
  });
}

// update the name text with the current user's name
const updateNameText = (username) => {
  const names = document.querySelectorAll('.name');
  names.forEach((nameElement) => {
    nameElement.textContent = `${username}`;
  });
};

// register the event listener
usernameInput.addEventListener('keyup', handleUsernameKeyPress);

// update the page initially
updateVisibility();
