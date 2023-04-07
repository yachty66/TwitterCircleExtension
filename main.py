from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"*": {"origins": "*"}})

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
from urllib.parse import urlparse
import requests
from bs4 import BeautifulSoup

def get_twitter_circle_image(username):
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920x1080")
    chrome_options.binary_location = "/Applications/AppicationsMe/Google Chrome.app/Contents/MacOS/Google Chrome"
    driver = webdriver.Chrome(executable_path='/Users/maxhager/Applications/AppicationsMe/chromedriver_mac_arm64/chromedriver', options=chrome_options)
    driver.get("https://twittercircle.com/")

    # Insert the username and generate the Twitter Circle
    username_input = driver.find_element(By.XPATH, '//*[@id="username"]')
    username_input.clear()
    username_input.send_keys(username)
    driver.find_element(By.XPATH, '//*[@id="generate"]').click()

    # Wait for the image to be displayed
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, '//*[@id="saveImage"]'))
    )

    save_image_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, '//*[@id="saveImage"]'))
    )

    # Click the save image button using JavaScript
    driver.execute_script("arguments[0].click();", save_image_button)

    # Wait for the canvas to be ready
    WebDriverWait(driver, 20).until(
        EC.presence_of_element_located((By.XPATH, '//*[@id="canvasArea"]/canvas'))
    )

    # Get the base64 image data from the canvas
    image_data = driver.execute_script("""
        const canvas = document.querySelector('#canvasArea > canvas');
        return canvas.toDataURL('image/png');
    """)

    return image_data
    

@app.route('/twitter_circle', methods=['POST'])
def generate_twitter_circle():
    data = request.get_json()
    username = data.get('username', None)
    message = data.get('message', None)

    if not username and not message:
        return jsonify({"error": "Neither username nor message provided"}), 400

    if username:
        image_data = get_twitter_circle_image(username)
        return jsonify({"image_data": image_data})
    elif message:
        # Handle the 'message' field if needed
        pass

if __name__ == '__main__':
    app.run(debug=True)
