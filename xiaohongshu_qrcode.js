/**
 * 小红书扫码登录截图脚本
 */

const { chromium } = require('playwright');

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
  
  // 等待登录弹窗
  await page.waitForTimeout(3000);
  
  // 点击"扫码登录"选项卡
  console.log('📱 切换到扫码登录...');
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('*');
    for (const el of tabs) {
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
    path: '/tmp/xiaohongshu_qrcode.png',
    fullPage: true 
  });
  
  console.log('✅ 截图完成！');
  console.log('📁 /tmp/xiaohongshu_qrcode.png');
  
  await new Promise(() => {});
}

main().catch(console.error);
