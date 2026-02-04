/**
 * 小红书 - 直接发布（假设已登录）
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
  
  console.log('📸 首页\n');
  await page.screenshot({ path: '/tmp/xhs_now_01.png' });
  
  // 直接点击发布（不检查登录）
  console.log('📝 点击发布...');
  
  // 尝试多种选择器
  const selectors = [
    'nav:has-text("发布")',
    '[aria-label="发布"]',
    '.nav-item:has-text("发布")',
    'a:has-text("发布")',
    'button:has-text("发布")'
  ];
  
  for (const selector of selectors) {
    try {
      const btn = await page.$(selector);
      if (btn) {
        console.log(`✅ 找到: ${selector}`);
        await btn.click();
        break;
      }
    } catch (e) {}
  }
  
  await page.waitForTimeout(5000);
  console.log('📸 发布页面\n');
  await page.screenshot({ path: '/tmp/xhs_now_02.png' );
  
  // 点击图文
  console.log('📷 点击图文...');
  await page.click('text=图文').catch(() => {});
  await page.waitForTimeout(3000);
  
  console.log('📸 图文页\n');
  await page.screenshot({ path: '/tmp/xhs_now_03.png' });
  
  console.log('\n✅ 完成！\n');
}

main();
