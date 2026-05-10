// popup/popup.js

const STATUSES = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'];

let allJobs = [];
let activeFilter = 'all';

async function loadJobs() {
  const result = await chrome.storage.local.get('jobs');
  allJobs = result.jobs || [];
  renderStats();
  renderJobs();
}

function renderStats() {
  STATUSES.forEach(status => {
    const count = allJobs.filter(j => j.status === status).length;
    document.getElementById(`count-${status.toLowerCase()}`).innerText = count;
  });
}

function renderJobs() {
  const search = document.getElementById('search').value.toLowerCase();
  const statusFilter = document.getElementById('filter-status').value;

  let filtered = allJobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(search) ||
      job.company.toLowerCase().includes(search);
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const list = document.getElementById('jobs-list');

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state">No jobs found 🔍</div>`;
    return;
  }

  list.innerHTML = filtered.map(job => `
    <div class="job-card" data-id="${job.id}">
        <div class="job-card-header">
            <span class="job-title">${job.title}</span>
        </div>
        <div class="job-company">${job.company}</div>
        <div class="job-date">${new Date(job.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        <div class="job-card-footer">
            <select class="status-select" data-id="${job.id}">
            ${STATUSES.map(s => `
                <option value="${s}" ${job.status === s ? 'selected' : ''}>${s}</option>
            `).join('')}
            </select>
            <div class="job-actions">
            <button class="btn-open" data-url="${job.url}">Open</button>
            <button class="btn-delete" data-id="${job.id}">Delete</button>
            </div>
        </div>
        <textarea
            class="job-notes"
            data-id="${job.id}"
            placeholder="Add notes..."
        >${job.notes}</textarea>
    </div>
  `).join('');

  // Status change
  document.querySelectorAll('.status-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      const id = e.target.dataset.id;
      const status = e.target.value;
      const jobs = await chrome.storage.local.get('jobs');
      const updated = jobs.jobs.map(j => j.id === id ? { ...j, status } : j);
      await chrome.storage.local.set({ jobs: updated });
      allJobs = updated;
      renderStats();
    });
  });

  // Open URL
  document.querySelectorAll('.btn-open').forEach(btn => {
    btn.addEventListener('click', (e) => {
      chrome.tabs.create({ url: e.target.dataset.url });
    });
  });

  // Delete
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      const jobs = await chrome.storage.local.get('jobs');
      const updated = jobs.jobs.filter(j => j.id !== id);
      await chrome.storage.local.set({ jobs: updated });
      allJobs = updated;
      renderStats();
      renderJobs();
    });
  });

  document.querySelectorAll('.job-notes').forEach(textarea => {
    textarea.addEventListener('blur', async (e) => {
        const id = e.target.dataset.id;
        const notes = e.target.value;
        const result = await chrome.storage.local.get('jobs');
        const updated = result.jobs.map(j => j.id === id ? { ...j, notes } : j);
        await chrome.storage.local.set({ jobs: updated });
        allJobs = updated;
    });
  });
}

function renderMetrics() {
  const applied = allJobs.filter(j => j.status !== 'Saved').length;

  const calc = (status) => {
    if (applied === 0) return '0%';
    const count = allJobs.filter(j => j.status === status).length;
    return Math.round((count / applied) * 100) + '%';
  };

  document.getElementById('metric-interview').innerText = calc('Interview');
  document.getElementById('metric-offer').innerText = calc('Offer');
  document.getElementById('metric-rejected').innerText = calc('Rejected');
}

function renderStats() {
  STATUSES.forEach(status => {
    const count = allJobs.filter(j => j.status === status).length;
    document.getElementById(`count-${status.toLowerCase()}`).innerText = count;
  });
  renderMetrics();
}

// Event listeners
document.getElementById('search').addEventListener('input', renderJobs);
document.getElementById('filter-status').addEventListener('change', renderJobs);

// Stats click → filter
document.querySelectorAll('.stat').forEach(stat => {
  stat.addEventListener('click', (e) => {
    const status = e.currentTarget.dataset.status;
    document.getElementById('filter-status').value = status;
    renderJobs();
  });
});

// Init
loadJobs();