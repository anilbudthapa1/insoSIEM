# Codex Agent Batch Rules

The agent must process prompt files in batches of 10.

## Batch Size

10 files per batch.

## Progress Folder

Use:

.agent_progress/

Required files:

- completed_files.txt
- failed_files.txt
- batch_report.md
- current_state.json

## Completion Rule

A prompt file is completed only when:

1. The file is read.
2. The requested implementation is finished.
3. Related project files are updated.
4. Basic validation is done.
5. The filename is added to completed_files.txt.

## Continue Rule

After finishing one batch of 10, automatically continue to the next 10 pending files.

Do not ask the user to type "next".

## Stop Conditions

Stop only if:

- API/rate limit blocks the agent
- permission is required
- project cannot build due to missing dependencies
- a prompt file is unreadable
- the task is unsafe or destructive
- required information is missing and cannot be inferred

## Existing Completed Work

Assume the first 50 prompt files are already completed unless the progress tracker says otherwise.

Start from file 51 or the next pending file.
