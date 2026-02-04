/**
 * 小红书 - 正确加载cookies并登录
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  console.log('🚀 启动...\n');
  
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chromium'
  });
  
  // 创建新context并加载cookies
  console.log('📂 加载cookies...');
  const cookies = JSON.parse(fs.readFileSync('/tmp/cookies.json', 'utf8'));
  
  const context = await browser.newContext({
    cookies: cookies,
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  // 访问小红书
  console.log('🌐 打开小红书...');
  await page.goto('https://www.xiaohongshu.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);
  
  console.log('📸 首页\n');
  await page.screenshot({ path: '/tmp/xhs_cookies_01.png' });
  
  // 检查是否登录
  const loginBtn = await page.$('text=登录');
  if (loginBtn) {
    console.log('❌ Cookies未生效，需要重新登录\n');
    console.log('⏳ 请扫码登录...');
    await page.waitForTimeout(60000);
  } else {
    console.log('✅ 已登录！\n');
  }
  
  // 点击发布
  console.log('📝 点击发布...');
  await page.click('nav:has-text("发布")').catch(() => {
    console.log('⚠️ 发布按钮未找到');
  });
  
  await page.waitForTimeout(5000);
  console.log('📸 发布页面\n');
  await page.screenshot({ path: '/tmp/xhs_cookies_02.png' });
  
  console.log('\n✅ 完成\n');
}

main();
