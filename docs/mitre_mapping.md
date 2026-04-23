# MITRE ATT&CK Mapping

## Initial Coverage

| Tactic | Technique | Detection |
|---|---|---|
| Credential Access | T1110 Brute Force | Multiple Failed Login Attempts |
| Execution | T1059.001 PowerShell | Suspicious PowerShell Execution |
| Persistence | T1098 Account Manipulation | Cloud Admin Created Access Key |
| Initial Access | T1190 Exploit Public-Facing Application | Web Attack Pattern |

## Mapping Standards

- Store tactic and technique IDs on detection rules.
- Preserve ATT&CK IDs in alert output.
- Show ATT&CK coverage on the dashboard.
- Include false positive notes and analyst triage guidance.
- Link detections to test samples so changes can be validated.

