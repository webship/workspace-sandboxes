#!/usr/bin/env bash

# Bootstrap.
# Find the workspace tooling from this script, so a fresh clone needs no setup.
WORKSPACE_SCRIPTS="${WORKSPACE_SCRIPTS:-$(cd "$(dirname "${BASH_SOURCE[0]}")/../core/scripts" && pwd)}";
source ${WORKSPACE_SCRIPTS}/bootstrap.sh || exit 1 ;

# Load workspace settings and extra lists.
eval $(parse_yaml ${WORKSPACE_CONFIG}/workspace.sandboxes.settings.yml);

ARGPARSE_DESCRIPTION="Backup a sandboxes project"
argparse "$@" <<EOF || exit 1
parser.add_argument('PROJECT_NAME',
                    help='The name of the project.')
EOF

shift $#;
trim_project_name ;   # "v11x00b1/" -> "v11x00b1" — see functions/fun-project-name.sh

backup_workspace_item "${PROJECT_NAME}" || exit 1 ;

# The database goes beside the archive. A project that runs without one (an Astro or Gatsby site:
# omit_containers: [db]) has only its files to back up; ddev export-db would fail on it and leave
# an empty dump behind, which a restore then tries to import.
dump="${backups}/${doc_name}/${doc_name}---${PROJECT_NAME}--${BACKUP_TIME}-db.sql.gz" ;
if grep -qsE '^omit_containers:.*\bdb\b' ${PROJECT_NAME}/.ddev/config.yaml ${PROJECT_NAME}/.ddev/config.*.yaml ; then
  echo "${PROJECT_NAME} runs without a database: its files are backed up, and there is no database to export." ;
  exit 0 ;
fi
if ! (cd ${PROJECT_NAME} && ddev export-db --file="${dump}") ; then
  [ -s "${dump}" ] || rm -f "${dump}" ;
  echo "The database of ${PROJECT_NAME} could not be exported: only its files are backed up." ;
  exit 1 ;
fi
