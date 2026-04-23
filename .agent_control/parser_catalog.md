# Parser Catalog

## Parser Families

| Parser | Status | Notes |
|---|---|---|
| JSON | Existing | Needs schema validation and test corpus. |
| Syslog | Existing | Needs RFC3164/RFC5424 coverage tests. |
| CEF | Existing | Needs field normalization tests. |
| Windows Event Log | Planned | Should map event IDs, channels, providers, and security fields. |
| Linux Auth | Planned | Should parse sshd, sudo, PAM, and failed login patterns. |
| Auditd | Planned | Should normalize syscall, subject, object, and result fields. |
| Apache/Nginx/IIS | Planned | Should parse web access/error logs and HTTP fields. |
| Firewall/Proxy/VPN | Planned | Should normalize network action, source/destination, user, URL, and policy fields. |
| CloudTrail/Azure/GCP | Planned | Should normalize cloud actor, resource, action, account/project, region, and result. |
| EDR/XDR | Planned | Should normalize process, file, network, registry, and detection telemetry. |

## Parser Requirements

- Every parser needs a version.
- Every parser needs sample events.
- Every parser needs success and failure tests.
- Every parser must preserve raw event references.
- Every parser must emit normalized fields and parser diagnostics.

