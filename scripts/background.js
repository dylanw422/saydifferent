const getKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(["openai-key"], (result) => {
            if (result["openai-key"]) {
                const decodedKey = atob(result["openai-key"])
                resolve(decodedKey)
            }
        })
    })
}

const sendMessage = (content) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0].id

        chrome.tabs.sendMessage(
            activeTab,
            { message: "inject", content: content }
        )
    })
}

async function generate(prompt) {
    const key = await getKey()
    const url = "https://api.openai.com/v1/completions"

    const completionRes = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: "text-davinci-003",
            prompt: prompt,
            max_tokens: 1250,
            temperature: 0.7,
        })
    })

    const completion = await completionRes.json()
    return completion.choices.pop()
    
}

async function generateCompletion(info) {
    try {
        const { selectionText } = info
        const basePromptPrefix = `List a few different ways of saying the following phrase (or combination of phrases). Make sure that the results are about the same length as the input, and mean the same thing, in the same context. Treat the answers like you're a thesaurus and you're finding synonyms but for phrases.
        Input: `

        const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`)
        console.log(baseCompletion.text)
        sendMessage('Here are a few different ways to say the selected text: ' + baseCompletion.text)
    } catch (error) {
        console.log(error)
        sendMessage(error.toString())
    }
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "context-run",
        title: "say different",
        contexts: ["selection"]
    })
})

chrome.contextMenus.onClicked.addListener(generateCompletion)