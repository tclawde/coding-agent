/**
 * 小红书自动登录脚本 - 修复版
 */

const { chromium } = require('playwright');
const readline = require('readline');

const PHONE = '18060969530';

async function askVerificationCode() {
  return new Promise((resolve) => {
    console.log('\n📱 请输入收到的验证码: ');
    process.stdin.once('data', (data) => {
      resolve(data.toString().trim());
    });
  });
}

async function loginXiaohongshu() {
  console.log('🚀 启动浏览器...');
  
  const browser = await chromium.launch({
    headless: false,
    channel: 'chrome',
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🌐 打开小红书...');
  await page.goto('https://www.xiaohongshu.com');
  await page.waitForLoadState('networkidle');
  
  // 点击登录
  console.log('👆 点击登录...');
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('登录'));
    if (btn) btn.click();
  });
  await page.waitForTimeout(2000);
  
  // 输入手机号
  console.log('📞 输入手机号...');
  await page.evaluate((phone) => {
    const inputs = document.querySelectorAll('input');
    for (const input of inputs) {
      if (input.type === 'tel' || input.placeholder?.includes('手机')) {
        input.value = phone;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('✅ 已输入手机号');
        break;
      }
    }
  }, PHONE);
  
  await page.waitForTimeout(1000);
  
  // 勾选协议 - 改进：查找协议前面的勾选框
  console.log('✅ 勾选同意协议...');
  await page.evaluate(() => {
    // 方案1: 查找所有包含"同意"文本的元素，检查它前面的兄弟元素
    const allElements = document.querySelectorAll('*');
    for (const el of allElements) {
      if (el.innerText && el.innerText.includes('同意') && el.innerText.length < 50) {
        // 检查前面是否有checkbox
        let prev = el.previousElementSibling;
        while (prev) {
          if (prev.tagName === 'INPUT') {
            prev.checked = true;
            prev.dispatchEvent(new Event('change', { bubbles: true }));
            console.log('✅ 已勾选协议(兄弟INPUT)');
            return;
          }
          prev = prev.previousElementSibling;
        }
        // 检查父元素前面的兄弟
        const parent = el.parentElement?.previousElementSibling;
        if (parent && parent.tagName === 'INPUT') {
          parent.checked = true;
          parent.dispatchEvent(new Event('change', { bubbles: true }));
          console.log('✅ 已勾选协议(父兄弟)');
          return;
        }
      }
    }
    
    // 方案2: 直接查找所有checkbox并勾选
    const checkboxes = document.querySelectorAll('input');
    for (const cb of checkboxes) {
      if (!cb.checked && cb.type !== 'hidden') {
        cb.checked = true;
        cb.dispatchEvent(new Event('change', { bubbles: true }));
        console.log('✅ 已勾选协议(全部checkbox)');
        return;
      }
    }
  });
  
  await page.waitForTimeout(500);
  
  // 点击获取验证码
  console.log('🔐 点击获取验证码...');
  await page.evaluate(() => {
    const elements = document.querySelectorAll('*');
    for (const el of elements) {
      const text = el.innerText?.trim() || '';
      if (text === '获取验证码') {
        // 向上找到可点击的父元素
        let clickable = el;
        for (let i = 0; i < 5 && clickable; i++) {
          if (clickable.tagName === 'BUTTON' || 
              getComputedStyle(clickable).cursor === 'pointer' ||
              clickable.getAttribute('role') === 'button') {
            break;
          }
          clickable = clickable.parentElement;
        }
        if (clickable) {
          clickable.click();
          console.log('✅ 已点击获取验证码');
        }
        break;
      }
    }
  });
  
  await page.waitForTimeout(2000);
  
  // 询问验证码
  const code = await askVerificationCode();
  
  if (!code) {
    console.log('❌ 未输入验证码');
    return;
  }
  
  // 输入验证码
  console.log('⌨️ 输入验证码...');
  await page.evaluate((verificationCode) => {
    const inputs = document.querySelectorAll('input');
    for (const input of inputs) {
      // 跳过手机号输入框
      if (input.value && input.value.length === 11) continue;
      if (input.type === 'tel' || input.placeholder?.includes('验证码') || !input.value) {
        input.value = verificationCode;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        console.log('✅ 已输入验证码');
        break;
      }
    }
  }, code);
  
  await page.waitForTimeout(500);
  
  // 点击登录
  console.log('🚀 点击登录...');
  await page.evaluate(() => {
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      const text = btn.innerText.trim();
      if (text === '登录' && !text.includes('获取验证码')) {
        btn.click();
        console.log('✅ 已点击登录');
        break;
      }
    }
  });
  
  await page.waitForTimeout(3000);
  
  // 检查Cookie
  const cookies = await context.cookies();
  const hasSession = cookies.some(c => c.name.includes('web_session'));
  
  if (hasSession) {
    console.log('✅ 登录成功！');
    const fs = require('fs');
    fs.writeFileSync('xiaohongshu_cookies.json', JSON.stringify(cookies, null, 2));
    console.log('✅ Cookie 已保存到 xiaohongshu_cookies.json');
  } else {
    console.log('⚠️ 检查登录状态...');
  }
  
  console.log('\n浏览器保持打开...');
  await new Promise(() => {});
}

loginXiaohongshu().catch(console.error);
