## Background Jobs

normal task:

- login
- send req
- instant response (success/fail)

long-running tasks (without background jobs)

- user clicks 'generate summary'
- send network req
- backend generates summary (30 second)
- user waits
- risk: timeout/tab closed/connection lost
- user might never get result

This is why we have background jobs.

long-running tasks (with background jobs)

- user clicks 'generate summary'
- send network req
- queue background job
- non blocking
- background job runs in a separate environment
- notify user when job finishes
