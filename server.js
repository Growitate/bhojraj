import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { careersData, newsUpdates } from './src/data.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, 'dist');
const DATA_DIR = path.join(__dirname, 'data');
const STORE_PATH = path.join(DATA_DIR, 'cms-store.json');
const SUBMISSIONS_PATH = path.join(DATA_DIR, 'form-submissions.jsonl');
const SECRET_PATH = path.join(DATA_DIR, '.session-secret');

const PORT = Number(process.env.PORT || 1611);
const HOST = '0.0.0.0';
const ADMIN_PORTAL_KEY = 'bhojraj-ctrl-9x7k-m4p2-8q6r-console';
const CONTACT_EMAIL = 'contact@bhojrajgroup.in';
const CAREERS_EMAIL = 'careers@bhojrajgroup.in';
const FORM_RATE_WINDOW_MS = 10 * 60 * 1000;
const FORM_RATE_MAX = 10;
const formRateTracker = new Map();
const SESSION_COOKIE = 'bjg_admin_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8'
};

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

const getSessionSecret = () => {
  ensureDataDir();
  if (fs.existsSync(SECRET_PATH)) {
    return fs.readFileSync(SECRET_PATH, 'utf8').trim();
  }
  const secret = crypto.randomBytes(32).toString('hex');
  fs.writeFileSync(SECRET_PATH, secret, { mode: 0o600 });
  return secret;
};

const SESSION_SECRET = getSessionSecret();

const cloneDefaults = () => ({
  news: newsUpdates.map((item) => ({ ...item, content: [...(item.content || [])] })),
  careers: careersData.openings.map((job) => ({ ...job, skills: [...(job.skills || [])] }))
});

const readStore = () => {
  ensureDataDir();
  if (!fs.existsSync(STORE_PATH)) {
    const initial = cloneDefaults();
    writeStore(initial);
    return initial;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'));
    if (Array.isArray(parsed.news) && Array.isArray(parsed.careers)) {
      return parsed;
    }
  } catch {
    // Fall back to defaults if store file is malformed.
  }
  const fallback = cloneDefaults();
  writeStore(fallback);
  return fallback;
};

const writeStore = (data) => {
  ensureDataDir();
  const tmpPath = `${STORE_PATH}.${process.pid}.tmp`;
  fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2));
  fs.renameSync(tmpPath, STORE_PATH);
};

const parseCookies = (cookieHeader = '') => {
  const cookies = {};
  for (const part of cookieHeader.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    cookies[key] = decodeURIComponent(val);
  }
  return cookies;
};

const signSession = () => {
  const exp = String(Date.now() + SESSION_TTL_MS);
  const sig = crypto.createHmac('sha256', SESSION_SECRET).update(exp).digest('hex');
  return `${exp}.${sig}`;
};

const verifySession = (token) => {
  if (!token || typeof token !== 'string') return false;
  const [expStr, sig] = token.split('.');
  const exp = Number(expStr);
  if (!expStr || !sig || !Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = crypto.createHmac('sha256', SESSION_SECRET).update(expStr).digest('hex');
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  return sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf);
};

const isAllowedHost = (hostHeader = '') => {
  const host = hostHeader.split(':')[0].toLowerCase().trim();
  if (!host) return true;
  if (host === 'localhost' || host === '127.0.0.1') return true;
  if (host === 'bhojrajgroup.in' || host.endsWith('.bhojrajgroup.in')) return true;
  if (host === 'bhojraj.cyberpunk.co.in' || host.endsWith('.cyberpunk.co.in')) return true;
  return false;
};

const sendJson = (res, status, payload, extraHeaders = {}) => {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    ...extraHeaders
  });
  res.end(JSON.stringify(payload));
};

const readBody = (req, maxBytes = 1024 * 256) =>
  new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('Payload too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });

const normalizeNewsPayload = (body, existingId = null) => {
  const title = String(body.title || '').trim();
  const category = String(body.category || '').trim() || 'Group Update';
  const date = String(body.date || '').trim() || 'November 2026';
  const division = String(body.division || '').trim() || 'Bhojraj India Group · Indore HQ';
  const summary = String(body.summary || '').trim();
  const rawContent = Array.isArray(body.content)
    ? body.content
    : String(body.content || '').split(/\n\s*\n/);
  const content = rawContent.map((p) => String(p).trim()).filter(Boolean);

  if (!title || !summary) return { error: 'Headline title and summary are required.' };
  return {
    item: {
      id: existingId || `news-${crypto.randomBytes(4).toString('hex')}`,
      category,
      date,
      division,
      title,
      summary,
      content: content.length ? content : [summary]
    }
  };
};

const VALID_CAREER_CATS = new Set(['trade', 'operations', 'media']);

const normalizeCareerPayload = (body, existingId = null) => {
  const title = String(body.title || '').trim();
  const division = String(body.division || '').trim() || 'Bhojraj India Group';
  const category = VALID_CAREER_CATS.has(body.category) ? body.category : 'operations';
  const location = String(body.location || '').trim() || 'Indore, Madhya Pradesh';
  const type = String(body.type || '').trim() || 'Full-Time';
  const experience = String(body.experience || '').trim() || '1 – 3 Years';
  const posted = String(body.posted || '').trim() || 'Open Now';
  const summary = String(body.summary || '').trim();
  const rawSkills = Array.isArray(body.skills)
    ? body.skills
    : String(body.skills || '').split(',');
  const skills = rawSkills.map((s) => String(s).trim()).filter(Boolean);

  if (!title || !summary) return { error: 'Job title and summary are required.' };
  return {
    item: {
      id: existingId || `role-${crypto.randomBytes(4).toString('hex')}`,
      category,
      division,
      title,
      location,
      type,
      experience,
      posted,
      summary,
      skills
    }
  };
};

const isAuthenticated = (req) => {
  const cookies = parseCookies(req.headers.cookie || '');
  return verifySession(cookies[SESSION_COOKIE]);
};

const serveStatic = (res, reqPath) => {
  const cleanPath = decodeURIComponent(reqPath.split('?')[0]);
  const relPath = cleanPath === '/' ? 'index.html' : cleanPath.replace(/^\/+/, '');
  const fullPath = path.resolve(DIST_DIR, relPath);

  if (!fullPath.startsWith(DIST_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
    const ext = path.extname(fullPath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    const cache = cleanPath.startsWith('/assets/')
      ? 'public, max-age=31536000, immutable'
      : ext === '.html' || ext === '.json'
        ? 'no-store'
        : 'no-cache';
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': cache });
    fs.createReadStream(fullPath).pipe(res);
    return;
  }

  if (path.extname(cleanPath)) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not Found');
    return;
  }

  const indexHtml = path.join(DIST_DIR, 'index.html');
  res.writeHead(200, { 'Content-Type': MIME_TYPES['.html'], 'Cache-Control': 'no-store' });
  fs.createReadStream(indexHtml).pipe(res);
};

const checkFormRateLimit = (ip) => {
  const now = Date.now();
  const timestamps = (formRateTracker.get(ip) || []).filter((ts) => now - ts < FORM_RATE_WINDOW_MS);
  if (timestamps.length >= FORM_RATE_MAX) {
    formRateTracker.set(ip, timestamps);
    return false;
  }
  timestamps.push(now);
  formRateTracker.set(ip, timestamps);
  return true;
};

const VALID_FORM_TYPES = new Set(['business-enquiry', 'contact', 'career']);

const handleFormSubmit = async (req, res) => {
  const ip = String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  if (!checkFormRateLimit(ip)) {
    return sendJson(res, 429, { error: 'Too many submissions in a short time. Please wait a few minutes and try again.' });
  }

  const body = await readBody(req);
  const formType = VALID_FORM_TYPES.has(body.formType) ? body.formType : 'contact';
  const targetEmail = formType === 'career' ? CAREERS_EMAIL : CONTACT_EMAIL;

  if (String(body._honey || '').trim()) {
    return sendJson(res, 200, { ok: true, delivered: true, targetEmail });
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const phone = String(body.phone || '').trim();
  const message = String(body.message || '').trim();

  if (!name || !email || !phone || !message) {
    return sendJson(res, 400, { error: 'Please complete your Name, Email, Phone Number, and Message.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return sendJson(res, 400, { error: 'Please enter a valid email address.' });
  }

  const extra = {};
  let subject = `Website Enquiry — ${name}`;
  let label = 'Contact Us Form';

  if (formType === 'business-enquiry') {
    label = 'Business Enquiry Form';
    extra.Division = String(body.division || 'General / All Divisions').trim();
    extra['Enquiry Type'] = String(body.enquiryType || 'Commercial Partnership').trim();
    if (body.company) extra.Company = String(body.company).trim();
    if (body.location) extra['City / Country'] = String(body.location).trim();
    subject = `[Business Enquiry] ${extra.Division} — ${name}`;
  } else if (formType === 'career') {
    label = 'Career Application Form';
    extra['Position Applied For'] = String(body.role || 'General Application').trim();
    if (body.experience) extra.Experience = String(body.experience).trim();
    if (body.portfolio) extra['Resume / LinkedIn'] = String(body.portfolio).trim();
    subject = `[Career Application] ${extra['Position Applied For']} — ${name}`;
  } else {
    extra.Topic = String(body.subject || 'General Contact').trim();
    subject = `[Contact Us] ${extra.Topic} — ${name}`;
  }

  const record = {
    id: `sub-${crypto.randomBytes(4).toString('hex')}`,
    timestamp: new Date().toISOString(),
    formType,
    targetEmail,
    name,
    email,
    phone,
    extra,
    message,
    delivered: false
  };

  const relayPayload = {
    _subject: subject,
    _replyto: email,
    _template: 'table',
    _captcha: 'false',
    Form: label,
    Name: name,
    Email: email,
    Phone: phone,
    ...extra,
    Message: message
  };

  let delivered = false;
  let activationPending = false;
  let relayMessage = '';

  try {
    const relayRes = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Origin: 'https://bhojrajgroup.in',
        Referer: 'https://bhojrajgroup.in/',
        'User-Agent': 'Mozilla/5.0 (compatible; BhojrajGroupWebsite/1.0)'
      },
      body: JSON.stringify(relayPayload)
    });
    const text = await relayRes.text();
    let parsed = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = { message: text };
    }
    const okFlag = parsed.success === true || parsed.success === 'true';
    const msg = String(parsed.message || '');
    if (relayRes.ok && okFlag) {
      delivered = true;
      record.delivered = true;
    } else if (/activat/i.test(msg)) {
      activationPending = true;
      relayMessage = msg;
    } else {
      relayMessage = msg || `HTTP ${relayRes.status}`;
    }
  } catch (err) {
    relayMessage = err?.message || 'Relay network error';
  }

  ensureDataDir();
  fs.appendFileSync(SUBMISSIONS_PATH, `${JSON.stringify({ ...record, relayMessage })}\n`);

  return sendJson(res, 200, {
    ok: true,
    delivered,
    activationPending,
    targetEmail,
    message: relayMessage
  });
};

// Initialize persistent store on startup
readStore();

const server = http.createServer(async (req, res) => {
  if (!isAllowedHost(req.headers.host)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Blocked request. Host not allowed.');
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  try {
    if (pathname === '/api/cms' && req.method === 'GET') {
      return sendJson(res, 200, readStore());
    }

    if (pathname === '/api/forms/submit' && req.method === 'POST') {
      return handleFormSubmit(req, res);
    }

    if (pathname === '/api/admin/session' && req.method === 'GET') {
      return sendJson(res, 200, { authenticated: isAuthenticated(req) });
    }

    if (pathname === '/api/admin/login' && req.method === 'POST') {
      const body = await readBody(req);
      if (body.portal !== ADMIN_PORTAL_KEY) {
        return sendJson(res, 403, { error: 'Unauthorized portal key.' });
      }
      const token = signSession();
      const cookie = `${SESSION_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800`;
      return sendJson(res, 200, { authenticated: true }, { 'Set-Cookie': cookie });
    }

    if (pathname === '/api/admin/logout' && req.method === 'POST') {
      const cookie = `${SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`;
      return sendJson(res, 200, { authenticated: false }, { 'Set-Cookie': cookie });
    }

    if (pathname.startsWith('/api/admin/')) {
      if (!isAuthenticated(req)) {
        return sendJson(res, 401, { error: 'Admin login required.' });
      }

      if (pathname === '/api/admin/news' && req.method === 'POST') {
        const body = await readBody(req);
        const { item, error } = normalizeNewsPayload(body);
        if (error) return sendJson(res, 400, { error });
        const store = readStore();
        store.news.unshift(item);
        writeStore(store);
        return sendJson(res, 201, { item, news: store.news });
      }

      if (pathname.startsWith('/api/admin/news/') && req.method === 'PUT') {
        const id = decodeURIComponent(pathname.slice('/api/admin/news/'.length));
        const store = readStore();
        const idx = store.news.findIndex((item) => item.id === id);
        if (idx === -1) return sendJson(res, 404, { error: 'News post not found.' });
        const body = await readBody(req);
        const { item, error } = normalizeNewsPayload(body, id);
        if (error) return sendJson(res, 400, { error });
        store.news[idx] = item;
        writeStore(store);
        return sendJson(res, 200, { item, news: store.news });
      }

      if (pathname.startsWith('/api/admin/news/') && req.method === 'DELETE') {
        const id = decodeURIComponent(pathname.slice('/api/admin/news/'.length));
        const store = readStore();
        const nextNews = store.news.filter((item) => item.id !== id);
        if (nextNews.length === store.news.length) {
          return sendJson(res, 404, { error: 'News post not found.' });
        }
        store.news = nextNews;
        writeStore(store);
        return sendJson(res, 200, { news: store.news });
      }

      if (pathname === '/api/admin/careers' && req.method === 'POST') {
        const body = await readBody(req);
        const { item, error } = normalizeCareerPayload(body);
        if (error) return sendJson(res, 400, { error });
        const store = readStore();
        store.careers.unshift(item);
        writeStore(store);
        return sendJson(res, 201, { item, careers: store.careers });
      }

      if (pathname.startsWith('/api/admin/careers/') && req.method === 'PUT') {
        const id = decodeURIComponent(pathname.slice('/api/admin/careers/'.length));
        const store = readStore();
        const idx = store.careers.findIndex((item) => item.id === id);
        if (idx === -1) return sendJson(res, 404, { error: 'Job opening not found.' });
        const body = await readBody(req);
        const { item, error } = normalizeCareerPayload(body, id);
        if (error) return sendJson(res, 400, { error });
        store.careers[idx] = item;
        writeStore(store);
        return sendJson(res, 200, { item, careers: store.careers });
      }

      if (pathname.startsWith('/api/admin/careers/') && req.method === 'DELETE') {
        const id = decodeURIComponent(pathname.slice('/api/admin/careers/'.length));
        const store = readStore();
        const nextCareers = store.careers.filter((item) => item.id !== id);
        if (nextCareers.length === store.careers.length) {
          return sendJson(res, 404, { error: 'Job opening not found.' });
        }
        store.careers = nextCareers;
        writeStore(store);
        return sendJson(res, 200, { careers: store.careers });
      }

      return sendJson(res, 404, { error: 'Unknown admin endpoint.' });
    }

    if (req.method === 'GET' || req.method === 'HEAD') {
      return serveStatic(res, pathname);
    }

    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Method Not Allowed');
  } catch (err) {
    sendJson(res, 400, { error: err?.message || 'Request failed' });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Bhojraj India Group server listening on http://${HOST}:${PORT}`);
});
