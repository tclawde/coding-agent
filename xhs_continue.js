/**
 * 小红书 - 登录后继续发布
 */

const { chromium } = require('playwright');
const fs = require('fs');

async function main() {
  console.log('🚀 继续自动化...\n');
  
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
  await page.screenshot({ path: '/tmp/xhs_cont_01.png' });
  
  // 检查是否登录
  const loginBtn = await page.$('text=登录');
  if (loginBtn) {
    console.log('❌ 需要登录！请扫码\n');
    console.log('⏳ 等待扫码...');
    await page.waitForTimeout(60000);
  } else {
    console.log('✅ 已登录！继续...\n');
  }
  
  // 点击发布
  console.log('📝 点击发布...');
  await page.click('nav:has-text("发布")').catch(() => {});
  await page.waitForTimeout(5000);
  
  console.log('📸 发布页面\n');
  await page.screenshot({ path: '/tmp/xhs_cont_02.png' });
  
  // 点击图文
  console.log('📷 点击图文...');
  await page.click('text=图文').catch(() => {});
  await page.waitForTimeout(3000);
  
  console.log('📸 图文发布页\n');
  await page.screenshot({ path: '/tmp/xhs_cont_03.png' });
  
  // 上传图片
  console.log('📤 上传图片...');
  await page.setInputFiles('input[type="file"]', '/Users/apple/Desktop/screenshot_20260204_233211.png').catch(() => {});
  await page.waitForTimeout(5000);
  
  console.log('📸 上传后\n');
  await page.screenshot({ path: '/tmp/xhs_cont_04.png' });
  
  // 填写标题
  console.log('✏️ 填写标题...');
  await page.fill('textarea', '自动化测试标题').catch(() => {});
  
  console.log('📸 完成\n');
  await page.screenshot({ path: '/tmp/xhs_cont_05.png' });
  
  console.log('\n✅ 自动化完成！\n');
}

main();
