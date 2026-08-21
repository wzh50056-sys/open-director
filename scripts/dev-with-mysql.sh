#!/bin/sh

set -eu

project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
data_dir="$project_dir/.mysql-data-runtime-80"
run_dir="$project_dir/.mysql-run"
mysql_port=${OPEN_DIRECTOR_MYSQL_PORT:-3307}
mysql_pid=""

if [ -x /usr/local/mysql/bin/mysqld ]; then
  mysqld_bin=/usr/local/mysql/bin/mysqld
  mysqld_basedir=/usr/local/mysql
elif [ -x /opt/homebrew/opt/mysql@8.4/bin/mysqld ]; then
  mysqld_bin=/opt/homebrew/opt/mysql@8.4/bin/mysqld
  mysqld_basedir=/opt/homebrew/opt/mysql@8.4
else
  mysqld_bin=$(command -v mysqld || true)
  mysqld_basedir=""
fi

cleanup() {
  if [ -n "$mysql_pid" ] && kill -0 "$mysql_pid" 2>/dev/null; then
    kill "$mysql_pid" 2>/dev/null || true
    wait "$mysql_pid" 2>/dev/null || true
  fi
}

trap cleanup EXIT HUP INT TERM

if ! nc -z 127.0.0.1 "$mysql_port" 2>/dev/null; then
  if [ -z "$mysqld_bin" ]; then
    echo "MySQL 未安装，无法启动本地数据库。" >&2
    exit 1
  fi
  if [ ! -f "$data_dir/mysql.ibd" ]; then
    echo "缺少本地数据库：$data_dir" >&2
    exit 1
  fi

  mkdir -p "$run_dir"
  # This local MySQL build leaves empty implicit undo files after shutdown but
  # expects to recreate them on its next startup. Business tables live in their
  # own .ibd files; remove only these generated undo/truncation artifacts.
  find "$data_dir" -maxdepth 1 -type f \
    \( -name 'undo_001' -o -name 'undo_002' -o -name 'undo_1_trunc.log' -o -name 'undo_2_trunc.log' \) \
    -delete
  test -f "$run_dir/mysql.log" && find "$run_dir/mysql.log" -delete
  "$mysqld_bin" \
    --no-defaults \
    --basedir="$mysqld_basedir" \
    --datadir="$data_dir" \
    --innodb-undo-log-truncate=OFF \
    --port="$mysql_port" \
    --bind-address=127.0.0.1 \
    --socket="$run_dir/mysql.sock" \
    --pid-file="$run_dir/mysql.pid" \
    --log-error="$run_dir/mysql.log" \
    --mysqlx=OFF &
  mysql_pid=$!

  attempt=0
  while ! nc -z 127.0.0.1 "$mysql_port" 2>/dev/null; do
    if ! kill -0 "$mysql_pid" 2>/dev/null; then
      echo "MySQL 启动失败：" >&2
      tail -40 "$run_dir/mysql.log" >&2 || true
      exit 1
    fi
    attempt=$((attempt + 1))
    if [ "$attempt" -ge 30 ]; then
      echo "等待 MySQL 启动超时。" >&2
      exit 1
    fi
    sleep 1
  done
fi

cd "$project_dir"
pnpm --filter @open-director/web dev
