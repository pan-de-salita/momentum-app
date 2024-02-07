const time = document.querySelector('.time');
let intervalId = null;

// display current time depending on interval
const showTime = () => {
  refreshTime();

  if (intervalId !== null) {
    // using clearInterval to prevent unnecessary computations and memory usage
    clearInterval(intervalId);
  } else {
    intervalId = setInterval(refreshTime, 1000);
  }
}

// refresh time
const refreshTime = () => {
  let currentTime = new Date();
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let seconds = currentTime.getSeconds();
  let formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;

  time.textContent = formattedTime;
}

showTime();
