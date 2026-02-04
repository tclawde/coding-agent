/**
 * 小红书 - 登录并保存cookies
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  console.log('🚀 启动...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chromium'
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 打开小红书
  console.log('🌐 打开小红书...');
  await page.goto('https://www.xiaohongshu.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('📸 首页\n');
  await page.screenshot({ path: '/tmp/xhs_save_01.png' });
  
  // 等待用户扫码登录
  console.log('⏳ 请扫码登录 (60秒)...');
  await page.waitForTimeout(60000);
  
  console.log('✅ 登录完成！保存cookies...\n');
  
  // 获取并保存cookies
  const cookies = await context.cookies();
  fs.writeFileSync('/tmp/cookies_new.json', JSON.stringify(cookies, null, 2));
  
  console.log(`📁 Cookies已保存到 /tmp/cookies_new.json (${cookies.length}个)\n`);
  
  // 截图确认
  await page.screenshot({ path: '/tmp/xhs_save_02.png' });
  
  console.log('✅ 完成！新cookies已保存\n');
  
  // 不关闭浏览器
  console.log('⏸️ 浏览器保持打开状态');
}

main();
