import test from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';

const PKG = fs.existsSync(path.join(__dirname, '..', 'package.json')) ? path.join(__dirname, '..') : path.join(__dirname, '..', '..');
const SCRIPT = path.join(PKG, 'commands', 'cmd-tools-backup-sandboxes.sh');

/**
 * A workspace with the dev folder and one project in it, and a bootstrap that stands in for the
 * base's: the archive is written the way backup_workspace_item writes it, and `ddev` is a function
 * that writes down what it is asked and, for export-db, does what DDEV does (an empty file first).
 */
function backup(ddevConfig: string, exportDb: 'ok' | 'fails') {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ws-backup-'));
  const scripts = path.join(root, 'core', 'scripts');
  fs.mkdirSync(scripts, { recursive: true });
  fs.mkdirSync(path.join(root, 'core', 'config'), { recursive: true });
  fs.mkdirSync(path.join(root, 'sandboxes', 'site1', '.ddev'), { recursive: true });
  fs.writeFileSync(path.join(root, 'sandboxes', 'site1', '.ddev', 'config.yaml'), ddevConfig);
  fs.writeFileSync(path.join(scripts, 'bootstrap.sh'), [
    'WORKSPACE_ROOT="$(cd "${WORKSPACE_SCRIPTS}/../.." && pwd)"; WORKSPACE_CONFIG="${WORKSPACE_ROOT}/core/config";',
    'backups="${WORKSPACE_ROOT}/backups"; doc_name=sandboxes;',
    'parse_yaml() { :; }',
    'argparse() { cat > /dev/null; PROJECT_NAME="$1"; }',
    'trim_project_name() { PROJECT_NAME="${PROJECT_NAME%/}"; }',
    'backup_workspace_item() { BACKUP_TIME=2026-11-16_00-00-00; mkdir -p "${backups}/${doc_name}"; tar -czf "${backups}/${doc_name}/${doc_name}---$1--${BACKUP_TIME}.tar.gz" "$1" && echo "Backed up $1"; }',
    'ddev() { echo "ddev $*" >> "${DDEV_LOG}"; if [ "$1" = export-db ]; then local f="${2#--file=}"; : > "${f}";',
    '  if [ "${DDEV_EXPORT}" = ok ]; then echo "-- dump" | gzip > "${f}"; return 0; fi;',
    '  echo "Error: failed to export database for site1: unable to export db: service db does not exist"; return 1; fi; }',
  ].join('\n'));
  const log = path.join(root, 'ddev.log');
  fs.writeFileSync(log, '');
  const r = spawnSync('bash', [SCRIPT, 'site1'], { cwd: path.join(root, 'sandboxes'), encoding: 'utf8',
    env: { ...process.env, WORKSPACE_SCRIPTS: scripts, DDEV_LOG: log, DDEV_EXPORT: exportDb } });
  const dir = path.join(root, 'backups', 'sandboxes');
  return { r, calls: fs.readFileSync(log, 'utf8'), files: fs.existsSync(dir) ? fs.readdirSync(dir).sort() : [], dir };
}

test('a project with no database (omit_containers: [db]) has its files backed up, and no export is tried', () => {
  const { r, calls, files } = backup('name: site1\ntype: generic\nomit_containers: [db]\n', 'fails');
  assert.strictEqual(r.status, 0, r.stdout + r.stderr);
  assert.match(r.stdout, /site1 runs without a database: its files are backed up/);
  assert.doesNotMatch(calls, /export-db/, 'ddev export-db is not asked');
  assert.deepStrictEqual(files, ['sandboxes---site1--2026-11-16_00-00-00.tar.gz'], 'the archive, and no dump beside it');
});

test('a project with a database has its dump written beside the archive', () => {
  const { r, calls, files, dir } = backup('name: site1\ntype: wordpress\n', 'ok');
  assert.strictEqual(r.status, 0, r.stdout + r.stderr);
  assert.match(calls, /ddev export-db --file=.*\/backups\/sandboxes\/sandboxes---site1--2026-11-16_00-00-00-db\.sql\.gz/);
  assert.deepStrictEqual(files, ['sandboxes---site1--2026-11-16_00-00-00-db.sql.gz', 'sandboxes---site1--2026-11-16_00-00-00.tar.gz']);
  assert.ok(fs.statSync(path.join(dir, 'sandboxes---site1--2026-11-16_00-00-00-db.sql.gz')).size > 0);
});

test('an export that fails leaves no empty dump behind, and the backup says so and ends with exit 1', () => {
  const { r, files } = backup('name: site1\ntype: drupal\n', 'fails');
  assert.strictEqual(r.status, 1);
  assert.match(r.stdout, /The database of site1 could not be exported: only its files are backed up\./);
  assert.deepStrictEqual(files, ['sandboxes---site1--2026-11-16_00-00-00.tar.gz'], 'the empty dump DDEV left is removed');
});
