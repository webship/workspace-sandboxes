Spin up a throwaway site in the sandboxes folder, try one thing on it, report, and clear it.

The launch line is for Claude Code, the default; the text between the triple quotes can be given to another AI CLI as it is.

```
claude --permission-mode bypassPermissions """
Try <what> on a throwaway site named <name> in the sandboxes folder, then clear it
# ~/workspace/sandboxes · https://<name>.ddev.site · container-based (DDEV by default)
# the builder deletes a project of the same name first: stop if <name> is a site somebody still needs
# nothing on the host: no composer, drush, npm or mysql outside the site's container

1. bash cmd-drupal11-recommended-project.sh --help
   tell me the flags it takes
2. bash cmd-drupal11-recommended-project.sh <name> --install --profile minimal
   add --require and --enable for the package under trial
3. try <what> in the site's container (ddev composer, ddev drush, in the folder <name>)
   tell me what you ran and what it printed
4. bash cmd-tools-testing.sh <name>
   bash cmd-tools-testing.sh <name> --run
   only if the result is to be proven with Webship-js

Report what was found, in a few lines.
Then ask me whether to keep the sandbox or remove it with: bash cmd-tools-remove.sh <name>
"""
```
