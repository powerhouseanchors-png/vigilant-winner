# Vigilant Winner

A lightweight backup and inventory utility for PunchMapPro drawing assets.

This repository includes:
- `PunchMapPro_backup_operator_log.js` — scans a source folder of PMP drawing files and maintains a master JSON log
- `PunchMapPro_backup_operator_log.master.json` — the asset ledger used to track current status, operator, timestamps, and notes
- `sample-drawings/` — example asset files for demo/testing
- `asset-dashboard.html` — a simple visual dashboard for reviewing the log

## What it does

The script recursively scans a folder for supported drawing formats:

- `.dwg`
- `.dxf`
- `.pdf`
- `.png`
- `.jpg`
- `.jpeg`
- `.tif`
- `.tiff`
- `.svg`

It then updates a single master JSON file with one entry per asset and records:
- asset ID
- file name
- description
- backup status
- operator name
- creation/last-updated timestamp
- first logged timestamp

If a file is no longer present in the source directory, its status is marked as `missing`.

## Usage

Run from the repository root:

```bash
node PunchMapPro_backup_operator_log.js ./sample-drawings --operator "Jordan"
```

Optional custom log path:

```bash
node PunchMapPro_backup_operator_log.js ./sample-drawings --operator "Jordan" --log ./custom-log.json
```

## Example output

```bash
Logged 4 files scanned; 4 total assets tracked in /path/to/PunchMapPro_backup_operator_log.master.json
```

## Viewing the dashboard

Open `asset-dashboard.html` in a browser, or serve the folder locally:

```bash
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000/asset-dashboard.html
```

## Notes

The included JSON file starts with sample records so the project is immediately usable for demo purposes, but the real workflow is to point the script at your actual drawing folder and let it regenerate the master log.
