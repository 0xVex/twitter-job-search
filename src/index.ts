import { bearer } from '../keys';
import { Client } from 'twitter-api-sdk';

const client = new Client(bearer);
const urlRegex = /https:\/\/t.co\/.{10}/g;
const companyRegex = /(\w+ )?\w+ is hiring/g;
let hiringList: any = {};

const getTweets = async () => {
    const response = await client.tweets.tweetsRecentSearch({
        "query": "Hiring security remote engineer",
        "max_results": 100,
    })
    return response;
}

const parser = (data: any) => {
    let tweet;
    for (tweet of data.data) {
        let url = JSON.stringify(tweet).match(urlRegex);
        let company = JSON.stringify(tweet).match(companyRegex);
        if (company && url) {
            try {
                hiringList[company[0]] = url[0];
            }
            catch(err) {
                console.error(err);
            }
        }
    }
    return hiringList;
}

const main = async () => {
    let tweets = await getTweets()
    let list = parser(tweets);
    console.log(list);
}

main();
