function addButton() {
    const targetElements = document.querySelectorAll('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0');

    targetElements.forEach((element) => {
        if (!element.textContent.includes('Joined')) return;

        const parentElement = element.parentElement;

        // Check if the entire document already contains the 'hello-world-btn' button
        const existingButton = document.querySelector('.hello-world-btn');
        if (existingButton) return;

        const button = document.createElement('button');
        button.innerText = 'Hello';
        button.style.marginLeft = '8px';
        button.classList.add('hello-world-btn');
        button.addEventListener('click', () => {
            sendHelloWorld();
            alert('Hello, World!');
        });

        parentElement.appendChild(button);
    });
}


function sendHelloWorld() {
    console.log('Sending message to server...');
    const url = 'http://127.0.0.1:5000/test'; // Replace this with your server's endpoint

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message: 'Hello, World!',
        }),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Request failed: ' + response.status);
            }
        })
        .then((data) => {
            console.log('Message sent successfully:', data);
        })
        .catch((error) => {
            console.error('Error sending message:', error);
        });
}



// Run the function when the page loads
addButton();

// Run the function when the page updates (e.g., after scrolling or navigation)
const observer = new MutationObserver(addButton);
observer.observe(document.body, { childList: true, subtree: true });
