/**
 * The Sandboxes workspace for Webship Workspace: the `sandboxes/` folder as a plugin.
 *
 * What the package carries is placed by the installer from the manifest (the folder's settings file,
 * its commands and its docs) and listed by --activate; the dashboard draws the workspace from the
 * settings file like any other. Nothing to register at run time yet: this is where the folder's own
 * rail buttons, row menus or assistant context would go.
 */

import type { PluginApi } from '@webship.co/workspace-plugin-api';

export const WORKSPACE_KEY = 'sandboxes';

export function register(api: PluginApi): void {
  api.addAssistantContext(() => `The sandboxes/ workspace is the Sandboxes workspace (a plugin, @webship.co/workspace-sandboxes); its commands are the cmd-*.sh scripts in that folder.`);
}
