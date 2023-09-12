from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.action_chains import ActionChains
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import sys
import time

# Lấy link từ đối số dòng lệnh
# content = sys.argv[1]
content = "https://shope.ee/8A3k0xEsnV"

def initialize_driver():
    # Đường dẫn tới thư mục profile của Chrome
    profile_path = "C:\\Users\\ADMIN\\AppData\\Local\\Google\\Chrome\\User Data"

    # Khởi tạo ChromeOptions và chỉ định đường dẫn tới profile
    options = webdriver.ChromeOptions()
    options.add_argument(f"--user-data-dir={profile_path}")
    options.add_argument("--profile-directory=Profile 2")
    options.add_argument("--disable-notifications")
    # options.add_argument("--headless")
    options.add_argument("--disable-gpu")

    # Khởi tạo ChromeDriver với ChromeOptions
    driver = webdriver.Chrome(options=options)
    print("Driver opened. Let's fucking go")

    return driver

def main(driver):

    try:
        driver.get(content)
        wait = WebDriverWait(driver, 3)

        button_like = wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".IYjGwk")))
        actions = ActionChains(driver)
        actions.move_to_element(button_like).click().perform()
        print("Button clicked successfully.")
    except NoSuchElementException:
        print("Element not found. Skipping...")
    except Exception as e:
        print("An error occurred:", str(e))
    
    

    return True  # Thoát khỏi hàm sau khi click thành công



driver = initialize_driver()
main(driver)