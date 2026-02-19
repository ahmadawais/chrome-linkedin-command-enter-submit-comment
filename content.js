document.addEventListener('keydown', (e) => {
  const isCmdOrCtrl = e.metaKey || e.ctrlKey;
  if (!isCmdOrCtrl || e.key !== 'Enter') return;

  const active = document.activeElement;
  if (!active) return;

  // Must be inside a comment editor (contenteditable or textarea)
  const isEditor =
    active.getAttribute('contenteditable') === 'true' ||
    active.tagName === 'TEXTAREA';
  if (!isEditor) return;

  // Walk up the DOM to find the comment form container
  const container = active.closest(
    '.comments-comment-box, .comments-comment-texteditor, ' +
    '.feed-shared-update-v2__comments-container, ' +
    '.comments-comment-box--cr, ' +
    '[data-test-id="comments-comment-box"]'
  );

  if (!container) return;

  // Find the submit button within the container
  const submitBtn = container.querySelector(
    'button.comments-comment-box__submit-button, ' +
    'button[class*="submit"], ' +
    'button[aria-label*="Post comment"], ' +
    'button[aria-label*="post comment"]'
  );

  if (submitBtn && !submitBtn.disabled) {
    e.preventDefault();
    submitBtn.click();
    return;
  }

  // Fallback: find any enabled "Post" button near the active element
  const allButtons = document.querySelectorAll('button');
  for (const btn of allButtons) {
    const label = (btn.textContent || '').trim().toLowerCase();
    const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
    if ((label === 'post' || ariaLabel.includes('post comment')) && !btn.disabled) {
      // Verify it's in the same comment thread by checking proximity
      if (btn.closest('.comments-comment-box, .comments-comment-texteditor, .feed-shared-update-v2__comments-container')) {
        e.preventDefault();
        btn.click();
        return;
      }
    }
  }
}, true);
