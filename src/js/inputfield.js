import { typewriterEffect } from './typewriter.js';
import { twitterCall, textAPICall, twitterAPICall } from './api.js';
import { startStopwatch, stopStopwatch } from './stopwatch.js';
import { myResponse } from "./response.js";

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

document.getElementById("clearButton").addEventListener("click",async () => {
  inputField.value = "";
  inputField.style.height = "auto";
});

let answerCounter = 0;

async function performSearch() {
  const textFieldValue = document.getElementById("inputField").value;
  const twitterID = extractTwitterID(textFieldValue);
  const username = extractUsernames(textFieldValue);

  // const myOutput = JSON.stringify(myResponse);
  // console.log(myOutput)

  if (!textFieldValue) {
    console.warn('Error: No link or text found.');
    return;
  }

  if ((textFieldValue.startsWith('http://') || textFieldValue.startsWith('https://')) && (!twitterID || !username)) {
    console.warn('Error: The link is not a valid Twitter link.');
    return;
  }
  if(!(textFieldValue.startsWith('http://') || textFieldValue.startsWith('https://'))) {
    const words = textFieldValue.split(' ');
    if (words.length <= 5) {
      console.warn('Error: The text must contain at least 5 words.');
      return;
    }
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
                <input type="checkbox" checked/>
                <div id="inputSection" class="collapse-title text-xl font-semibold">
                  ${textFieldValue}
                </div>
                <div id="outputSection" class="collapse-content">
                  <!-- </br>  -->
                  <span id="outputContent">Working ...</span>
                </div>
            </div>
        </div>
    </div>
    <div id="hiddenText" class="invisible h-0">Working ... ${textFieldValue}</div>

  `;

  function addLabel(label) {
    const labeldiv = document.createElement("div")
    if (label == "half-true") {
      labeldiv.setAttribute("class", "badge badge-accent mb-5")
    } if (label == "true") {
      labeldiv.setAttribute("class", "badge badge-success mb-5")
    } if (label == "not-enough-information") {
      labeldiv.setAttribute("class", "badge badge-warning mb-5")
    } if (label == "false") {
      labeldiv.setAttribute("class", "badge badge-error mb-5")
    }
    console.log(label)
    let replacedlabel = label.replace(/[-]/g, function(match) {
      switch (match) {
        case "-":
          return " ";
      }
    });
    labeldiv.innerHTML = replacedlabel;
    newDiv.querySelector('#outputSection').prepend(labeldiv)
  }

  // Append the separator and the new div to the container
  const container = document.querySelector('[role="Answers"]');
  container.prepend(newDiv);
  inputField.value = "";
  inputField.style.height = "auto";
  const stopwatchElement = newDiv.querySelector("#stopwatch");
  startStopwatch(stopwatchElement)

  if (twitterID && username) { 
    const myJson = await twitterAPICall(username, twitterID);

    var data = JSON.parse(myJson);
    stopStopwatch();
    var contentString = data.content;
    var labelString = data.label;
    addLabel(labelString)
    typewriterEffect(newDiv.querySelector("#outputContent"), contentString);
  } else {
    let replacedString = textFieldValue.replace(/[äöüÄÖÜß]/g, function(match) {
      switch (match) {
        case "ä":
          return "ae";
        case "ö":
          return "oe";
        case "ü":
          return "ue";
        case "Ä":
          return "Ae";
        case "Ö":
          return "Oe";
        case "Ü":
          return "Ue";
        case "ß":
          return "ss";
      }
    });
    console.log(replacedString)
    const myOutput = await textAPICall(replacedString);
    console.log('myOutput :>> ', myOutput);
    var data = JSON.parse(myOutput);
    stopStopwatch();
    var contentString = data.content;
    var labelString = data.label;
    // addLabel(labelString)
    typewriterEffect(newDiv.querySelector("#outputContent"), contentString);

  }
}

document.getElementById("searchButton").addEventListener("click", async () => {
  performSearch();
});

document.addEventListener('DOMContentLoaded', function() {
  const footer = document.querySelector('footer');
  let lastScrollTop = 0;

  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > lastScrollTop) {
      footer.classList.add('hidden');
    } else {
      footer.classList.remove('hidden');
    }
    lastScrollTop = scrollTop;
  });
});

const textarea = document.querySelector('#inputField'); // Replace 'textarea' with the appropriate selector for your textarea element

textarea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    performSearch();
  }
});
