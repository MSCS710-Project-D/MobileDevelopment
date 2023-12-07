import fetch from 'node-fetch';

const DIALOGFLOW_ENDPOINT = ''; // Replace with your Dialogflow endpoint
const DIALOGFLOW_TOKEN = ''; // Replace with your Dialogflow token

export const sendMessageToDialogflow = async (message) => {
    const response = await fetch(DIALOGFLOW_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${DIALOGFLOW_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            queryInput: {
                text: {
                    text: message,
                    languageCode: 'en-US'
                }
            }
        })
    });

    const data = await response.json();
    return data.queryResult.fulfillmentText;
};
