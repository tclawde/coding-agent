/**
 * 小红书扫码登录截图并发送到飞书
 * 
 * 使用方法: node xiaohongshu_qrcode_send.js
 */

const { chromium } = require('playwright');
const fs = require('fs');

// 配置
const SCREENSHOT_PATH = '/tmp/xiaohongshu_qrcode.png';
const COOKIES_PATH = '/Users/apple/.openclaw/workspace/xiaohongshu_cookies.json';
const FEISHU_USER_ID = 'ou_715534dc247ce18213aee31bc8b224cf';

async function main() {
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
        console.log('已点击扫码登录');
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
  
  console.log('✅ 截图完成！');
  
  // 发送到飞书
  console.log('📨 发送到飞书...');
  await sendToFeishu(SCREENSHOT_PATH, '请扫码登录小红书 📱');
  
  // 等待用户扫码登录
  console.log('\n⏳ 等待扫码登录...');
  console.log('请在手机上确认登录');
  
  // 等待登录成功（检测web_session cookie）
  try {
    await page.waitForFunction(() => {
      return document.cookie.includes('web_session');
    }, { timeout: 60000 }); // 1分钟超时
    
    console.log('✅ 登录成功！');
    
    // 获取并保存Cookie
    const cookies = await context.cookies();
    fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
    console.log(`✅ Cookie 已保存到 ${COOKIES_PATH}`);
    
    // 发送成功通知
    await sendToFeishu(SCREENSHOT_PATH, '✅ 登录成功！Cookie已保存');
    
  } catch (e) {
    console.log('⚠️ 登录超时，请重新运行脚本');
    await sendToFeishu(SCREENSHOT_PATH, '⚠️ 登录超时，请重新扫码');
  }
  
  console.log('\n浏览器保持打开...');
  await new Promise(() => {});
}

// 发送到飞书
async function sendToFeishu(imagePath, messageText) {
  const { execSync } = require('child_process');
  
  try {
    execSync(`message action=send to="${FEISHU_USER_ID}" filePath="${imagePath}" message="${messageText}"`);
    console.log('✅ 飞书消息发送成功');
  } catch (e) {
    console.log('❌ 飞书消息发送失败:', e.message);
  }
}

main().catch(console.error);
