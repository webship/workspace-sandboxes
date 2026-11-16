---
description: Spin up a throwaway site in the sandboxes/ folder of the Webship Workspace to try one thing — pick the smallest builder, build, say the address, and offer to remove it when the question is answered.
argument-hint: '<what to try> [name]'
---

# /sandboxes-try

Spin up a sandbox in `~/workspace/sandboxes` for: `$ARGUMENTS`

The arguments are the text typed after the command: what is to be tried, in words (a package, a
version, a setting). The last word is the name of the sandbox when it is a single lowercase word
of letters and digits; otherwise choose a short one and say it. The workspace is container-based
(DDEV by default): the builder runs the site in its own container, nothing on the host.

## 1. Choose the smallest builder that answers the question

```bash
cd ~/workspace/sandboxes
grep -H "^# workspace-name:" cmd-*-project.sh
bash cmd-drupal11-recommended-project.sh --help
```

A plain Drupal question: `cmd-drupal11-recommended-project.sh` with `--profile minimal`. A Drupal
CMS question: `cmd-drupalcms2-x-project.sh`. A Webship question: `cmd-webship11-0-x-project.sh`.
Say which one and why.

## 2. Make sure the name is free

```bash
ls -d ~/workspace/*/<name> 2>/dev/null
ddev list | grep -w <name>
```

A builder deletes a project of the same name first. If the name is taken, choose another.

## 3. Build

```bash
bash cmd-drupal11-recommended-project.sh <name> --install --profile minimal
```

With the builder that was chosen; for a package under trial add `--require "<package>"` and
`--enable "<module>"` where the builder has them. Run it once. If it fails, show the line that
failed and stop.

## 4. Report, and offer to clear

The builder, the address (`https://<name>.ddev.site`), what was installed for the trial, and what
was found. Then ask whether to keep the sandbox or remove it:

```bash
bash cmd-tools-remove.sh <name>
```

Never remove unasked. For more than one experiment, hand over to the `sandboxes-site-builder`
agent; the `sandboxes-workflow` skill lists every command of the folder.
