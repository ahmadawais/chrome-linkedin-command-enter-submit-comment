// Hard guard: only run on LinkedIn, never on any other site
if (!location.hostname.endsWith('linkedin.com')) {
  throw new Error('Extension restricted to LinkedIn only.');
}

document.addEventListener('keydown', (e) => {
  const isCmdOrCtrl = e.metaKey || e.ctrlKey;
  if (!isCmdOrCtrl || e.key !== 'Enter') return;

  const active = document.activeElement;
  if (!active) return;

  // Must be inside a contenteditable editor or textarea
  const isEditor =
    active.getAttribute('contenteditable') === 'true' ||
    active.tagName === 'TEXTAREA';
  if (!isEditor) return;

  // ── 1. Try comment containers first ──────────────────────────────────────
  const commentContainer = active.closest(
    '.comments-comment-box, ' +
    '.comments-comment-texteditor, ' +
    '.feed-shared-update-v2__comments-container, ' +
    '.comments-comment-box--cr, ' +
    '[data-test-id="comments-comment-box"]'
  );

  if (commentContainer) {
    const submitBtn = commentContainer.querySelector(
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

    // Fallback: scan buttons strictly inside the comment container
    for (const btn of commentContainer.querySelectorAll('button')) {
      const label = (btn.textContent || '').trim().toLowerCase();
      const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
      if ((label === 'post' || ariaLabel.includes('post comment')) && !btn.disabled) {
        e.preventDefault();
        btn.click();
        return;
      }
    }

    return; // We're in a comment box — don't fall through to post logic
  }

  // ── 2. Try main post creation modal / composer ────────────────────────────
  const postContainer = active.closest(
    '.share-creation-state, ' +
    '.share-box, ' +
    '.share-box-v2, ' +
    '.share-creation-state__main, ' +
    '.share-box-feed-entry__top-bar, ' +
    '.artdeco-modal, ' +
    '[data-test-id="share-creation-state"]'
  );

  if (postContainer) {
    const postBtn = postContainer.querySelector(
      'button.share-actions__primary-action, ' +
      'button[aria-label="Post"], ' +
      'button[aria-label="post"]'
    );

    if (postBtn && !postBtn.disabled) {
      e.preventDefault();
      postBtn.click();
      return;
    }

    // Fallback: scan buttons strictly inside the post container
    for (const btn of postContainer.querySelectorAll('button')) {
      const label = (btn.textContent || '').trim().toLowerCase();
      const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
      if ((label === 'post' || ariaLabel === 'post') && !btn.disabled) {
        e.preventDefault();
        btn.click();
        return;
      }
    }
  }
}, true);
