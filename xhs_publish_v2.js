/**
 * 小红书发布脚本 v2 - 使用 Playwright + Cookies
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function publishToXiaohongshu(title, content, imagePath) {
  console.log('🚀 启动浏览器...');
  const browser = await chromium.launch({ 
    headless: false,
    channel: 'chromium'
  });
  
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
  });
  
  const page = await context.newPage();
  
  // 监听控制台消息
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('❌ Console Error:', msg.text());
    }
  });
  
  try {
    // 1. 加载 cookies
    console.log('📂 加载 cookies...');
    if (fs.existsSync('/tmp/cookies.json')) {
      const cookies = JSON.parse(fs.readFileSync('/tmp/cookies.json', 'utf8'));
      await context.addCookies(cookies);
      console.log('✅ Cookies 加载成功');
    }
    
    // 2. 打开小红书
    console.log('🌐 打开小红书...');
    await page.goto('https://www.xiaohongshu.com', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    await page.screenshot({ path: '/tmp/xhs_01_home.png' });
    
    // 3. 点击发布
    console.log('📝 查找发布按钮...');
    
    // 多种选择器尝试
    const publishBtn = await page.$('button:has-text("发布")');
    if (publishBtn) {
      console.log('✅ 找到发布按钮');
      await publishBtn.click();
      await page.waitForTimeout(3000);
    } else {
      console.log('⚠️ 未找到发布按钮，截图查看当前状态');
    }
    
    await page.screenshot({ path: '/tmp/xhs_02_after_click.png' });
    
    // 4. 点击图文发布
    console.log('📷 选择图文发布...');
    const imageBtn = await page.$('text=图文');
    if (imageBtn) {
      await imageBtn.click();
      await page.waitForTimeout(2000);
    }
    
    await page.screenshot({ path: '/tmp/xhs_03_upload.png' });
    
    // 5. 上传图片
    console.log('📤 上传图片...');
    const fileInput = await page.$('input[type="file"]');
    if (fileInput && imagePath) {
      await fileInput.setInputFiles(imagePath);
      console.log(`✅ 图片已选择: ${imagePath}`);
    }
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/tmp/xhs_04_after_upload.png' });
    
    // 6. 输入标题
    console.log('✏️ 输入标题...');
    const titleInput = await page.$('textarea, input[type="text"]');
    if (titleInput) {
      await titleInput.fill(title);
      console.log('✅ 标题已输入');
    }
    
    await page.waitForTimeout(1000);
    
    // 7. 输入内容
    console.log('📝 输入内容...');
    const contentInput = await page.$('div[contenteditable="true"], .content-editor');
    if (contentInput) {
      await contentInput.fill(content);
      console.log('✅ 内容已输入');
    }
    
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/tmp/xhs_05_filled.png' });
    
    // 8. 点击发布
    console.log('🚀 点击发布按钮...');
    const submitBtn = await page.$('button:has-text("发布"):visible');
    if (submitBtn) {
      await submitBtn.click();
      console.log('✅ 已点击发布按钮');
      await page.waitForTimeout(5000);
    }
    
    await page.screenshot({ path: '/tmp/xhs_06_result.png' });
    
    console.log('✅ 发布流程完成！');
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
    await page.screenshot({ path: '/tmp/xhs_error.png' });
  } finally {
    console.log('⏸️ 浏览器保持打开');
  }
}

// 使用示例
const args = process.argv.slice(2);
const title = args[0] || '测试标题';
const content = args[1] || '测试内容';
const image = args[2] || null;

publishToXiaohongshu(title, content, image);
