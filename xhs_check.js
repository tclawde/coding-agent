/**
 * 小红书 - 只截图检查状态
 */

const { chromium } = require('playwright');

async function main() {
  console.log('🚀 检查状态...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chromium'
  });
  
  const page = await browser.newPage();
  
  await page.goto('https://www.xiaohongshu.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('📸 截图\n');
  await page.screenshot({ path: '/tmp/xhs_check.png' });
  
  // 检查登录状态
  const loginBtn = await page.$('text=登录');
  console.log(loginBtn ? '❌ 需要登录' : '✅ 已登录');
  
  // 检查发布按钮
  const publishBtn = await page.$('nav:has-text("发布")');
  console.log(publishBtn ? '✅ 有发布按钮' : '❌ 无发布按钮');
  
  console.log('\n✅ 完成\n');
}

main();
