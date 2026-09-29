# vigilant-winner

This repository contains a sample PunchMapPro backup log workflow for tracking engineering drawing assets.

## Included
- `PunchMapPro_backup_operator_log.js` scans a source drawing folder and updates a master asset log.
- `PunchMapPro_backup_operator_log.master.json` stores the tracked asset records.
- `drawings/` contains example asset files used to demonstrate the backup flow.

## Example usage
```bash
node PunchMapPro_backup_operator_log.js ./drawings --operator "Jordan"
```

This updates the master JSON so each asset includes:
- asset id
- file name
- description
- backup status
- operator
- timestamp
- first logged timestamp
