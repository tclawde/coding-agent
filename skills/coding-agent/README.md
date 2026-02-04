# Coding Agent Skill for OpenClaw

OpenClaw skill for running AI coding agents via background process for programmatic control.

## Supported Agents

| Agent | Binary | Install |
|-------|--------|---------|
| Codex | `codex` | `brew install codex` |
| Claudeaude` | ` Code | `clbrew install claude` |
| OpenCode | `opencode` | `npm install -g opencode` |
| Pi Coding Agent | `pi` | `npm install -g @mariozechner/pi-coding-agent` |
| iFlow | `iflow` | `brew install iflow` |

## Usage

### Basic Pattern

```bash
# Run agent in target directory (workdir)
bash workdir:~/project background:true command:"iflow \"Your task\""

# Monitor progress
process action:log sessionId:XXX

# Check status
process action:poll sessionId:XXX
```

### Examples

**Codex:**
```bash
bash workdir:~/project background:true command:"codex exec --full-auto \"Build a snake game\""
```

**Claude Code:**
```bash
bash workdir:~/project background:true command:"claude \"Refactor the auth module\""
```

**iFlow (with auto-approve):**
```bash
bash workdir:~/project background:true command:"iflow -y -p \"Fix bug in auth module\""
```

**Pi:**
```bash
bash workdir:~/project background:true command:"pi --provider openai -p \"Summarize src/\""
```

## iFlow Flags

- `-p, --prompt`: Non-interactive mode
- `-y, --yolo`: Auto-approve all actions
- `-s, --sandbox`: Run in sandbox
- `-m, --model`: Specify model
- `-o, --output-file`: Save execution info
- `--all-files`: Include all files in context
- `--max-turns`: Limit model calls
- `--timeout`: Max execution time in seconds

## License

MIT
