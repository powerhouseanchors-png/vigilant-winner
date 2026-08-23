'use strict';

/**
 * PunchMapPro backup operator log.
 *
 * Scans a folder of PMP digital drawing files and maintains a single master
 * JSON log (one entry per asset) recording status/condition, owner/operator,
 * timestamp, and name/ID + description. Re-running against the same source
 * folder updates existing entries in place rather than duplicating them, so
 * the JSON file stays the single "master" record of all assets.
 *
 * Usage (CLI):
 *   node PunchMapPro_backup_operator_log.js <sourceDir> [--operator "Name"] [--log path/to/master-log.json]
 *
 * Usage (module):
 *   const { runBackupLog, loadLog, addOrUpdateAsset } = require('./PunchMapPro_backup_operator_log');
 *   runBackupLog({ sourceDir: './drawings', operator: 'Jordan' });
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_LOG_PATH = path.join(__dirname, 'PunchMapPro_backup_operator_log.master.json');
const DRAWING_EXTENSIONS = new Set(['.dwg', '.dxf', '.pdf', '.png', '.jpg', '.jpeg', '.tif', '.tiff', '.svg']);

const STATUS = {
  BACKED_UP: 'backed-up',
  MISSING: 'missing',
  UNCHANGED: 'unchanged',
};

function loadLog(logPath = DEFAULT_LOG_PATH) {
  if (!fs.existsSync(logPath)) {
    return { assets: {} };
  }
  const raw = fs.readFileSync(logPath, 'utf8');
  return raw.trim() ? JSON.parse(raw) : { assets: {} };
}

function saveLog(log, logPath = DEFAULT_LOG_PATH) {
  fs.writeFileSync(logPath, JSON.stringify(log, null, 2) + '\n', 'utf8');
}

function addOrUpdateAsset(log, { id, name, description, status, operator }) {
  const now = new Date().toISOString();
  const existing = log.assets[id];
  log.assets[id] = {
    id,
    name,
    description: description || existing?.description || '',
    status,
    operator: operator || existing?.operator || 'unknown',
    timestamp: now,
    firstLogged: existing?.firstLogged || now,
  };
  return log.assets[id];
}

function scanDrawingFiles(sourceDir) {
  const results = [];
  const stack = [sourceDir];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
      } else if (DRAWING_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function runBackupLog({ sourceDir, operator = 'unknown', logPath = DEFAULT_LOG_PATH }) {
  if (!sourceDir || !fs.existsSync(sourceDir)) {
    throw new Error(`sourceDir not found: ${sourceDir}`);
  }

  const log = loadLog(logPath);
  const seenIds = new Set();
  const files = scanDrawingFiles(sourceDir);

  for (const filePath of files) {
    const id = path.relative(sourceDir, filePath);
    seenIds.add(id);
    addOrUpdateAsset(log, {
      id,
      name: path.basename(filePath),
      description: `PMP drawing file at ${id}`,
      status: STATUS.BACKED_UP,
      operator,
    });
  }

  for (const id of Object.keys(log.assets)) {
    if (!seenIds.has(id) && log.assets[id].status !== STATUS.MISSING) {
      log.assets[id].status = STATUS.MISSING;
      log.assets[id].timestamp = new Date().toISOString();
    }
  }

  saveLog(log, logPath);

  const summary = { total: Object.keys(log.assets).length, scanned: files.length, logPath };
  return summary;
}

function parseArgs(argv) {
  const [sourceDir, ...rest] = argv;
  const args = { sourceDir };
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--operator') args.operator = rest[++i];
    if (rest[i] === '--log') args.logPath = rest[++i];
  }
  return args;
}

if (require.main === module) {
  const args = parseArgs(process.argv.slice(2));
  if (!args.sourceDir) {
    console.error('Usage: node PunchMapPro_backup_operator_log.js <sourceDir> [--operator "Name"] [--log path]');
    process.exit(1);
  }
  const summary = runBackupLog(args);
  console.log(`Logged ${summary.scanned} files scanned; ${summary.total} total assets tracked in ${summary.logPath}`);
}

module.exports = {
  STATUS,
  loadLog,
  saveLog,
  addOrUpdateAsset,
  scanDrawingFiles,
  runBackupLog,
};
