// content/content.js

(function () {
  if (document.getElementById('jt-save-btn')) return;

  const button = document.createElement('button');
  button.id = 'jt-save-btn';
  button.innerText = '💼 Save Job';
  button.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 999999;
    background: #2563EB;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 10px 18px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  `;

    function getJobData() {
        // LinkedIn specific selectors
        const title =
            document.querySelector('.job-details-jobs-unified-top-card__job-title h1')?.innerText ||
            document.querySelector('h1.t-24')?.innerText ||
            document.title;

        const company =
            document.querySelector('.job-details-jobs-unified-top-card__company-name a')?.innerText ||
            document.querySelector('.job-details-jobs-unified-top-card__company-name')?.innerText ||
            window.location.hostname;

        return {
            title: title.trim(),
            company: company.trim(),
            url: window.location.href,
        };
    }

  button.addEventListener('click', () => {
    const job = getJobData();

    chrome.runtime.sendMessage({ action: 'saveJob', job }, (response) => {
        if (response?.duplicate) {
            button.innerText = '⚠️ Already saved';
            button.style.background = '#D97706';
        } else if (response?.success) {
            button.innerText = '✅ Saved!';
            button.style.background = '#16A34A';
        }
        setTimeout(() => {
            button.innerText = '💼 Save Job';
            button.style.background = '#2563EB';
        }, 2000);
    });
  });

  document.body.appendChild(button);
})();


