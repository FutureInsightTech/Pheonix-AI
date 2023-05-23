//  Version 1.0.7: HTML Version 1.0.7
const submit = document.getElementById("submit");
const userInput = document.getElementById("user-input");
const chatHistory = document.getElementById("chat-history");
const loading = document.getElementById("spinner");

let promptResponses = [];

// Function to format code snippets
const formatCodeSnippet = (code) => {
    return `<pre><code>${code}</code></pre>`;
}

const generateResponse = async () => {
    loading.classList.remove("visually-hidden");
    submit.classList.add("visually-hidden");
    const input = userInput.value;
    const isCodeSnippet = input.startsWith("// Code snippet example");

    let response;
    if (isCodeSnippet) {
        response = formatCodeSnippet(input);
    } else {
        const apiResponse = await fetch('/chat', {
            method: 'POST',
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ "role": "user", "content": input }],
                temp: 0.6
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const responseData = await apiResponse.json();
        response = responseData.result[0].message.content;
    }

    promptResponses.push({ question: input, response });
    userInput.value = "";

    const historyElement = document.createElement('li');
    historyElement.classList.add("list-group-item", "message");
    historyElement.innerHTML = `
        <div class="user-message">${formatCodeSnippet(input)}</div>
        <div class="bot-message">${isCodeSnippet ? response : formatCodeSnippet(response)}</div>
    `;
    chatHistory.appendChild(historyElement);

    loading.classList.add("visually-hidden");
    submit.classList.remove("visually-hidden");
}

submit.onclick = generateResponse;