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

# The database goes beside the archive, the way the project keeps it. The core's export_project_db (core 1.0.42,
# webship/workspace#937) writes the dump of the platform whose plugin keeps the database (a FastAPI app's own
# Postgres), else DDEV's export, and nothing, which it says, for a project that runs without one.
base="${backups}/${doc_name}/${doc_name}---${PROJECT_NAME}--${BACKUP_TIME}-db" ;
if declare -F export_project_db > /dev/null ; then
  if ! (cd ${PROJECT_NAME} && export_project_db "${base}") ; then
    [ -s "${base}.sql.gz" ] || rm -f "${base}.sql.gz" ;
    echo "The database of ${PROJECT_NAME} could not be exported: only its files are backed up." ;
    exit 1 ;
  fi
  exit 0 ;
fi

# An older core: a project that runs without a database (an Astro or Gatsby site: omit_containers with db, written
# inline or as a list) has only its files to back up; ddev export-db would fail on it and leave an empty dump behind,
# which a restore then tries to import.
runs_without_db() {
  local f ;
  for f in "$1"/.ddev/config.yaml "$1"/.ddev/config.*.yaml ; do
    [ -f "${f}" ] || continue ;
    grep -qE '^omit_containers:.*\bdb\b' "${f}" && return 0 ;
    awk '/^omit_containers:/ { inlist = 1 ; next }
      inlist && /^[[:space:]]*-[[:space:]]*["'"'"']?db["'"'"']?[[:space:]]*$/ { found = 1 }
      inlist && /^[^[:space:]-]/ { inlist = 0 }
      END { exit found ? 0 : 1 }' "${f}" && return 0 ;
  done
  return 1 ;
}
dump="${base}.sql.gz" ;
if runs_without_db "${PROJECT_NAME}" ; then
  echo "${PROJECT_NAME} runs without a database: its files are backed up, and there is no database to export." ;
  exit 0 ;
fi
if ! (cd ${PROJECT_NAME} && ddev export-db --file="${dump}") ; then
  [ -s "${dump}" ] || rm -f "${dump}" ;
  echo "The database of ${PROJECT_NAME} could not be exported: only its files are backed up." ;
  exit 1 ;
fi
