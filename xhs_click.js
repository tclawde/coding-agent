/**
 * 小红书 - 点击创作中心
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chromium'
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // 加载 cookies
  if (fs.existsSync('/tmp/cookies.json')) {
    const cookies = JSON.parse(fs.readFileSync('/tmp/cookies.json', 'utf8'));
    await context.addCookies(cookies);
  }
  
  // 打开小红书
  await page.goto('https://www.xiaohongshu.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('📸 首页\n');
  await page.screenshot({ path: '/tmp/xhs_01_home.png' });
  
  // 点击创作中心
  console.log('🎯 点击创作中心...');
  
  // 尝试多种选择器
  try {
    // 方式1: 点击"创作中心"
    const createBtn = page.locator('text=创作中心').first();
    await createBtn.click({ timeout: 5000 }).catch(() => {});
  } catch (e) {
    console.log('⚠️ 创作中心点击失败');
  }
  
  await page.waitForTimeout(5000);
  console.log('📸 点击后\n');
  await page.screenshot({ path: '/tmp/xhs_02_after.png' });
  
  console.log('\n✅ 请查看浏览器');
  console.log('如果弹出了发布窗口，请手动操作\n');
}

main();
