# @webship.co/workspace-sandboxes

The **Sandboxes** workspace of the [Webship Workspace](https://github.com/webship/workspace) dashboard:
the `sandboxes/` folder (type `sites`), its settings file (`core/config/workspace.sandboxes.settings.yml`),
its commands and its docs, as a plugin.

## Use it

```bash
cd ~/workspace
bash core/scripts/plugins.sh --require github:webship/workspace-sandboxes
bash core/scripts/plugins.sh --activate sandboxes --with-needs     # puts `sandboxes` on the workspaces list of settings.yml
bash core/scripts/plugins.sh --install sandboxes      # the folder, its settings file (once), its commands, its docs (once)
```

The settings file and the docs are placed once and never overwritten: they hold what you put there.
`--deactivate` takes the workspace off the list; the folder and its content stay.

## What it goes with

The AI items land in the four AI folders, so the manifest needs them (`needs`): `ai-agents`, `ai-skills`, `ai-commands`, `ai-prompts`. `--activate sandboxes` and `--install sandboxes` stop while one is missing and name it; with `--with-needs` they are required, activated and installed first. One of its commands, `cmd-tools-update-all.sh`, still runs `composer` on the machine instead of in a project's container, so the manifest names it as a command a part of the plugin uses (`suggests.commands`): `bash core/scripts/plugins.sh --check sandboxes` says whether it is there (https://getcomposer.org/download/), and nothing is installed for you. Everything else here runs through the container tool the workspace already needs.

## The AI items

The plugin carries its own AI items (`ai/` in the package, the manifest's `ai` block), written for the work this folder is for. `--install` places each one in the workspace folder of its kind, when that folder is an active workspace folder; `--uninstall` removes them, and keeps one that was edited in its folder.

| Item | Kind | Lands in | What it is for |
| --- | --- | --- | --- |
| `sandboxes-site-builder` | Agent | `ai-agents/sandboxes-site-builder.md` | Spins up a throwaway site in `sandboxes/` to try one thing, tests it when it matters, and clears it afterwards |
| `sandboxes-workflow` | Skill | `ai-skills/sandboxes-workflow/` | How work is done in `sandboxes/`: build small, try, prove, clear; every builder and tool with its flags, the settings keys |
| `/sandboxes-try` | Command | `ai-commands/sandboxes-try.md` | `/sandboxes-try <what to try> [name]`: picks the smallest builder, builds the sandbox, reports and offers to remove it |
| `sandboxes-try-and-clear` | Prompt | `ai-prompts/sandboxes-try-and-clear.md` | A new session that builds a throwaway site, tries one thing on it, reports and clears it |

From its folder an item is installed into the AI CLI (Claude Code by default) like any other: the folder's page on the dashboard, or `bash cmd-tools-ai-items.sh <name> --install` in the AI folder (`--to dev/<project>` for one project). A prompt is not installed: the New screen form lists it as the start of a new session. The body of every item is plain Markdown any AI CLI can follow; Claude Code is the default shape (the frontmatter, the launch line of a prompt). Every command, flag, settings key and path an item names is checked by `tests/items.test.ts`; the shape of the items is the one of the reference, [`docs/plugin-items-pattern.md` of the WordPress plugin](https://github.com/webship/workspace-wordpress/blob/1.0.x/docs/plugin-items-pattern.md).

## The commands

| Command |
| --- |
| `cmd-cucumber11-0-x-project.sh` |
| `cmd-drupal10-3-x-recommended-project.sh` |
| `cmd-drupal10-recommended-project.sh` |
| `cmd-drupal11-0-x-recommended-project.sh` |
| `cmd-drupal11-4-0-recommended-project.sh` |
| `cmd-drupal11-4-x-recommended-project.sh` |
| `cmd-drupal11-recommended-project.sh` |
| `cmd-drupal12-recommended-project.sh` |
| `cmd-drupal9-recommended-project.sh` |
| `cmd-drupalcms2-1-0-project.sh` |
| `cmd-drupalcms2-x-project.sh` |
| `cmd-odoo20-project.sh` |
| `cmd-tools-add-users.sh` |
| `cmd-tools-backup-sandboxes.sh` |
| `cmd-tools-cancel-users.sh` |
| `cmd-tools-checks.sh` |
| `cmd-tools-clone.sh` |
| `cmd-tools-hostnames.sh` |
| `cmd-tools-reclaim.sh` |
| `cmd-tools-remove.sh` |
| `cmd-tools-screen.sh` |
| `cmd-tools-testing.sh` |
| `cmd-tools-update-all.sh` |
| `cmd-webship11-0-0-project.sh` |
| `cmd-webship11-0-x-project.sh` |
| `cmd-webships2-0-0-project.sh` |
| `cmd-webships2-0-x-project.sh` |
| `cmd-webships3-0-x-project.sh` |
| `cmd-wordpress-project.sh` |
| `cmd-wpbedrock1-project.sh` |

The bash functions these commands call live in the dashboard's `core/scripts/functions`.
