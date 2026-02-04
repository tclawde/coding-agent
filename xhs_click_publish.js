/**
 * 小红书 - 只点击发布，不关闭浏览器
 */

const { chromium } = require('playwright');

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
  
  // 检查登录
  const loginBtn = await page.$('text=登录');
  if (loginBtn) {
    console.log('❌ 需要登录！请扫码...\n');
    console.log('⏳ 等待60秒...\n');
    await page.waitForTimeout(60000);
  } else {
    console.log('✅ 已登录！\n');
  }
  
  // 点击发布
  console.log('📝 点击发布...');
  await page.click('nav:has-text("发布")').catch(() => {});
  await page.waitForTimeout(5000);
  
  console.log('✅ 发布页面已打开！\n');
  console.log('浏览器保持打开状态...\n');
  
  // 不关闭浏览器
  console.log('⏸️ 完成！请手动操作发布\n');
}

main();
