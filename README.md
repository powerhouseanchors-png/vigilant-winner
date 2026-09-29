# vigilant-winner

PunchMapPro backup operator log system for tracking engineering drawing assets.

## Overview

This repository provides a Node.js-based workflow to scan drawing files and maintain a master JSON log of all assets, including their backup status, operator, timestamps, and descriptions.

## Features

- **Asset Scanning**: Recursively scans directories for drawing files (.dwg, .dxf, .pdf, .png, .jpg, .jpeg, .tif, .tiff, .svg)
- **Master Log**: Maintains a single source of truth JSON file with all asset records
- **Status Tracking**: Records asset status (backed-up, missing, unchanged)
- **Operator Attribution**: Logs which operator performed the backup
- **Timestamp Recording**: Captures both first-logged and current-timestamp for each asset

## Usage

### CLI
```bash
node PunchMapPro_backup_operator_log.js <sourceDir> [--operator "Name"] [--log path/to/master-log.json]
```

#### Example
```bash
node PunchMapPro_backup_operator_log.js ./drawings --operator "Jordan"
```

### Module API

```javascript
const { runBackupLog, loadLog, addOrUpdateAsset } = require('./PunchMapPro_backup_operator_log');

const result = runBackupLog({
  sourceDir: './drawings',
  operator: 'Jordan',
  logPath: './PunchMapPro_backup_operator_log.master.json'
});

console.log(`Scanned ${result.scanned} files; ${result.total} total assets tracked`);
```

## Asset Record Structure

Each asset in the master log contains:

```json
{
  "id": "unique-identifier",
  "name": "filename.ext",
  "description": "Human-readable description",
  "status": "backed-up|missing|unchanged",
  "operator": "Operator Name",
  "timestamp": "2026-09-29T12:00:00.000Z",
  "firstLogged": "2026-09-29T12:00:00.000Z"
}
```

## Example Files

The `drawings/` directory contains sample drawing files to demonstrate the backup workflow.
