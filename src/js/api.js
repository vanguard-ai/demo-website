import { api_url } from "./config.js";
import { c_url } from "./config.js";
import { local_url } from "./config.js";
const controller = new AbortController();
const timeoutDuration = 1000000;
const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

export const twitterAPICall = async (tweet_name, tweet_id) => {
  console.log('tweet_name :>> ', tweet_name);
  console.log('tweet_id :>> ', tweet_id);
  try {
    const response = await fetch(api_url + tweet_name + "/" + tweet_id, {
      method: "GET",
      signal: controller.signal
    });
    const myJson = await response.json();
    // const myJson = my2Response;
    clearTimeout(timeoutId);
    console.log('myJson :>> ', myJson);
    var data = JSON.stringify(myJson);
    console.log('data :>> ', data);

    var tweetText = myJson["firstcomment"];
    var tweetcomments = myJson["data"];
    console.log('tweetdata :>>', tweetcomments);
    console.log('text :>>', tweetText);

    const myJson2 = await twitterCall(tweetText, tweetcomments)
    console.log(myJson2)
    return myJson2;

  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Request timed out');
    } else {
      console.error('Request failed', error);
    }
  }
}

export const twitterCall = async (text, data) => {
  try {
    console.log("BREAK")
    console.log(text)
    console.log(data)
    console.log("BREAK URL:")
    console.log(c_url + text + "/" + data)
    const response2 = await fetch(c_url + text + "/" + data, {
      method: "GET",
      signal: controller.signal
    });
    console.log('response2 :>> ', response2);
    const myJson2 = await response2.json();
    const stringJson = JSON.stringify(myJson2);
    console.log('myJson2 :>> ', myJson2);
    return stringJson
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
    const stringJson = JSON.stringify(myJson);
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