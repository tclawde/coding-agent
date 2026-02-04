/**
 * 模块1: 小红书登录并截图
 * 功能: 打开小红书扫码登录界面并截图
 */

const { chromium } = require('playwright');

const SCREENSHOT_PATH = process.env.SCREENSHOT_PATH || '/tmp/xiaohongshu_qrcode.png';

async function openAndScreenshot() {
  console.log('🚀 启动浏览器...');
  
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🌐 打开小红书...');
  await page.goto('https://www.xiaohongshu.com');
  await page.waitForLoadState('networkidle');
  
  // 点击登录
  console.log('👆 点击登录...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('登录'));
    if (btn) btn.click();
  });
  
  await page.waitForTimeout(2000);
  
  // 切换到扫码登录
  console.log('📱 切换到扫码登录...');
  await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    for (const el of elements) {
      if (el.innerText && el.innerText.includes('扫码登录')) {
        el.click();
        break;
      }
    }
  });
  
  await page.waitForTimeout(2000);
  
  // 截图
  console.log('📸 截图...');
  await page.screenshot({ 
    path: SCREENSHOT_PATH,
    fullPage: true 
  });
  
  console.log(`✅ 截图已保存: ${SCREENSHOT_PATH}`);
  
  return { browser, context, page };
}

module.exports = { openAndScreenshot };
