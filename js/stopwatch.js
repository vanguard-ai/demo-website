function timeToString(time) {
  let diffInHrs = time / 3600000;
  let hh = Math.floor(diffInHrs);
  let diffInMin = (diffInHrs - hh) * 60;
  let mm = Math.floor(diffInMin);
  let diffInSec = (diffInMin - mm) * 60;
  let ss = Math.floor(diffInSec);
  let ms = time % 1000;

  let formattedMM = mm.toString().padStart(2, "0");
  let formattedSS = ss.toString().padStart(2, "0");
  let formattedMS = ms.toString().padStart(3, "0");

  return `${formattedMM}:${formattedSS}:${formattedMS}`;
}


let stopwatchInterval;

export function startStopwatch(stopwatchElement) {
  let startTime = Date.now();
  stopwatchInterval = setInterval(() => {
    let elapsedTime = Date.now() - startTime;
    stopwatchElement.innerHTML = timeToString(elapsedTime);
  }, 10);
}

export function stopStopwatch() {
  clearInterval(stopwatchInterval);
}
