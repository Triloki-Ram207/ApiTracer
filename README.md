📊 System-Wide API Status Monitoring Dashboard
🎯 Overview
The System-Wide API Status Monitoring Dashboard provides real-time visibility into the health and performance of multiple APIs. It offers intuitive visual indicators, quick stats, uptime graphs, and secure logging through a tracer middleware.

⚡ Features
🔍 Dashboard Overview
System-Wide Status Overview

Configurable list of APIs (e.g., /api/social, /api/link, /api/data, /api/weather, /api/inventory)

Latest status displayed with color-coded indicators:

🟩 Green – HTTP 200 OK

🟥 Red – HTTP 4xx or 5xx

🟧 Orange – HTTP 3xx (Redirects)

🟨 Yellow – HTTP 1xx (Informational)

Time Range Selector

Select time ranges (e.g., Jan 2025 – Apr 2025)

Pagination handled by monthly data blocks

System Stats (per API)

API name

Status code (200, 301, 404, 500, etc.)

Timestamp of API call

Status represented as colored blocks

Infinite Scroll

Seamless loading of monthly data blocks

Latest Status Indicator

Displays most recent API status at the top of each block

📊 Quick Stats Section
Metrics

Total Request Volume = Count of all API request logs

Average Response Time = Σ(Response Time) ÷ Total Requests

Uptime Percentage = (Successful Responses ÷ Total Requests) × 100

Error Rate = (Error Responses ÷ Total Requests) × 100

Most Common Error = Most frequent 4xx/5xx code

Last Downtime Timestamp = Most recent error log

Graph Visualization

Line chart showing Uptime Percentage Over Time

X-axis: Time (day/hour)

Y-axis: Uptime (%)

🛠️ Architecture
Workflow
Express Application receives incoming HTTP requests.

Tracer Middleware intercepts requests and collects:

Timestamp (UTC)

API Name (req.originalUrl)

HTTP Status Code

Response Time (ms)

Middleware sends logs via secure POST to Private Tracer API:

POST https://tracer-api.example.com/log

Header: x-api-key: <api_key>

Private Tracer API validates API key:

✅ Valid → Stores log in MongoDB (tracer_logs)

❌ Invalid → Returns 401 Unauthorized

Example Log Payload
json
{
  "timestamp": "2025-09-15T13:45:23Z",
  "apiName": "/api/social",
  "statusCode": 200,
  "responseTimeMs": 312
}
🔐 Security Best Practices
Use HTTPS for all communications

API Key Authentication for trusted apps

Key Rotation for long-term security

Secure Key Storage to prevent exposure

📝 Middleware: API Trace Logs Capture
Per-Request Log Buffer: Isolated in-memory storage per request

Temporary Console Override: Captures console.log, console.error, console.warn, console.info

Log Metadata: Includes timestamp, log type, request method, endpoint

Restore Console: Ensures no side effects after request completion

Integration: Captured logs attached to tracer data with traceId, method, endpoint, status, response time

⚙️ API Configuration
API List Table with columns:

Endpoint Name

Start Date

Scheduling (Start/End Time)

Request Limit / Rate

Controls

Enable/disable scheduling per API

Save configuration changes with confirmation messages

Sorting & filtering by endpoint name/status

Validation

Ensure proper date/time format

Prevent duplicate/conflicting entries

## 🌐 Live Demo

- Frontend Dashboard: [https://api-tracer-six.vercel.app/](https://api-tracer-six.vercel.app/)
- Backend API: [https://apitracerbackend.onrender.com/](https://apitracerbackend.onrender.com/)
