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
  
  const callScraper = async (tweetName, tweetID) => {
    const controller = new AbortController();
    const timeoutDuration = 1000000;
    //const { local_url } = require("./config");
    const { api_url } = require("./config");
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);
  
    try {
      const response = await fetch(api_url + tweetName + "/" + tweetID, {
        method: "POST",
        signal: controller.signal
      });
      const myJson = await response.json();
      clearTimeout(timeoutId);
      return myJson;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('Request timed out');
      } else {
        console.error('Request failed', error);
      }
    }
  };
  
  async function pruefeLinkOderText() {
    const textEingabe = document.getElementById('texteingabe').value;
    const ergebnisFeld = document.getElementById('ergebnis');
    const linkRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
  
    if (linkRegex.test(textEingabe)) {
      ergebnisFeld.innerHTML = 'started';
      let tweetID = extractTwitterID(textEingabe);
      let tweetName = extractUsernames(textEingabe);
      if (tweetID && tweetName) {
        const apiResult = await callScraper(tweetName, tweetID);
        ergebnisFeld.innerHTML = JSON.stringify(apiResult);
      } else {
        ergebnisFeld.innerHTML = 'Ungültiger Twitter-Link';
      }
    } else {
      ergebnisFeld.innerHTML = 'Funktion für Text ausgeführt';
    }
  }
  