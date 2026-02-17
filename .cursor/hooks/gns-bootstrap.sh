#!/usr/bin/env bash
# GNS-First Workflow — runs on every new agent (sessionStart).
# Consumes any JSON from Cursor on stdin, then runs bootstrap commands.
set -e
cat >/dev/null || true

gns --help
gns whoami
gns batch-get gns.server.keyspace gns.server.tagspace gns.server.linkspace

exit 0
