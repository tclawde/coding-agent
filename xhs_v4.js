/**
 * 小红书自动化 v4 - 先登录再发布
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
  await page.goto('https://www.xiaohongshu.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('📸 首页\n');
  await page.screenshot({ path: '/tmp/xhs_v4_01.png' });
  
  // 检查是否需要登录
  const loginBtn = await page.$('text=登录');
  if (loginBtn) {
    console.log('⚠️ 需要登录，请扫码...\n');
    
    // 等待用户扫码登录
    console.log('⏳ 等待扫码登录 (60秒)...');
    await page.waitForTimeout(60000);
    
    console.log('✅ 登录完成\n');
  }
  
  // 点击发布按钮
  console.log('📝 点击发布按钮...');
  await page.click('nav button:has-text("发布")').catch(async () => {
    // 备用选择器
    console.log('🔄 尝试备用选择器...');
    await page.click('[aria-label="发布"]').catch(() => {});
  });
  
  await page.waitForTimeout(5000);
  console.log('📸 发布页面\n');
  await page.screenshot({ path: '/tmp/xhs_v4_02.png' });
  
  console.log('\n✅ 流程完成！\n');
}

main();
