import { typewriterEffect } from './functions.js';
//import { textAPICall, twitterAPICall } from "./api.js";

const inputField = document.getElementById("inputField");

inputField.addEventListener("input", () => {
  inputField.style.height = "auto";
  inputField.style.height = `${inputField.scrollHeight}px`;

  // Check if the textarea height has reached its maximum height
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
    <div class="top_seperator"></div>
    <div>  
      <h2>INPUT</h2>
      <div id="inputSection">${textFieldValue}</div>
    </div>
    <div>
      <h2>OUTPUT</h2>
      <div id="outputSection"></div>
    </div>
  `;
  // Append the separator and the new div to the container
  const container = document.querySelector('[role="content"]');
  container.prepend(newDiv);
  inputField.value = "";
  inputField.style.height = "auto";
  if (twitterID && username) {
    //const twitterData = await twitterAPICall(username, twitterID);
    //newDiv.querySelector("#outputSection").innerHTML = JSON.stringify(twitterData, null, 2);
    myString = "twitter api call asdas das asd asd asd asd asd asd as das dasd asd asd sdasdas da"
    typewriterEffect(newDiv.querySelector("#outputSection"), myString)
  } else {
    //const apiData = await CallAPI(textFieldValue);
    //newDiv.querySelector("#outputSection").innerHTML = JSON.stringify(apiData, null, 2);
    typewriterEffect(newDiv.querySelector("#outputSection"), "After examining the provided information, \n it is clear that the claim stating the actions of Tennessee state legislators who protested against gun violence were at least equivalent to the actions of the January 6 insurrectionists is not supported by the evidence. According to NPR, Tennessee House Speaker Cameron Sexton compared the gun control protest to the January 6 insurrection, suggesting they were at least equivalent, maybe worse depending on how you look at it. However, this comparison has been widely criticized as inappropriate and inaccurate. The evidence reveals that the gun control protest in Tennessee was peaceful and did not involve violence or property destruction, in stark contrast to the January 6 insurrection at the U.S. Capitol. The January 6 event resulted in multiple deaths and caused significant damage to the Capitol building. Considering the available evidence, it is evident that the claim lacks validity. The actions of the Tennessee state legislators who protested against gun violence cannot be deemed at least equivalent to the actions of the January 6 insurrectionists.")
  }
});
