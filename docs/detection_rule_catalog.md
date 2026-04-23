# Detection Rule Catalog

## Initial Rules

| Rule | Severity | Data Source | Logic | MITRE | False Positive Notes |
|---|---|---|---|---|---|
| Multiple Failed Login Attempts | High | Authentication logs | Matches authentication failures; should be paired with threshold/correlation by user/source. | T1110 Brute Force | Forgotten passwords and password manager retries. |
| Suspicious PowerShell Execution | High | Windows process creation | Matches encoded, hidden, or suspicious PowerShell command lines. | T1059.001 PowerShell | Administrative scripts and endpoint management tooling. |
| Cloud Admin Created Access Key | Medium | AWS CloudTrail | Matches successful `CreateAccessKey` actions. | T1098 Account Manipulation | Planned credential rotation. |
| Web Attack Pattern | High | Web server logs | Matches SQL injection and XSS markers in request URLs. | T1190 Exploit Public-Facing Application | Security scanners and penetration tests. |

## Rule Requirements

Every production detection should include:

- Name
- Description
- Severity
- Data source
- Logic
- MITRE ATT&CK mapping
- False positive notes
- Test sample
- Enabled or disabled status

## Next Engineering Work

- Add detection versioning and rollback.
- Add correlation and threshold windows for brute-force and data exfiltration rules.
- Add sample replay testing through the backend `/api/v1/detection/rules/{rule_id}/test` endpoint.
- Add rule quality checks for missing MITRE tags, false positive notes, and test samples.

