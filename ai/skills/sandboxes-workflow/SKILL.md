---
name: sandboxes-workflow
description: How work is done in the `sandboxes/` folder of the Webship Workspace — which `cmd-*.sh` builds a throwaway site, the flags of each command, how the experiment is tested with Webship-js, and how a sandbox is removed and its disk reclaimed, with the settings keys of the folder. Use when asked to "spin up a sandbox", "try this on a throwaway site", "which builder is there for a quick Drupal site", "clean up the sandboxes", or when a command of `sandboxes/` is about to be run.
argument-hint: '[what you are about to do in sandboxes]'
---

# sandboxes-workflow

`~/workspace/sandboxes` is the Sandboxes folder of a Webship Workspace (container-based, DDEV by default).
Sandboxes are throwaway experiments: a site is built here to try one thing, and nothing here is expected to survive. It comes with the Sandboxes plugin (`@webship.co/workspace-sandboxes`), which places the commands below in the
folder. Every command finds the workspace from its own path; run it from the folder, and read
`bash <command> --help` before quoting a flag.

## The order of work

1. **Build** the smallest site that answers the question:
   `bash cmd-drupal11-recommended-project.sh mysite --install --profile minimal`, with `--require`
   and `--enable` for the package under trial. The name is the folder, the container project and
   the address (`https://mysite.ddev.site`). A builder deletes a project of the same name first.
2. **Try** the thing, in the site's container: `ddev composer …`, `ddev drush …` in `mysite/`.
3. **Prove** it when it matters: `bash cmd-tools-testing.sh mysite`, then
   `bash cmd-tools-testing.sh mysite --dry-run` and `bash cmd-tools-testing.sh mysite --run`.
4. **Clear**: `bash cmd-tools-remove.sh mysite`, after asking. `bash cmd-tools-remove.sh --orphans`
   and `bash cmd-tools-reclaim.sh` report what was left behind; nothing is removed without `--apply`.

## Builders

| Builder | Builds | Flags |
| --- | --- | --- |
| `cmd-cucumber11-0-x-project.sh` | Cucumber 11.0.x | `--add-users` `--enable` `--install` `--php-version` `--require` `--skip-drop-database` `--skip-set-default-settings` |
| `cmd-drupal10-3-x-recommended-project.sh` | Drupal 10.3.x (recommended project) | `--add-users` `--dev` `--enable` `--install` `--launch` `--php-version` `--profile` `--require` |
| `cmd-drupal10-recommended-project.sh` | Drupal 10 (recommended project) | `--add-users` `--dev` `--enable` `--install` `--launch` `--php-version` `--profile` `--require` |
| `cmd-drupal11-0-x-recommended-project.sh` | Drupal 11.0.x (recommended project) | `--add-users` `--dev` `--enable` `--install` `--launch` `--php-version` `--profile` `--require` |
| `cmd-drupal11-4-0-recommended-project.sh` | Drupal 11.4.0 (recommended project) | `--add-users` `--dev` `--enable` `--install` `--launch` `--php-version` `--profile` `--require` |
| `cmd-drupal11-4-x-recommended-project.sh` | Drupal 11.4.x (recommended project) | `--add-users` `--dev` `--enable` `--install` `--launch` `--php-version` `--profile` `--require` |
| `cmd-drupal11-recommended-project.sh` | Drupal 11 (latest) | `--add-users` `--dev` `--enable` `--install` `--launch` `--php-version` `--profile` `--require` |
| `cmd-drupal12-recommended-project.sh` | Drupal 12 (latest) | `--add-users` `--dev` `--enable` `--install` `--launch` `--php-version` `--profile` `--require` |
| `cmd-drupal9-recommended-project.sh` | Drupal 9 (recommended project) | `--add-users` `--dev` `--enable` `--install` `--launch` `--php-version` `--profile` `--require` |
| `cmd-drupalcms2-1-0-project.sh` | Drupal CMS 2.1.0 | `--add-users` `--install` `--php-version` |
| `cmd-drupalcms2-x-project.sh` | Drupal CMS 2.x | `--add-users` `--install` `--php-version` |
| `cmd-odoo20-project.sh` | Odoo 20 Community | `--demo` `--install` `--launch` |
| `cmd-webship11-0-0-project.sh` | Webship 11.0.0 | `--add-users` `--enable` `--install` `--php-version` `--require` `--skip-drop-database` `--skip-set-default-settings` |
| `cmd-webship11-0-x-project.sh` | Webship 11.0.x | `--add-users` `--enable` `--install` `--php-version` `--require` `--skip-drop-database` `--skip-set-default-settings` |
| `cmd-webships2-0-0-project.sh` | Webships 2.0.0 | `--add-users` `--enable` `--install` `--php-version` `--require` `--skip-drop-database` `--skip-set-default-settings` |
| `cmd-webships2-0-x-project.sh` | Webships 2.0.x | `--add-users` `--enable` `--install` `--php-version` `--require` `--skip-drop-database` `--skip-set-default-settings` |
| `cmd-webships3-0-x-project.sh` | Webships 3.0.x | `--add-users` `--php-version` `--template` |
| `cmd-wordpress-project.sh` | WordPress (latest) | `--install` `--launch` `--php-version` |
| `cmd-wpbedrock1-project.sh` | WordPress on Composer (Bedrock ^1) | `--install` `--launch` `--php-version` |

`--install` installs the site (without it the installer waits at the address); `--add-users` adds
the default accounts of the distribution. A builder deletes a project of the same name first.

## Tools

| Command | What it does | Flags |
| --- | --- | --- |
| `cmd-tools-add-users.sh` | Adds the default accounts of a distribution to a site: `<site> <distribution>` | none |
| `cmd-tools-backup-sandboxes.sh` | An item as an archive and its database as a dump, into `backups/sandboxes/` | none |
| `cmd-tools-cancel-users.sh` | Removes those accounts again: `<site> <distribution>` | none |
| `cmd-tools-checks.sh` | Runs the code-quality checks an item's `package.json` declares; `--list` prints the plan and runs nothing | `--browser` `--e2e` `--fail-fast` `--install` `--list` `--only` `--runner` `--skip` |
| `cmd-tools-clone.sh` | Folder and database under a new name, here or in another folder | `--branch` `--extra-hostname` `--no-build-copy` `--no-db` `--target-workspace` `--to` `--with-workspace-hostname` `--worktree` |
| `cmd-tools-hostnames.sh` | The addresses a site answers at, and one more | `--add` `--remove` `--start` `--with-workspace` |
| `cmd-tools-reclaim.sh` | Disk held by projects whose folder is gone: a dry run unless `--apply` | `--apply` `--keep-days` `--list-protected` `--only` |
| `cmd-tools-remove.sh` | Containers, volumes and folder together; refuses work that is on no remote unless `--force` | `--backup` `--force` `--orphans` |
| `cmd-tools-screen.sh` | A detached session with a log the dashboard follows | `--follow` `--list` `--log` `--run` `--stop` |
| `cmd-tools-testing.sh` | Sets the Webship-js testing stack up on a site, or runs its suite in the site's container | `--browser` `--configure` `--dry-run` `--headed` `--path` `--retry` `--run` `--tags` |
| `cmd-tools-update-all.sh` | `composer update` in every site, **on the host**: not yet moved into the containers. Do not run it unasked; use `ddev composer update` in one site | none |

## Settings

| Key | File | What it says |
| --- | --- | --- |
| `doc.name` | `core/config/workspace.sandboxes.settings.yml` | The folder under the workspace root: `sandboxes` |
| `type` | `core/config/workspace.sandboxes.settings.yml` | `sites`: the rows of the page are built sites, with the Build, Tests, Checks, Users, Backup and Remove actions |
| `composer` | `core/config/workspace.sandboxes.settings.yml` | `full`: the COMPOSER menu may install and update here, in the site's container |
| `assistant.name`, `assistant.placeholder` | `core/config/workspace.sandboxes.settings.yml` | What the assistant is called on this page; `default` takes the workspace's |
| `workspaces` | `core/config/settings.yml` | The active folders; `sandboxes` is on it once the plugin is activated |
| `account.name`, `account.mail` | `core/config/settings.yml` | The workspace account: the administrator of every site a builder installs |

## Rules

- Containers only: never `composer`, `drush`, `php`, `npm` or `mysql` on the host for a site. In the
  site's folder: `ddev composer …`, `ddev drush …`, `ddev export-db --file=…`, `ddev start -y`,
  `ddev stop` (no `-y`).
- Never write database settings into `settings.php`.
- A sandbox is cleared when the question is answered, after asking: `bash cmd-tools-remove.sh mysite`.

The Sandboxes plugin places these beside this one, each in the workspace folder of its kind: the agent `sandboxes-site-builder` (`ai-agents/`), the command `/sandboxes-try` (`ai-commands/`) and the prompt `sandboxes-try-and-clear` (`ai-prompts/`).
