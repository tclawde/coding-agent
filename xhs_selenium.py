#!/usr/bin/env python3
"""
小红书自动化 - 使用Selenium控制Chrome
"""

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def main():
    print("🚀 启动Chrome...\n")

    # Chrome选项
    options = Options()
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--start-maximized')
    options.binary_location = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

    # 使用Chrome默认配置文件
    options.add_argument('--user-data-dir=/Users/apple/Library/Application Support/Google/Chrome/Default')

    driver = None
    try:
        driver = webdriver.Chrome(options=options)

        print("🌐 打开小红书...")
        driver.get('https://www.xiaohongshu.com')
        time.sleep(5)

        print("📸 截图")
        driver.save_screenshot('/tmp/xhs_selenium.png')
        print("✅ 截图已保存到 /tmp/xhs_selenium.png\n")

        # 检查登录状态
        try:
            login_btn = driver.find_element(By.XPATH, "//*[contains(text(), '登录')]")
            print("❌ 需要登录")
        except:
            print("✅ 已登录")

        print("\n✅ 完成\n")

    except Exception as e:
        print(f"❌ 错误: {e}\n")
    finally:
        if driver:
            input("按Enter关闭浏览器...")
            driver.quit()

if __name__ == '__main__':
    main()
