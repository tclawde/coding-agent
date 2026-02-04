/**
 * 小红书扫码登录流程 - 截图版
 * 
 * 功能: 打开小红书扫码登录界面并截图
 * 使用方法: node xiaohongshu_login_all.js
 * 
 * 流程:
 * 1. 打开小红书扫码登录界面
 * 2. 截图并保存
 * 3. 等待扫码登录
 * 4. 保存Cookie
 */

const { chromium } = require('playwright');
const fs = require('fs');

const SCREENSHOT_PATH = '/tmp/xiaohongshu_qrcode.png';
const COOKIES_PATH = '/Users/apple/.openclaw/workspace/xiaohongshu_cookies.json';

async function main() {
  console.log('='.repeat(50));
  console.log('小红书扫码登录流程');
  console.log('='.repeat(50));
  
  console.log('\n🚀 启动浏览器...');
  
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
  
  console.log(`\n✅ 截图已保存: ${SCREENSHOT_PATH}`);
  console.log('\n📨 请查看飞书收到的二维码并扫码登录');
  
  // 等待登录
  console.log('\n⏳ 等待扫码登录（2分钟超时）...');
  
  try {
    await page.waitForFunction(() => {
      return document.cookie.includes('web_session');
    }, { timeout: 120000 });
    
    console.log('\n✅ 登录成功！');
    
    // 保存Cookie
    const cookies = await context.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
    console.log(`✅ Cookie 已保存到 ${COOKIES_PATH}`);
    console.log(`📦 共 ${cookies.length} 个Cookie`);
    
  } catch (e) {
    console.log('\n⚠️ 登录超时，请重新运行脚本');
  }
  
  console.log('\n浏览器保持打开...');
  await new Promise(() => {});
}

main().catch(console.error);
