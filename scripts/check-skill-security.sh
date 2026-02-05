#!/bin/bash
# Skill Security Checker - 硬性安全检查脚本
# 检查已安装 skills 的潜在安全风险

set -e

SKILLS_DIR="${1:-/Users/apple/.openclaw/workspace/skills}"
RISK_LEVELS=("HIGH" "MEDIUM" "LOW")
FOUND_ISSUES=0

echo "🔒 Skill Security Checker"
echo "========================"
echo "Scanning: $SKILLS_DIR"
echo ""

# 高风险模式检测
declare -a DANGEROUS_PATTERNS=(
    # 命令注入
    '\beval\s*\('
    '\bexec\s*\([^$]'
    '\bsystem\s*\('
    '`[^`]+`'
    '\|\s*sh\b'
    '\|\s*bash\b'
    
    # 文件操作风险
    '\.write.*\$'
    '\.read.*\$'
    'rm\s+-rf'
    'unlink\s*\('
    
    # 网络请求风险
    'requests\.get.*eval'
    'curl.*\|'
    'wget.*\|'
    
    # Shell 执行
    '\bsh\s*\('
    '\bpopen\s*\('
    'subprocess.*shell\s*=\s*True'
    
    # 敏感信息
    'password\s*=\s*['\''"][^'\''"]+['\''"]'
    'api_key\s*=\s*['\''"][^'\''"]+['\''"]'
    'secret\s*=\s*['\''"][^'\''"]+['\''"]'
)

# 检查 SKILL.md 文件
check_skill_md() {
    local skill_path="$1"
    local skill_name=$(basename "$skill_path")
    local skill_md="$skill_path/SKILL.md"
    
    if [[ ! -f "$skill_md" ]]; then
        echo "⚠️  $skill_name: Missing SKILL.md"
        return
    fi
    
    # 检查危险模式
    local content=$(cat "$skill_md")
    
    for pattern in "${DANGEROUS_PATTERNS[@]}"; do
        if echo "$content" | grep -qiE "$pattern"; then
            echo "🚨 $skill_name: Found dangerous pattern: $pattern"
            FOUND_ISSUES=$((FOUND_ISSUES + 1))
        fi
    done
    
    # 检查外部命令执行
    if echo "$content" | grep -qiE 'exec\(|system\(|popen\(|subprocess'; then
        if echo "$content" | grep -qiE '#.*安全|#.*safe|硬编码|hardcode'; then
            echo "⚠️  $skill_name: External execution with comment (review manually)"
        fi
    fi
    
    # 检查敏感配置
    if echo "$content" | grep -qiE 'password|api_key|secret|token'; then
        if echo "$content" | grep -qiE '\$[A-Za-z_][A-Za-z0-9_]*|environment|ENV'; then
            echo "✅ $skill_name: Uses environment variables (good)"
        else
            echo "⚠️  $skill_name: May contain hardcoded secrets (review)"
        fi
    fi
}

# 检查脚本文件
check_scripts() {
    local skill_path="$1"
    local skill_name=$(basename "$skill_path")
    
    # 查找所有脚本文件
    while IFS= read -r -d '' script; do
        local ext="${script##*.}"
        if [[ "$ext" == "sh" || "$ext" == "js" || "$ext" == "py" || "$ext" == "ts" ]]; then
            local content=$(cat "$script")
            
            for pattern in "${DANGEROUS_PATTERNS[@]}"; do
                if echo "$content" | grep -qiE "$pattern"; then
                    echo "🚨 $skill_name: Dangerous pattern in $(basename $script): $pattern"
                    FOUND_ISSUES=$((FOUND_ISSUES + 1))
                fi
            done
        fi
    done < <(find "$skill_path" -type f -print0 2>/dev/null)
}

# 检查 package.json 依赖
check_dependencies() {
    local skill_path="$1"
    local skill_name=$(basename "$skill_path")
    local pkg_json="$skill_path/package.json"
    
    if [[ -f "$pkg_json" ]]; then
        # 检查是否有可疑依赖
        local deps=$(cat "$pkg_json" | grep -oE '"[a-z@/-]+"' | tr -d '"' | tr -d '@' || true)
        
        # 检查可疑包名
        local suspicious=$(echo "$deps" | grep -iE 'crypto|obfuscate|shell|exec|eval' | head -5 || true)
        if [[ -n "$suspicious" ]]; then
            echo "⚠️  $skill_name: Check dependencies: $suspicious"
        fi
    fi
}

# 主扫描逻辑
scan_skills() {
    if [[ ! -d "$SKILLS_DIR" ]]; then
        echo "❌ Directory not found: $SKILLS_DIR"
        exit 1
    fi
    
    echo "📂 Found skills:"
    ls -1 "$SKILLS_DIR" | grep -v ".DS_Store" | while read skill; do
        echo "   - $skill"
    done
    echo ""
    
    echo "🔍 Scanning for security issues..."
    echo ""
    
    for skill in "$SKILLS_DIR"/*; do
        if [[ -d "$skill" ]]; then
            local name=$(basename "$skill")
            if [[ "$name" != ".DS_Store" ]]; then
                check_skill_md "$skill"
                check_scripts "$skill"
                check_dependencies "$skill"
            fi
        fi
    done
    
    echo ""
    echo "========================"
    if [[ $FOUND_ISSUES -gt 0 ]]; then
        echo "🚨 Found $FOUND_ISSUES potential issue(s)"
        echo "⚠️  Please review manually"
        exit 1
    else
        echo "✅ No obvious security issues found"
        echo "📝 Note: Manual review still recommended"
    fi
}

# 运行扫描
scan_skills
