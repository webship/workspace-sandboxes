/**
 * The Sandboxes workspace for Webship Workspace: the `sandboxes/` folder as a plugin.
 *
 * What the package carries is placed by the installer from the manifest (the folder's settings file,
 * its commands, its docs and its AI items, each in the folder of its kind) and listed by --activate; the dashboard draws the workspace from the
 * settings file like any other. Nothing to register at run time yet: this is where the folder's own
 * rail buttons, row menus or assistant context would go.
 */

import type { PluginApi } from '@webship.co/workspace-plugin-api';

export const WORKSPACE_KEY = 'sandboxes';

/** The AI items the installer places, each in the workspace folder of its kind (ai/ in this package). */
export const AGENTS = ['sandboxes-site-builder'];
export const SKILLS = ['sandboxes-workflow'];
export const AI_COMMANDS = ['sandboxes-try'];
export const PROMPTS = ['sandboxes-try-and-clear'];

export function register(api: PluginApi): void {
  api.addAssistantContext(() => `The sandboxes/ workspace is the Sandboxes workspace (a plugin, @webship.co/workspace-sandboxes); its commands are the cmd-*.sh scripts in that folder. It comes with AI items for work in this folder: the agent \`sandboxes-site-builder\` (ai-agents/), the skill \`sandboxes-workflow\` (ai-skills/), the command \`/sandboxes-try\` (ai-commands/) and the prompt \`sandboxes-try-and-clear\` (ai-prompts/).`);
}
