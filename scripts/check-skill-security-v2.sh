#!/bin/bash
# Skill Security Checker v2 - 改进版
# 区分文档示例和实际危险代码

set -e

SKILLS_DIR="${1:-/Users/apple/.openclaw/workspace/skills}"
FOUND_ISSUES=0
REVIEW_COUNT=0

echo "🔒 Skill Security Checker v2"
echo "============================"
echo "Scanning: $SKILLS_DIR"
echo ""

# 只检查实际脚本文件，跳过文档
SCRIPT_EXTS="\.sh$|\.py$|\.js$|\.ts$|\.mjs$|\.cjs$"

# 真正的危险模式（只检查脚本）
declare -a DANGEROUS_PATTERNS=(
    # 未经处理的命令注入
    'eval\s*\(\s*\$'
    'exec\s*\(\s*\$[^)]'
    'system\s*\(\s*\$'
    'popen\s*\(\s*\$'
    
    # Shell=True 的 subprocess
    'subprocess\.[Ppopen|call|run]\s*\([^)]*shell\s*=\s*True[^)]*\)'
    
    # 硬编码敏感信息（在脚本中）
    'password\s*=\s*['\''"][^'\''"]{8,}['\''"]'
    'api_key\s*=\s*['\''"][^'\''"]{16,}['\''"]'
    'access_token\s*=\s*['\''"][^'\''"]{16,}['\''"]'
    
    # 危险的系统操作
    'rm\s+-rf\s+/'
    'chmod\s+777'
    'dd\s+if='
)

# 检查单个脚本
check_script() {
    local script="$1"
    local skill_name=$(basename "$(dirname "$script")")
    local filename=$(basename "$script")
    local ext="${script##*.}"
    
    local content=$(cat "$script")
    local lines=$(echo "$content" | wc -l)
    
    # 跳过注释和文档
    local code=$(echo "$content" | grep -vE '^\s*#' | grep -vE '^\s*\*' | grep -vE '^\s*//' || true)
    
    for pattern in "${DANGEROUS_PATTERNS[@]}"; do
        if echo "$code" | grep -qiE "$pattern"; then
            # 再次确认是实际代码，不是注释
            local match=$(echo "$code" | grep -iE "$pattern" | head -1 | head -c 100)
            echo "🚨 $skill_name/$filename: $pattern"
            echo "   → $match..."
            FOUND_ISSUES=$((FOUND_ISSUES + 1))
        fi
    done
}

# 检查 package.json
check_package_json() {
    local pkg="$1"
    local skill_name=$(basename "$(dirname "$pkg")")
    
    if [[ -f "$pkg" ]]; then
        # 检查是否有执行任意代码的依赖
        local deps=$(cat "$pkg" 2>/dev/null | grep -oE '"[^"]+"' | tr -d '"' | tr -d '@' || true)
        
        # 危险依赖列表
        local dangerous=$(echo "$deps" | grep -iE 'eval-js|node-eval|vm2|innertext-exec' || true)
        
        if [[ -n "$dangerous" ]]; then
            echo "⚠️  $skill_name/package.json: Suspicious deps: $dangerous"
            REVIEW_COUNT=$((REVIEW_COUNT + 1))
        fi
    fi
}

# 主扫描
scan_skills() {
    if [[ ! -d "$SKILLS_DIR" ]]; then
        echo "❌ Directory not found: $SKILLS_DIR"
        exit 1
    fi
    
    echo "📂 Skills to scan:"
    local count=0
    for skill in "$SKILLS_DIR"/*; do
        if [[ -d "$skill" ]] && [[ "$(basename "$skill")" != ".DS_Store" ]]; then
            echo "   - $(basename "$skill")"
            count=$((count + 1))
        fi
    done
    echo "   Total: $count"
    echo ""
    
    echo "🔍 Scanning scripts only (skipping docs)..."
    echo ""
    
    for skill in "$SKILLS_DIR"/*; do
        if [[ -d "$skill" ]] && [[ "$(basename "$skill")" != ".DS_Store" ]]; then
            # 只扫描脚本文件
            while IFS= read -r -d '' script; do
                check_script "$script"
            done < <(find "$skill" -type f \( -name "*.sh" -o -name "*.py" -o -name "*.js" -o -name "*.mjs" -o -name "*.cjs" \) -print0 2>/dev/null)
            
            # 检查 package.json
            if [[ -f "$skill/package.json" ]]; then
                check_package_json "$skill/package.json"
            fi
        fi
    done
    
    echo ""
    echo "============================"
    echo "📊 Results:"
    echo "   Issues found: $FOUND_ISSUES"
    echo "   Needs review: $REVIEW_COUNT"
    echo ""
    
    if [[ $FOUND_ISSUES -gt 0 ]]; then
        echo "🚨 HIGH RISK: $FOUND_ISSUES issue(s) found!"
        echo "⚠️  Do NOT use these skills until fixed"
        exit 1
    elif [[ $REVIEW_COUNT -gt 0 ]]; then
        echo "⚠️  MEDIUM RISK: $REVIEW_COUNT items need manual review"
        echo "✅ Otherwise, skills appear safe to use"
        exit 0
    else
        echo "✅ LOW RISK: No obvious security issues detected"
        echo "📝 Always review skills before granting broad permissions"
    fi
}

scan_skills
