//  Dependencies: express, path, openai, dotenv
const openai = require('openai');
require('dotenv').config();
const express = require('express');
const path = require('path');

// Initializing the express app
const app = express();
// Port 
const port = 1313 || process.env.PORT;

//  Json Parser
app.use(express.json());
// Public Directory
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));

app.use(express.urlencoded({ extended: false }));

//Configure OpenAI
const configuration = new openai.Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_API_KEY,
});

const openaiapi = new openai.OpenAIApi(configuration);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

  
// Calling the /chat route and passing data to the server
app.post('/chat', async (req, res) => {
    const messages = req.body.messages;
    const model = req.body.model;
    const temp = req.body.temp;

    const completion = await openaiapi.createChatCompletion({
        model: model,
        messages: messages,
        temperature: temp,
    });
    res.status(200).json({ result: completion.data.choices });
});

// Running the server on PORT 1313
app.listen(port, () => {
    console.log(`Pheonix AI is Running on PORT: ${port}`);
});