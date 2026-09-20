# BeProductive – Chrome Productivity Tracker


## Overview

BeProductive is a productivity tracking web application with a Chrome extension that helps users stay focused during work or study sessions. The application allows users to create a timed productivity session, define which websites are considered productive, and automatically track browsing activity using the Chrome Tabs API.

During a session, the extension continuously monitors the active browser tab and classifies the user's browsing time as either **productive** or **unproductive** based on the configured list of productive domains. When the session ends (either automatically when the timer expires or manually by the user), a detailed analytics report is generated to help users understand how they spent their time.

<img width="1272" height="1000" alt="Image" src="https://github.com/user-attachments/assets/6de94cff-aa4c-4b30-946a-7d6f921a1c6f" />

---

## Features

* ⏱️ Create timed productivity sessions.
* 🌐 Configure a custom list of productive domains.
* 📊 Automatically track active browser tabs using the Chrome Tabs API.
* ✅ Measure productive browsing time.
* ❌ Measure unproductive browsing time.
* 🔄 Count distractions by tracking switches to unproductive websites.
* 📈 Display session analytics after every session.
* 🛑 End sessions manually or automatically when the timer expires.
* 📊 Compare with previous session — instantly see how your productive time, unproductive time, and domain jumps stack up against your last session
* 📄 Export to PDF — download a clean summary report of any session for your records

---

## Tech Stack

### Frontend

* Vue.js

### Backend

* Express.js

### Browser Extension

* Chrome Extension
* Chrome Tabs API

---

## How It Works

1. Start a new productivity session.
2. Choose the desired session duration.
3. Configure the list of productive domains (for example: `github.com`, `stackoverflow.com`, `leetcode.com`).
4. Start the session.
5. The Chrome extension continuously monitors the currently active browser tab.
6. Every visited domain is classified as:

   * **Productive**
   * **Unproductive**
7. Time spent on each category is recorded throughout the session.
8. When the timer finishes or the user clicks **Stop Session**, an analytics report is generated.

---

## Session Analytics

At the end of every session, the application displays:

* **Total Productive Time**
* **Total Unproductive Time**
* **Total Session Duration**
* **List of Unproductive Domains Visited**
* **Total Unproductive Jumps** (number of times the user switched to an unproductive website)

Example:

```text
Total Productive Time: 45 min 12 sec

Total Unproductive Time: 14 min 48 sec

Session Duration: 60 min

List of Unproductive Domains Visited:
- youtube.com
- instagram.com
- reddit.com

Total Unproductive Jumps: 7
```

<img width="1273" height="997" alt="Image" src="https://github.com/user-attachments/assets/56653fe6-2805-4346-acf4-f4180698b54e" />

<br/>

<img width="1270" height="655" alt="Image" src="https://github.com/user-attachments/assets/04db6655-dc92-4836-b4ec-926f408fdefd" />

---

## Export to PDF
Once a session ends, BeProductive lets you export a clean, shareable PDF report summarizing your results — total productive and unproductive time, session duration, unproductive domain jumps and visits and the full list of distracting domains visited. It's a quick way to keep a record of your sessions over time or just reflect on your habits without digging back through the app.

<img width="953" height="480" alt="Image" src="https://github.com/user-attachments/assets/8102e443-68df-4428-aba5-2154ee10645c" />


## Use Cases

* Students preparing for exams
* Developers tracking coding sessions
* Remote employees
---

## Future Improvements

* Daily and weekly productivity reports
* Productivity trends and charts
* Notifications when spending too much time on distracting websites

---

