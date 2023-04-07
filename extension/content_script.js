function addButton() {
    const targetElements = document.querySelectorAll('.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0');
    targetElements.forEach((element) => {
        if (!element.textContent.includes('Joined')) return;

        const parentElement = element.parentElement;

        // Check if the entire document already contains the 'hello-world-btn' button
        const existingButton = document.querySelector('.hello-world-btn');
        if (existingButton) return;

        const button = document.createElement('button');
        button.innerText = 'Show Twitter Circle';
        button.style.marginLeft = '8px';
        button.classList.add('hello-world-btn');
        button.addEventListener('click', () => {
            sendHelloWorld();
        });

        parentElement.appendChild(button);
    });
}

function getTwitterUsername() {
    const usernameElement = document.querySelector('.css-901oao.css-1hf3ou5.r-18u37iz.r-37j5jr.r-1wvb978.r-a023e6.r-16dba41.r-rjixqe.r-bcqeeo.r-qvutc0');
    if (usernameElement) {
        return usernameElement.textContent.replace('@', '').trim();
    } else {
        console.error('Unable to find the Twitter username element.');
        return null;
    }
}


function sendHelloWorld() {
    const username = getTwitterUsername();
    if (!username) {
        console.error('Error: Could not find the Twitter username.');
        return;
    }

    displayLoading();

    console.log('Sending message to server...');
    const url = 'http://127.0.0.1:5000/twitter_circle'; // Replace this with your server's endpoint

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
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
            console.log('Image data received:', data.image_data);
            displayTwitterCircleImage(data.image_data);
            hideLoading();
        })
        .catch((error) => {
            console.error('Error sending message:', error);
            hideLoading();
        });
}

function displayImage(imageData) {
    const existingImage = document.querySelector('.twitter-circle-image');
    if (existingImage) return;

    const image = document.createElement('img');
    image.src = imageData;
    image.classList.add('twitter-circle-image');
    image.style.position = 'fixed';
    image.style.top = '50%';
    image.style.left = '50%';
    image.style.transform = 'translate(-50%, -50%)';
    image.style.zIndex = '10000'; // Increase the zIndex value

    document.body.appendChild(image);
}



function displayLoading() {
    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'twitter-circle-loading-overlay';
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = 0;
    loadingOverlay.style.left = 0;
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    loadingOverlay.style.zIndex = 9999;
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';

    const loadingText = document.createElement('span');
    loadingText.style.color = 'white';
    loadingText.style.fontSize = '24px';
    loadingText.textContent = 'Loading...';

    loadingOverlay.appendChild(loadingText);
    document.body.appendChild(loadingOverlay);
}

function hideLoading() {
    const loadingOverlay = document.getElementById('twitter-circle-loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.remove();
    }
}

function hideTwitterCircleImage() {
    const imageOverlay = document.getElementById('twitter-circle-image-overlay');
    if (imageOverlay) {
        imageOverlay.remove();
    }
}


function displayTwitterCircleImage(imageData) {
    const imageOverlay = document.createElement('div');
    imageOverlay.id = 'twitter-circle-image-overlay';
    imageOverlay.style.position = 'fixed';
    imageOverlay.style.top = 0;
    imageOverlay.style.left = 0;
    imageOverlay.style.width = '100%';
    imageOverlay.style.height = '100%';
    imageOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    imageOverlay.style.zIndex = 9999;
    imageOverlay.style.display = 'flex';
    imageOverlay.style.flexDirection = 'column';
    imageOverlay.style.justifyContent = 'center';
    imageOverlay.style.alignItems = 'center';

    const circleImage = document.createElement('img');
    circleImage.src = imageData;
    circleImage.style.maxWidth = '80%';
    circleImage.style.maxHeight = '80%';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.marginTop = '16px';
    cancelButton.addEventListener('click', () => {
        hideTwitterCircleImage();
    });

    imageOverlay.appendChild(circleImage);
    imageOverlay.appendChild(cancelButton);
    document.body.appendChild(imageOverlay);
}



// Run the function when the page loads
addButton();

// Run the function when the page updates (e.g., after scrolling or navigation)
const observer = new MutationObserver(addButton);
observer.observe(document.body, { childList: true, subtree: true });
