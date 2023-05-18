import { typewriterEffect } from './typewriter.js';
import { textAPICall, twitterAPICall } from './api.js';
import { startStopwatch, stopStopwatch } from './stopwatch.js';

const inputField = document.getElementById("inputField");

inputField.addEventListener("input", () => {
  inputField.style.height = "auto";
  inputField.style.height = `${inputField.scrollHeight}px`;

  const parentDiv = inputField.parentElement.parentElement;
  parentDiv.style.height = `${inputField.scrollHeight + 6}px`;
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
  newDiv.innerHTML = `
                    <div class="indicator mt-5 w-full">
                        <div id="stopwatch" class="indicator-item badge badge-accent font-semibold">00:00</div>
                        <div class="rounded-lg w-full">
                            <div class="collapse border border-base-300 bg-primary rounded-box">
                                <input type="checkbox" />
                                <div id="inputSection" class="collapse-title text-xl font-semibold">
                                  ${textFieldValue}
                                </div>
                                <div id="outputSection" class="collapse-content">
                                    <span id="outputContent">Working ...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="hiddenText" class="invisible h-0">Working ... ${textFieldValue}</div>

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
    console.log('twitterData :>> ', twitterData);
    stopStopwatch();
    const myOutput = JSON.stringify(twitterData, null, 2);
    typewriterEffect(newDiv.querySelector("#outputContent"), myOutput);
  } else {
    const myOutput = await textAPICall(textFieldValue);
    console.log('myOutput :>> ', myOutput);
    var data = JSON.parse(myOutput);
    stopStopwatch();
    var contentString = data.content;
    typewriterEffect(newDiv.querySelector("#outputContent"), contentString);

  }
});


//// Get the necessary elements
//const collapseArrow = document.querySelector('.collapse');
//const inputSection = document.getElementById('inputSection');
//const hiddenText = document.getElementById('hiddenText');

//// Add a click event listener to the collapse arrow
//collapseArrow.addEventListener('click', function () {
//  // Check if the checkbox is checked

//  const currentText = inputSection.textContent;
//  const hiddenTextContent = hiddenText.textContent;

//  inputSection.textContent = hiddenTextContent;
//  hiddenText.textContent = currentText;

//});


