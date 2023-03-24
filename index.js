const checkForKey = () => {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(["openai-key"], (result) => {
        resolve(result["openai-key"]);
      });
    });
  };

function saveKey() {
    const input = document.getElementById("key-input")

    if (input) {
        const { value } = input;

        //encoded string
        const encodedValue = btoa(value)

        //save to google storage
        chrome.storage.local.set({ "openai-key": encodedValue }, () => {
            document.getElementById("require-key").style.display = "none";
            document.getElementById("key-entered").style.display = "block"
        })
    }
}

function changeKey() {
    document.getElementById("require-key").style.display = "block"
    document.getElementById("key-entered").style.display = "none"
}

document.getElementById("save-key").addEventListener("click", saveKey)
document.getElementById("change-key").addEventListener("click", changeKey)

checkForKey().then((response) => {
    if (response) {
        document.getElementById("require-key").style.display = "none"
        document.getElementById("key-entered").style.display = "block"
    }
})