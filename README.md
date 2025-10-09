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

Convex + Next.js + Inngest

Local

```mermaid
+-------------------+ +-------------------+ +------------------------+
| | HTTP | | HTTP | |
| Next.js Client | --------> | Convex Dev Cloud | --------> | Inngest Dev Server |
| (localhost) | | (Cloud sandbox) | | (localhost:8288 + ngrok)|
| | <-------- | | <-------- | |
| | Response | | Event API | |
+-------------------+ +-------------------+ +------------------------+
```

Next.js Client (localhost) ---> Convex Dev Cloud (Cloud Sandbox) ----> Inngest Dev Server (localhost:8288 + ngrok)

- Next.js uses dev Convex URL (https://dev-xxxx.convex.cloud)
- Convex Cloud needs tunnel URL to reach local - Inngest Dev Server (ngrok or local IP)
- Event key is dev/test key
- Tunnel changes each session unless you reserve a subdomain

Prod

+-------------------+ HTTP +-------------------+ HTTP / API +------------------------+
| | ------------------> | | --------------------> | |
| Next.js Client | | Convex Prod Cloud | | Inngest Cloud |
| (Vercel / public)| <------------------ | (Cloud prod) | <-------------------- | (Cloud prod API) |
| | Response | | Event API | |
+-------------------+ +-------------------+ +------------------------+
^ ^ ^
| env: prod URL / keys | env: INNGEST_APP_KEY = prod app key | prod server handles events
| (no base URL override needed) |

Next.js Client (Vercel) ----> Convex Prod Cloud (Cloud prod) ----> Inngest Cloud (Cloud prod API)

- Everything is fully cloud-based. No tunneling needed
- Convex Cloud → Inngest Cloud communicates via HTTPS API
- Event key → production app key
- All environments isolated
