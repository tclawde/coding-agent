/**
 * 小红书登录截图脚本
 * 功能：打开小红书登录界面，截图保存
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
  
  console.log('🌐 打开小红书登录页...');
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
  
  // 截图
  console.log('📸 截图保存到 /tmp/xiaohongshu_login.png');
  await page.screenshot({ 
    path: '/tmp/xiaohongshu_login.png',
    fullPage: true 
  });
  
  console.log('✅ 截图完成！');
  console.log('📁 文件位置: /tmp/xiaohongshu_login.png');
  console.log('\n浏览器保持打开状态，按 Ctrl+C 退出');
  
  await new Promise(() => {});
}

main().catch(console.error);
