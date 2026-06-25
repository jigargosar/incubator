# Claude Code VSCode Commands

Source: `anthropic.claude-code` v2.1.191 — `contributes.commands` / `contributes.keybindings`.
Namespace is `claude-vscode.*` (primary) + `claude-code.*` (legacy dupes). No bare `claude.*` commands exist.

## Commands

| Command ID | Title | Description |
|---|---|---|
| `claude-vscode.editor.open` | Open in New Tab | Open Claude Code in a new editor tab |
| `claude-vscode.editor.openLast` | Open | Open the last Claude Code session |
| `claude-vscode.primaryEditor.open` | Open in Primary Editor | Open Claude Code in the primary editor group |
| `claude-vscode.window.open` | Open in New Window | Open Claude Code in a new window |
| `claude-vscode.createWorktree` | Create Worktree | Create a git worktree |
| `claude-vscode.sidebar.open` | Open in Side Bar | Open Claude Code in the side bar |
| `claude-vscode.newConversation` | New Conversation | Start a new conversation |
| `claude-vscode.reopenClosedSession` | Reopen Closed Session | Reopen the last closed session |
| `claude-vscode.update` | Update extension | Update the extension |
| `claude-vscode.focus` | Focus input | Focus the Claude Code input |
| `claude-vscode.blur` | Blur input | Blur the input |
| `claude-vscode.logout` | Logout | Log out |
| `claude-vscode.terminal.open` | Open in Terminal | Open Claude Code in a terminal |
| `claude-vscode.acceptProposedDiff` | Accept Proposed Changes | Accept proposed diff (when viewing a diff) |
| `claude-vscode.rejectProposedDiff` | Reject Proposed Changes | Reject proposed diff (when viewing a diff) |
| `claude-vscode.insertAtMention` | Insert @-Mention Reference | Insert an @-mention reference |
| `claude-vscode.installPlugin` | Install Plugin | Install a plugin |
| `claude-vscode.showLogs` | Show Logs | Show extension logs |
| `claude-vscode.openWalkthrough` | Open Walkthrough | Open the walkthrough |
| `claude-code.acceptProposedDiff` | Accept Proposed Changes | Legacy dupe of `claude-vscode.acceptProposedDiff` |
| `claude-code.rejectProposedDiff` | Reject Proposed Changes | Legacy dupe of `claude-vscode.rejectProposedDiff` |
| `claude-code.insertAtMentioned` | Insert At-Mentioned | Legacy dupe of `claude-vscode.insertAtMention` |

No `category` or `description` fields are set; "Claude Code:" is baked into each title.

## Keybindings

| Command | Win/Linux | Mac | When |
|---|---|---|---|
| `claude-vscode.insertAtMention` | `alt+k` | `alt+k` | `editorTextFocus` |
| `claude-vscode.focus` | `ctrl+escape` | `cmd+escape` | `!useTerminal && editorTextFocus` |
| `claude-vscode.blur` | `ctrl+escape` | `cmd+escape` | `!useTerminal && !editorTextFocus` |
| `claude-vscode.editor.open` | `ctrl+shift+escape` | `cmd+shift+escape` | `!useTerminal` |
| `claude-vscode.terminal.open.keyboard` * | `ctrl+escape` | `cmd+escape` | `useTerminal` |
| `claude-vscode.newConversation` | `ctrl+n` | `cmd+n` | panel/sidebar active |
| `claude-vscode.reopenClosedSession` | `ctrl+shift+t` | `cmd+shift+t` | last closed was a session |
| `claude-code.insertAtMentioned` | `ctrl+alt+k` | `cmd+alt+k` | `editorTextFocus` |

\* `terminal.open.keyboard` is bound in keybindings but registered at runtime; not in `contributes.commands`.
