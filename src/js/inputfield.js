import { typewriterEffect } from './typewriter.js';
import { twitterAPICall } from './api.js';
import { startStopwatch, stopStopwatch } from './stopwatch.js';

const inputField = document.getElementById("inputField");

inputField.addEventListener("input", () => {
  inputField.style.height = "auto";
  inputField.style.height = `${inputField.scrollHeight}px`;

  const parentDiv = inputField.parentElement.parentElement;
  parentDiv.style.height = `${inputField.scrollHeight}px`;
  parentDiv.style.overflowY = "hidden";

  // Check if the inputField height has reached its maximum height
  if (parseInt(inputField.style.height) >= parseInt(getComputedStyle(inputField).maxHeight)) {
    inputField.style.overflowY = "auto";
  } else {
    inputField.style.overflowY = "hidden";
  }
});


const extractTwitterID = (url) => {
  const regex = /(\d{10,})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const extractUsernames = (url) => {
  const regex = /https?:\/\/twitter\.com\/([a-zA-Z0-9_]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

document.getElementById("clearButton").addEventListener("click", () => {
  inputField.value = "";
  inputField.style.height = "auto";
});

let answerCounter = 0;

document.getElementById("searchButton").addEventListener("click", async () => {
  const textFieldValue = document.getElementById("inputField").value;
  const twitterID = extractTwitterID(textFieldValue);
  const username = extractUsernames(textFieldValue);

  if (!textFieldValue) {
    console.error('Error: No link or text found.');
    return;
  }

  if ((textFieldValue.startsWith('http://') || textFieldValue.startsWith('https://')) && (!twitterID || !username)) {
    console.error('Error: The link is not a valid Twitter link.');
    return;
  }


  // Increase the answer counter
  answerCounter++;

  // Create a new div with an increasing name="answer-number" attribute
  const newDiv = document.createElement("div");
  newDiv.setAttribute("name", `answer-${answerCounter}`);
  newDiv.setAttribute("class", `self-center`);
  newDiv.innerHTML = `
    <div class="indicator">
      <span id="stopwatch" class="indicator-item badge badge-secondary">00:00:000</span>
      <div class="rounded-lg">
        <div tabindex="0" class="collapse collapse-arrow border border-base-300 bg-primary rounded-box mt-2">
          <div id="inputSection" class="collapse-title text-xl font-medium">
            Focus me to see content <span>${textFieldValue}</span>
          </div>
          <div id="outputSection" class="collapse-content">
            <span id="outputContent">tabindex="0" attribute is necessary to make the div focusable</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append the separator and the new div to the container
  const container = document.querySelector('[role="Answers"]');
  container.prepend(newDiv);
  inputField.value = "";
  inputField.style.height = "auto";
  const stopwatchElement = newDiv.querySelector("#stopwatch");
  startStopwatch(stopwatchElement)
  if (twitterID && username) {
    const twitterData = await twitterAPICall(username, twitterID);
    stopStopwatch();
    const myOutput = JSON.stringify(twitterData, null, 2);
    typewriterEffect(newDiv.querySelector("#outputContent"), myOutput);
  } else {
    //const apiData = await CallAPI(textFieldValue);
    //newDiv.querySelector("#outputSection").innerHTML = JSON.stringify(apiData, null, 2);
    typewriterEffect(newDiv.querySelector("#outputContent"), "test");
    stopStopwatch();
  }
});

//<div>
//<div class="row">
//  <div>
//    <h6>OUTPUT</h6>
//  </div>
//  <div class="row align_self_center">
//    <span>Working:</span>
//    <div id="stopwatch" class="stopwatch-format">00:00:000</div>
//  </div>
//</div>
//<div id="outputSection">
//  <span id="outputContent"></span>
//</div>
//</div>