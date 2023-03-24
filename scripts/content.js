function insert(content) {
    console.log(content)
    let x = 0
    let y = 0

    const getMouseXY = (e) => {
        x = e.pageX;
        y = e.pageY;

        tooltip.style.top = `${y}px`;
        tooltip.style.left = `${x}px`;

        return true;
    };

    const clear = (e) => {
        if (tooltip.innerText) {
            tooltip.style.display = "none"
        } else {
            tooltip.style.display = "block"
        }
    }

    document.addEventListener("mousemove", getMouseXY)
    document.addEventListener("click", clear)

    const tooltip = document.createElement("div")
    tooltip.style.display = "block"
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = "rgb(254,200,0)";
    tooltip.style.color = "black";
    tooltip.style.padding = "20px";
    tooltip.style.borderRadius = "5px";
    tooltip.innerText = content
    document.body.appendChild(tooltip)

    return true
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'inject') {
        const { content } = request;

        const result = insert(content)

        if (!result) {
            sendResponse({ status: "failed" })
        }

        sendResponse({ status: "success" })
    }
})
