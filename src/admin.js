import { businesses, socialFoundation } from './data.js';

export const ADMIN_PATH = '/bhojraj-ctrl-9x7k-m4p2-8q6r-console';

export const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const LOCKED_MODULES = [
  { id: 'divisions', label: 'Business Divisions' },
  { id: 'magazines', label: 'Magazines & Downloads' },
  { id: 'podcasts', label: 'Podcasts & Media' },
  { id: 'pages', label: 'Pages & Leadership' },
  { id: 'enquiries', label: 'Enquiries & Email Routing' },
  { id: 'settings', label: 'Site Settings & SEO' }
];

const DIVISION_SUGGESTIONS = [
  'Bhojraj India Group · Indore HQ',
  ...businesses.map((b) => b.divisionName),
  socialFoundation.name
];

const CAREER_CATEGORIES = [
  { value: 'trade', label: 'Trade & Agro' },
  { value: 'operations', label: 'Industries & Workforce' },
  { value: 'media', label: 'Media & Publishing' }
];

const adminIcon = (name, size = 16) => {
  const paths = {
    news: '<path d="M4 5h16v14H4zM8 9h8M8 13h8M8 17h5"/>',
    careers: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/>',
    unlock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.6-1.8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/>',
    close: '<path d="m6 6 12 12M18 6 6 18"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    external: '<path d="M7 17 17 7M7 7h10v10"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>'
  };
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.news}</svg>`;
};

const currentMonthYear = () =>
  new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

const renderNewsForm = (editingItem) => {
  const isEdit = Boolean(editingItem);
  const contentText = editingItem?.content?.join('\n\n') || '';
  return `
    <form class="admin-editor" id="adminNewsForm">
      <div class="admin-editor__head">
        <div>
          <span class="admin-badge admin-badge--unlocked">${isEdit ? 'Edit News Post' : 'New News Post'}</span>
          <h3>${isEdit ? escapeHtml(editingItem.title) : 'Publish a News & Updates Briefing'}</h3>
        </div>
        <button class="admin-icon-btn" type="button" id="adminCancelFormBtn" aria-label="Close form">${adminIcon('close', 18)}</button>
      </div>
      <div class="admin-form-grid">
        <div class="admin-field admin-field--full">
          <label for="adminNewsTitle">Headline / Title *</label>
          <input id="adminNewsTitle" name="title" type="text" required value="${escapeHtml(editingItem?.title || '')}" placeholder="e.g. New Export Corridor Launched for Central India Agro Producers" />
        </div>
        <div class="admin-field">
          <label for="adminNewsCategory">Category *</label>
          <input id="adminNewsCategory" name="category" type="text" list="adminNewsCategoryList" required value="${escapeHtml(editingItem?.category || 'Group Milestone')}" placeholder="Group Milestone" />
        </div>
        <div class="admin-field">
          <label for="adminNewsDate">Date *</label>
          <input id="adminNewsDate" name="date" type="text" required value="${escapeHtml(editingItem?.date || currentMonthYear())}" placeholder="November 2026" />
        </div>
        <div class="admin-field admin-field--full">
          <label for="adminNewsDivision">Division / Source Label *</label>
          <input id="adminNewsDivision" name="division" type="text" list="adminDivisionList" required value="${escapeHtml(editingItem?.division || 'Bhojraj India Group · Indore HQ')}" placeholder="Bhojraj India Group · Indore HQ" />
        </div>
        <div class="admin-field admin-field--full">
          <label for="adminNewsSummary">Card Summary *</label>
          <textarea id="adminNewsSummary" name="summary" rows="3" required placeholder="Short overview displayed on the News & Updates card...">${escapeHtml(editingItem?.summary || '')}</textarea>
        </div>
        <div class="admin-field admin-field--full">
          <label for="adminNewsContent">Full Briefing Paragraphs (optional — separate paragraphs with a blank line)</label>
          <textarea id="adminNewsContent" name="content" rows="5" placeholder="Detailed update shown when visitors click Read full briefing...">${escapeHtml(contentText)}</textarea>
        </div>
      </div>
      <div class="admin-editor__actions">
        <button class="button button--gold" type="submit">${isEdit ? 'Save Changes' : 'Publish News Post'}</button>
        <button class="button button--light" type="button" id="adminCancelFormBtnSecondary">Cancel</button>
      </div>
    </form>
  `;
};

const renderCareerForm = (editingItem) => {
  const isEdit = Boolean(editingItem);
  const skillsText = editingItem?.skills?.join(', ') || '';
  return `
    <form class="admin-editor" id="adminCareerForm">
      <div class="admin-editor__head">
        <div>
          <span class="admin-badge admin-badge--unlocked">${isEdit ? 'Edit Job Opening' : 'New Job Opening'}</span>
          <h3>${isEdit ? escapeHtml(editingItem.title) : 'Post a New Job Opening'}</h3>
        </div>
        <button class="admin-icon-btn" type="button" id="adminCancelFormBtn" aria-label="Close form">${adminIcon('close', 18)}</button>
      </div>
      <div class="admin-form-grid">
        <div class="admin-field">
          <label for="adminCareerTitle">Job Title *</label>
          <input id="adminCareerTitle" name="title" type="text" required value="${escapeHtml(editingItem?.title || '')}" placeholder="e.g. Export Documentation Specialist" />
        </div>
        <div class="admin-field">
          <label for="adminCareerDivision">Division / Department *</label>
          <input id="adminCareerDivision" name="division" type="text" list="adminDivisionList" required value="${escapeHtml(editingItem?.division || 'Bhojraj India Global Trade')}" placeholder="Bhojraj India Global Trade" />
        </div>
        <div class="admin-field">
          <label for="adminCareerCat">Website Filter Category *</label>
          <select id="adminCareerCat" name="category" required>
            ${CAREER_CATEGORIES.map((c) => `<option value="${c.value}" ${editingItem?.category === c.value ? 'selected' : ''}>${escapeHtml(c.label)}</option>`).join('')}
          </select>
        </div>
        <div class="admin-field">
          <label for="adminCareerLocation">Location *</label>
          <input id="adminCareerLocation" name="location" type="text" required value="${escapeHtml(editingItem?.location || 'Indore, Madhya Pradesh')}" placeholder="Indore, Madhya Pradesh" />
        </div>
        <div class="admin-field">
          <label for="adminCareerType">Employment Type *</label>
          <select id="adminCareerType" name="type" required>
            ${['Full-Time', 'Part-Time', 'Contract', 'Internship'].map((t) => `<option value="${t}" ${editingItem?.type === t ? 'selected' : ''}>${t}</option>`).join('')}
          </select>
        </div>
        <div class="admin-field">
          <label for="adminCareerExp">Experience Required *</label>
          <input id="adminCareerExp" name="experience" type="text" required value="${escapeHtml(editingItem?.experience || '1 – 3 Years')}" placeholder="1 – 3 Years" />
        </div>
        <div class="admin-field">
          <label for="adminCareerPosted">Status Badge *</label>
          <input id="adminCareerPosted" name="posted" type="text" required value="${escapeHtml(editingItem?.posted || 'Open Now')}" placeholder="Open Now" />
        </div>
        <div class="admin-field">
          <label for="adminCareerSkills">Key Skills (comma-separated)</label>
          <input id="adminCareerSkills" name="skills" type="text" value="${escapeHtml(skillsText)}" placeholder="B2B Coordination, MS Excel, Export Compliance" />
        </div>
        <div class="admin-field admin-field--full">
          <label for="adminCareerSummary">Role Summary *</label>
          <textarea id="adminCareerSummary" name="summary" rows="3" required placeholder="Describe core responsibilities and candidate profile...">${escapeHtml(editingItem?.summary || '')}</textarea>
        </div>
      </div>
      <div class="admin-editor__actions">
        <button class="button button--gold" type="submit">${isEdit ? 'Save Job Opening' : 'Publish Job Opening'}</button>
        <button class="button button--light" type="button" id="adminCancelFormBtnSecondary">Cancel</button>
      </div>
    </form>
  `;
};

const renderNewsList = (news) => {
  if (!news.length) {
    return '<div class="admin-empty"><p>No news posts yet. Click <strong>Add News Post</strong> above to create your first briefing.</p></div>';
  }
  return `
    <div class="admin-cards">
      ${news.map((post) => `
        <article class="admin-item-card">
          <div class="admin-item-card__main">
            <div class="admin-item-card__meta">
              <span class="news-card__cat">${escapeHtml(post.category)}</span>
              <span class="admin-item-card__date">${escapeHtml(post.date)}</span>
              <span class="admin-item-card__div">${escapeHtml(post.division)}</span>
            </div>
            <h4>${escapeHtml(post.title)}</h4>
            <p>${escapeHtml(post.summary)}</p>
          </div>
          <div class="admin-item-card__actions">
            <button class="admin-action-btn" type="button" data-admin-edit="news" data-id="${escapeHtml(post.id)}">${adminIcon('edit', 14)} Edit</button>
            <button class="admin-action-btn admin-action-btn--danger" type="button" data-admin-delete="news" data-id="${escapeHtml(post.id)}">${adminIcon('trash', 14)} Delete</button>
          </div>
        </article>
      `).join('')}
    </div>
  `;
};

const renderCareersList = (careers) => {
  if (!careers.length) {
    return '<div class="admin-empty"><p>No job openings currently listed. Click <strong>Add Job Opening</strong> above to post one.</p></div>';
  }
  return `
    <div class="admin-cards">
      ${careers.map((job) => `
        <article class="admin-item-card">
          <div class="admin-item-card__main">
            <div class="admin-item-card__meta">
              <span class="career-card__type">${escapeHtml(job.type)}</span>
              <span class="admin-item-card__date">${escapeHtml(job.location)} · ${escapeHtml(job.experience)} · ${escapeHtml(job.posted)}</span>
              <span class="admin-item-card__div">${escapeHtml(job.division)}</span>
            </div>
            <h4>${escapeHtml(job.title)}</h4>
            <p>${escapeHtml(job.summary)}</p>
            ${job.skills?.length ? `
              <div class="admin-item-card__skills">
                ${job.skills.map((s) => `<span class="card-pillar">${escapeHtml(s)}</span>`).join('')}
              </div>
            ` : ''}
          </div>
          <div class="admin-item-card__actions">
            <button class="admin-action-btn" type="button" data-admin-edit="careers" data-id="${escapeHtml(job.id)}">${adminIcon('edit', 14)} Edit</button>
            <button class="admin-action-btn admin-action-btn--danger" type="button" data-admin-delete="careers" data-id="${escapeHtml(job.id)}">${adminIcon('trash', 14)} Delete</button>
          </div>
        </article>
      `).join('')}
    </div>
  `;
};

export const renderAdminPage = (state) => {
  if (!state.authenticated) {
    return `
      <main class="admin-login-shell">
        <div class="admin-login-card">
          <div class="admin-login-card__brand">
            <img src="/bhojraj-logo.png" alt="Bhojraj India Group logo" />
            <div>
              <strong>BHOJRAJ</strong>
              <small>ADMIN CONTROL</small>
            </div>
          </div>
          <span class="admin-badge admin-badge--unlocked">Restricted Access</span>
          <h1>Website Admin Panel</h1>
          <p>Sign in with one click to add, edit, or delete <strong>News &amp; Updates</strong> posts and <strong>Careers</strong> job openings on the live website.</p>
          ${state.error ? `<div class="admin-alert admin-alert--error">${escapeHtml(state.error)}</div>` : ''}
          <button class="button button--gold admin-login-btn" type="button" id="adminOneClickLoginBtn" ${state.busy ? 'disabled' : ''}>
            ${state.busy ? 'Signing in...' : 'One-Click Sign In'} ${adminIcon('arrow', 16)}
          </button>
          <a class="admin-login-back" href="/" data-route>Return to public website</a>
        </div>
      </main>
    `;
  }

  const isNews = state.activeTab === 'news';
  const showEditor = state.editorOpen;
  const editingItem = isNews
    ? state.news.find((item) => item.id === state.editingId) || null
    : state.careers.find((item) => item.id === state.editingId) || null;

  return `
    <div class="admin-shell ${state.sidebarOpen ? 'admin-shell--drawer-open' : ''}">
      <div class="admin-drawer-backdrop" id="adminDrawerBackdrop"></div>
      <aside class="admin-sidebar" aria-label="Admin navigation">
        <div class="admin-sidebar__top">
          <div class="admin-sidebar__brand">
            <img src="/bhojraj-logo.png" alt="Bhojraj logo" />
            <div>
              <strong>BHOJRAJ</strong>
              <small>ADMIN PORTAL</small>
            </div>
          </div>
          <button class="admin-icon-btn admin-sidebar__close" type="button" id="adminCloseDrawerBtn" aria-label="Close menu">${adminIcon('close', 18)}</button>
        </div>

        <div class="admin-sidebar__section">
          <div class="admin-sidebar__label">Unlocked Modules</div>
          <nav class="admin-nav">
            <button class="admin-nav__item ${isNews ? 'is-active' : ''}" type="button" data-admin-tab="news">
              <span class="admin-nav__icon">${adminIcon('news', 16)}</span>
              <span class="admin-nav__text">News &amp; Updates</span>
              <span class="admin-nav__count">${state.news.length}</span>
            </button>
            <button class="admin-nav__item ${!isNews ? 'is-active' : ''}" type="button" data-admin-tab="careers">
              <span class="admin-nav__icon">${adminIcon('careers', 16)}</span>
              <span class="admin-nav__text">Careers</span>
              <span class="admin-nav__count">${state.careers.length}</span>
            </button>
          </nav>
        </div>

        <div class="admin-sidebar__section">
          <div class="admin-sidebar__label">Locked Modules</div>
          <nav class="admin-nav">
            ${LOCKED_MODULES.map((mod) => `
              <button class="admin-nav__item admin-nav__item--locked" type="button" data-admin-locked="${escapeHtml(mod.label)}">
                <span class="admin-nav__icon">${adminIcon('lock', 15)}</span>
                <span class="admin-nav__text">${escapeHtml(mod.label)}</span>
                <span class="admin-nav__lock-pill">Locked</span>
              </button>
            `).join('')}
          </nav>
        </div>

        <div class="admin-sidebar__foot">
          <a class="admin-side-link" href="${isNews ? '/business/news' : '/careers'}" target="_blank" rel="noopener noreferrer">
            View ${isNews ? 'News' : 'Careers'} Page ${adminIcon('external', 14)}
          </a>
          <button class="admin-logout-btn" type="button" id="adminLogoutBtn">
            ${adminIcon('logout', 15)} Sign Out
          </button>
        </div>
      </aside>

      <main class="admin-main">
        <header class="admin-topbar">
          <div class="admin-topbar__left">
            <button class="admin-icon-btn admin-topbar__menu" type="button" id="adminOpenDrawerBtn" aria-label="Open menu">${adminIcon('menu', 18)}</button>
            <div>
              <span class="admin-badge admin-badge--unlocked">${adminIcon('unlock', 12)} Unlocked Section</span>
              <h1>${isNews ? 'News &amp; Updates' : 'Careers &amp; Openings'}</h1>
            </div>
          </div>
          <button class="button button--gold" type="button" id="adminAddBtn">
            ${adminIcon('plus', 15)} ${isNews ? 'Add News Post' : 'Add Job Opening'}
          </button>
        </header>

        <div class="admin-content">
          ${state.feedback ? `<div class="admin-alert admin-alert--${state.feedback.type === 'error' ? 'error' : 'ok'}" role="status">${escapeHtml(state.feedback.text)}</div>` : ''}
          ${showEditor ? (isNews ? renderNewsForm(editingItem) : renderCareerForm(editingItem)) : ''}
          ${isNews ? renderNewsList(state.news) : renderCareersList(state.careers)}
        </div>
      </main>
    </div>

    <datalist id="adminDivisionList">
      ${DIVISION_SUGGESTIONS.map((d) => `<option value="${escapeHtml(d)}"></option>`).join('')}
    </datalist>
    <datalist id="adminNewsCategoryList">
      <option value="Group Milestone"></option>
      <option value="Publications & Print"></option>
      <option value="Social Impact"></option>
      <option value="Business Brief"></option>
      <option value="Press Release"></option>
    </datalist>

    <div class="news-modal" id="adminLockedModal" hidden role="dialog" aria-modal="true" aria-labelledby="adminLockedTitle">
      <div class="news-modal__backdrop" data-admin-modal-close></div>
      <div class="news-modal__dialog admin-popup-dialog">
        <button class="news-modal__close" type="button" aria-label="Close message" data-admin-modal-close>${adminIcon('close', 18)}</button>
        <div class="admin-popup__icon">${adminIcon('lock', 22)}</div>
        <span class="admin-badge admin-badge--locked">Section Locked</span>
        <h3 class="news-modal__title" id="adminLockedTitle">Module Not Included</h3>
        <p class="admin-popup__text" id="adminLockedBody">This feature is currently locked. Please contact the development team to unlock and enable this module for your admin panel.</p>
        <div class="news-modal__foot">
          <button class="button button--gold" type="button" data-admin-modal-close>Okay</button>
        </div>
      </div>
    </div>

    <div class="news-modal" id="adminDeleteModal" hidden role="dialog" aria-modal="true" aria-labelledby="adminDeleteTitle">
      <div class="news-modal__backdrop" data-admin-delete-cancel></div>
      <div class="news-modal__dialog admin-popup-dialog">
        <button class="news-modal__close" type="button" aria-label="Cancel delete" data-admin-delete-cancel>${adminIcon('close', 18)}</button>
        <h3 class="news-modal__title" id="adminDeleteTitle">Confirm Deletion</h3>
        <p class="admin-popup__text" id="adminDeleteBody">Are you sure you want to remove this entry from the live website?</p>
        <div class="news-modal__foot">
          <button class="button button--danger" type="button" id="adminConfirmDeleteBtn">Delete</button>
          <button class="button button--light" type="button" data-admin-delete-cancel>Cancel</button>
        </div>
      </div>
    </div>
  `;
};

export const bindAdminEvents = ({ state, rerender, onSyncCms }) => {
  const loginBtn = document.getElementById('adminOneClickLoginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      state.busy = true;
      state.error = '';
      rerender();
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ portal: ADMIN_PATH.slice(1) })
        });
        if (!res.ok) throw new Error('Unable to sign in cleanly.');
        state.authenticated = true;
        await onSyncCms();
      } catch (err) {
        state.error = err?.message || 'Sign-in failed.';
      } finally {
        state.busy = false;
        rerender();
      }
    });
  }

  document.getElementById('adminOpenDrawerBtn')?.addEventListener('click', () => {
    state.sidebarOpen = true;
    rerender();
  });

  const closeDrawer = () => {
    state.sidebarOpen = false;
    rerender();
  };
  document.getElementById('adminCloseDrawerBtn')?.addEventListener('click', closeDrawer);
  document.getElementById('adminDrawerBackdrop')?.addEventListener('click', closeDrawer);

  document.getElementById('adminLogoutBtn')?.addEventListener('click', async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    state.authenticated = false;
    state.editorOpen = false;
    state.editingId = null;
    state.feedback = null;
    rerender();
  });

  document.querySelectorAll('[data-admin-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.dataset.adminTab;
      state.editorOpen = false;
      state.editingId = null;
      state.feedback = null;
      state.sidebarOpen = false;
      rerender();
    });
  });

  const lockedModal = document.getElementById('adminLockedModal');
  if (lockedModal) {
    const closeLockedModal = () => {
      lockedModal.hidden = true;
      document.body.classList.remove('modal-open');
    };
    document.querySelectorAll('[data-admin-locked]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const label = btn.dataset.adminLocked || 'This module';
        document.getElementById('adminLockedTitle').textContent = `${label} is Locked`;
        document.getElementById('adminLockedBody').textContent =
          `${label} is locked in this admin panel and does not include backend editing. If you want to enable this feature, please contact the development team.`;
        state.sidebarOpen = false;
        lockedModal.hidden = false;
        document.body.classList.add('modal-open');
      });
    });
    lockedModal.querySelectorAll('[data-admin-modal-close]').forEach((el) => {
      el.addEventListener('click', closeLockedModal);
    });
  }

  document.getElementById('adminAddBtn')?.addEventListener('click', () => {
    state.editorOpen = true;
    state.editingId = null;
    state.feedback = null;
    rerender();
  });

  const closeEditor = () => {
    state.editorOpen = false;
    state.editingId = null;
    rerender();
  };
  document.getElementById('adminCancelFormBtn')?.addEventListener('click', closeEditor);
  document.getElementById('adminCancelFormBtnSecondary')?.addEventListener('click', closeEditor);

  document.querySelectorAll('[data-admin-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.activeTab = btn.dataset.adminEdit;
      state.editingId = btn.dataset.id;
      state.editorOpen = true;
      state.feedback = null;
      rerender();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  const deleteModal = document.getElementById('adminDeleteModal');
  let pendingDelete = null;
  if (deleteModal) {
    const closeDeleteModal = () => {
      pendingDelete = null;
      deleteModal.hidden = true;
      document.body.classList.remove('modal-open');
    };
    document.querySelectorAll('[data-admin-delete]').forEach((btn) => {
      btn.addEventListener('click', () => {
        pendingDelete = { kind: btn.dataset.adminDelete, id: btn.dataset.id };
        const label = pendingDelete.kind === 'news' ? 'news post' : 'job opening';
        document.getElementById('adminDeleteBody').textContent =
          `Delete this ${label}? It will be removed immediately from the live website.`;
        deleteModal.hidden = false;
        document.body.classList.add('modal-open');
      });
    });
    deleteModal.querySelectorAll('[data-admin-delete-cancel]').forEach((el) => {
      el.addEventListener('click', closeDeleteModal);
    });
    document.getElementById('adminConfirmDeleteBtn')?.addEventListener('click', async () => {
      if (!pendingDelete) return;
      const endpoint = pendingDelete.kind === 'news' ? `/api/admin/news/${encodeURIComponent(pendingDelete.id)}` : `/api/admin/careers/${encodeURIComponent(pendingDelete.id)}`;
      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json().catch(() => ({}));
      closeDeleteModal();
      if (!res.ok) {
        state.feedback = { type: 'error', text: data.error || 'Could not delete entry.' };
      } else {
        await onSyncCms(data);
        if (state.editingId === pendingDelete?.id) {
          state.editorOpen = false;
          state.editingId = null;
        }
        state.feedback = { type: 'ok', text: 'Entry deleted from live website.' };
      }
      rerender();
    });
  }

  document.getElementById('adminNewsForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const payload = {
      title: fd.get('title'),
      category: fd.get('category'),
      date: fd.get('date'),
      division: fd.get('division'),
      summary: fd.get('summary'),
      content: fd.get('content')
    };
    const isEdit = Boolean(state.editingId);
    const url = isEdit ? `/api/admin/news/${encodeURIComponent(state.editingId)}` : '/api/admin/news';
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      state.feedback = { type: 'error', text: data.error || 'Could not save news post.' };
    } else {
      await onSyncCms(data);
      state.editorOpen = false;
      state.editingId = null;
      state.feedback = { type: 'ok', text: isEdit ? 'News post updated on the live website.' : 'New news post published to the live website.' };
    }
    rerender();
  });

  document.getElementById('adminCareerForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const payload = {
      title: fd.get('title'),
      division: fd.get('division'),
      category: fd.get('category'),
      location: fd.get('location'),
      type: fd.get('type'),
      experience: fd.get('experience'),
      posted: fd.get('posted'),
      skills: fd.get('skills'),
      summary: fd.get('summary')
    };
    const isEdit = Boolean(state.editingId);
    const url = isEdit ? `/api/admin/careers/${encodeURIComponent(state.editingId)}` : '/api/admin/careers';
    const res = await fetch(url, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      state.feedback = { type: 'error', text: data.error || 'Could not save job opening.' };
    } else {
      await onSyncCms(data);
      state.editorOpen = false;
      state.editingId = null;
      state.feedback = { type: 'ok', text: isEdit ? 'Job opening updated on the live website.' : 'New job opening published on /careers.' };
    }
    rerender();
  });
};
