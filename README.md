# 💼 Job Tracker

A Chrome extension for tracking job applications directly in your browser — no spreadsheets needed.

![Demo](demo.gif)

## Features

- **Save jobs in one click** — a floating button appears on every job page
- **Track statuses** — Saved → Applied → Interview → Offer / Rejected
- **Analytics** — interview rate, offer rate and rejection rate
- **Search & filter** — find any job by title, company or status
- **Notes** — add notes to each application
- **No account needed** — all data stored locally in your browser

## Installation

1. Clone the repo
```bash
   git clone https://github.com/nikitaLevin/job-tracker.git
```
2. Open `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked** and select the `job-tracker` folder

## Usage

1. Go to any job listing on LinkedIn
2. Click the **💼 Save Job** button in the bottom right corner(draggable)
3. Open the extension popup to manage your applications

## Tech Stack

- Vanilla JavaScript
- Chrome Extensions API (Manifest V3)
- `chrome.storage.local`

## Roadmap

- [ ] Backend sync (NestJS + PostgreSQL)
- [ ] Export to CSV
- [ ] Email/calendar reminders