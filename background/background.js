// background/background.js

async function getAllJobs() {
  const result = await chrome.storage.local.get('jobs');
  return result.jobs || [];
}

async function addJob(job) {
  const jobs = await getAllJobs();
  
  const exists = jobs.some(j => j.url === job.url);
  if (exists) return null;

  const newJob = {
    id: Date.now().toString(),
    title: job.title,
    company: job.company,
    url: job.url,
    status: 'Saved',
    notes: '',
    createdAt: new Date().toISOString(),
  };
  jobs.push(newJob);
  await chrome.storage.local.set({ jobs });
  return newJob;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'saveJob') {
    addJob(message.job)
      .then(job => sendResponse({ success: true, duplicate: job === null }))
      .catch(() => sendResponse({ success: false }));
    return true;
  }
});