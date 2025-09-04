from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import tweepy
import datetime
import os

# -----------------------
# 1️⃣ Twitter API credentials
# -----------------------
# Either replace with your keys here, or set them as environment variables
CONSUMER_KEY = os.getenv("CONSUMER_KEY", "your_consumer_key")
CONSUMER_SECRET = os.getenv("CONSUMER_SECRET", "your_consumer_secret")
ACCESS_TOKEN = os.getenv("ACCESS_TOKEN", "your_access_token")
ACCESS_TOKEN_SECRET = os.getenv("ACCESS_TOKEN_SECRET", "your_access_token_secret")

# -----------------------
# 2️⃣ Take screenshot
# -----------------------
options = webdriver.ChromeOptions()
options.add_argument("--headless")  # run without opening a window
options.add_argument("--window-size=1200,800")

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
driver.get("https://www.cubistheart.com/today")

today = datetime.date.today().strftime("%Y-%m-%d")
filename = f"cubistheart_{today}.png"
driver.save_screenshot(filename)
driver.quit()
print(f"✅ Screenshot saved: {filename}")

# -----------------------
# 3️⃣ Post to Twitter/X
# -----------------------
auth = tweepy.OAuth1UserHandler(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
api = tweepy.API(auth)

tweet_text = f"Today's Cubist Heart artwork: {today}"
api.update_status_with_media(status=tweet_text, filename=filename)
print("✅ Posted to Twitter!")
