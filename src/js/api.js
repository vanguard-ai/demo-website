import { api_url } from "./config.js";
import { c_url } from "./config.js";
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
    console.log('myJson :>> ', myJson);
    var data = JSON.parse(myJson);
    console.log('data :>> ', data);

    const firstItem = data[0];
    const restItems = data.slice(1);

    console.log("First item :>>", firstItem);
    console.log("Rest items :>>", restItems);

    var encodedString1 = btoa(firstItem);
    console.log('encodedString :>> ', encodedString1);
    var encodedString2 = btoa(restItems);
    console.log('encodedString :>> ', encodedString2);

    const response2 = await fetch(c_url + firstItem + "/" + restItems, {
      method: "GET",
      signal: controller.signal
    });
    console.log('response :>> ', response);
    const myJson2 = await response2.json();
    var data2 = JSON.stringify(myJson2);
    console.log('data2 :>> ', data2);
    return data2;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out');
    } else {
      console.error('Request failed', error);
    }
  }
}


export const textAPICall = async (textFieldValue) => {

  var encodedString = btoa(textFieldValue);
  console.log('encodedString :>> ', encodedString);
  try {
    const response = await fetch(c_url + encodedString + "/" + encodedString, {
      method: "GET",
      signal: controller.signal
    });
    console.log('response :>> ', response);
    const myJson = await response.json();
    clearTimeout(timeoutId);
    const stringJson = JSON.stringify(myJson)
    console.log('myJson :>> ', myJson);
    return stringJson;
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out');
    } else {
      console.error('Request failed', error);
    }
  }
}