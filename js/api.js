const controller = new AbortController();
const timeoutDuration = 1000000;
//const { local_url } = require("./config");
const { api_url } = require("./config");
const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

export const twitterAPICall = async (tweet_name, tweet_id) => {
    try {
        const response = await fetch(api_url + tweet_name + "/" + tweet_id, {
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
}
  

export const textAPICall = async (textFieldValue) => {
    try {
        const response = await fetch(api_url + textFieldValue, { //TODO
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
}