import { api_url } from "./config.js";
const controller = new AbortController();
const timeoutDuration = 1000000;
const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

export const twitterAPICall = async (tweet_name, tweet_id) => {
  console.log('tweet_name :>> ', tweet_name);
  console.log('tweet_id :>> ', tweet_id);
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