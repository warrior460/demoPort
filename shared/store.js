/* =========================================================
   SHARED DATA LAYER
   Used by both the public website (js/main.js) and the
   Admin Panel (admin/js/admin.js). Everything is persisted
   in the browser's localStorage so edits survive refreshes
   and sync live between open tabs on this device.
   ========================================================= */

(function (global) {

  const KEYS = {
    content: 'abk_site_content_v1',
    theme: 'abk_site_theme_v1',
    auth: 'abk_admin_auth_v1'
  };

  const DEFAULT_THEME = 'executive-navy';

  // Premium, formal palettes. Each theme sets every CSS variable the site uses.
  function T(label, swatch, v) { return { label, swatch, vars: v }; }
  const DARK_EXTRAS = { '--grain': 'rgba(255,255,255,0.025)', '--blob-mul': '1', '--shadow-lg': '0 30px 60px -30px rgba(0,0,0,0.55)' };

  const THEMES = {
    'executive-navy': T('Executive Navy & Gold', ['#0A1220', '#C9A24B', '#5B8DEF'], Object.assign({
      '--bg': '#0A1220', '--bg-alt': '#0D1729', '--surface': '#111C32', '--surface-2': '#17243F',
      '--border': 'rgba(234,238,245,0.09)', '--border-strong': 'rgba(234,238,245,0.17)',
      '--text': '#EAEEF5', '--text-muted': '#97A3BA', '--text-faint': '#5E6C88',
      '--accent': '#C9A24B', '--accent-dim': '#A6832F', '--accent-soft': 'rgba(201,162,75,0.14)',
      '--accent-2': '#5B8DEF', '--accent-2-soft': 'rgba(91,141,239,0.14)',
      '--on-accent': '#14100A', '--nav-bg': 'rgba(10,18,32,0.72)', '--nav-solid': 'rgba(10,18,32,0.97)'
    }, DARK_EXTRAS)),
    'royal-indigo': T('Royal Indigo', ['#0A0F1F', '#5B6EF5', '#7DD3FC'], Object.assign({
      '--bg': '#0A0F1F', '--bg-alt': '#0D1428', '--surface': '#121A33', '--surface-2': '#19244A',
      '--border': 'rgba(228,234,252,0.09)', '--border-strong': 'rgba(228,234,252,0.17)',
      '--text': '#EBEFFA', '--text-muted': '#98A3C4', '--text-faint': '#5F6B93',
      '--accent': '#5B6EF5', '--accent-dim': '#4655D0', '--accent-soft': 'rgba(91,110,245,0.17)',
      '--accent-2': '#7DD3FC', '--accent-2-soft': 'rgba(125,211,252,0.13)',
      '--on-accent': '#FFFFFF', '--nav-bg': 'rgba(10,15,31,0.72)', '--nav-solid': 'rgba(10,15,31,0.97)'
    }, DARK_EXTRAS)),
    'graphite-steel': T('Graphite & Steel', ['#111317', '#7FA6D6', '#C7CDD8'], Object.assign({
      '--bg': '#111317', '--bg-alt': '#15181D', '--surface': '#1B1F26', '--surface-2': '#232831',
      '--border': 'rgba(236,238,242,0.08)', '--border-strong': 'rgba(236,238,242,0.16)',
      '--text': '#ECEEF2', '--text-muted': '#9AA1AE', '--text-faint': '#626A78',
      '--accent': '#7FA6D6', '--accent-dim': '#5E86B8', '--accent-soft': 'rgba(127,166,214,0.15)',
      '--accent-2': '#C7CDD8', '--accent-2-soft': 'rgba(199,205,216,0.11)',
      '--on-accent': '#0E1218', '--nav-bg': 'rgba(17,19,23,0.74)', '--nav-solid': 'rgba(17,19,23,0.97)'
    }, DARK_EXTRAS)),
    'deep-teal': T('Deep Teal & Brass', ['#08181A', '#3FB8AF', '#D9B26F'], Object.assign({
      '--bg': '#08181A', '--bg-alt': '#0B1F22', '--surface': '#0F2A2E', '--surface-2': '#143439',
      '--border': 'rgba(230,242,241,0.09)', '--border-strong': 'rgba(230,242,241,0.17)',
      '--text': '#E6F2F1', '--text-muted': '#8FB0AE', '--text-faint': '#55797A',
      '--accent': '#3FB8AF', '--accent-dim': '#2E948C', '--accent-soft': 'rgba(63,184,175,0.15)',
      '--accent-2': '#D9B26F', '--accent-2-soft': 'rgba(217,178,111,0.14)',
      '--on-accent': '#06201F', '--nav-bg': 'rgba(8,24,26,0.74)', '--nav-solid': 'rgba(8,24,26,0.97)'
    }, DARK_EXTRAS)),
    'burgundy-champagne': T('Burgundy & Champagne', ['#150C11', '#D8B98A', '#C45C75'], Object.assign({
      '--bg': '#150C11', '--bg-alt': '#1A0F15', '--surface': '#22141C', '--surface-2': '#2C1A25',
      '--border': 'rgba(243,236,238,0.09)', '--border-strong': 'rgba(243,236,238,0.16)',
      '--text': '#F3ECEE', '--text-muted': '#B0A0A7', '--text-faint': '#75646C',
      '--accent': '#D8B98A', '--accent-dim': '#B49467', '--accent-soft': 'rgba(216,185,138,0.14)',
      '--accent-2': '#C45C75', '--accent-2-soft': 'rgba(196,92,117,0.14)',
      '--on-accent': '#1A1008', '--nav-bg': 'rgba(21,12,17,0.74)', '--nav-solid': 'rgba(21,12,17,0.97)'
    }, DARK_EXTRAS)),
    'ivory-navy': T('Ivory & Navy (Light)', ['#F7F5F0', '#1D3F7A', '#B8893B'], {
      '--bg': '#F7F5F0', '--bg-alt': '#F1EEE7', '--surface': '#FFFFFF', '--surface-2': '#F3F0E9',
      '--border': 'rgba(20,33,61,0.10)', '--border-strong': 'rgba(20,33,61,0.20)',
      '--text': '#14213D', '--text-muted': '#4F5B73', '--text-faint': '#8A93A5',
      '--accent': '#1D3F7A', '--accent-dim': '#152F5F', '--accent-soft': 'rgba(29,63,122,0.09)',
      '--accent-2': '#B8893B', '--accent-2-soft': 'rgba(184,137,59,0.14)',
      '--on-accent': '#FFFFFF', '--nav-bg': 'rgba(247,245,240,0.80)', '--nav-solid': 'rgba(247,245,240,0.98)',
      '--grain': 'rgba(20,33,61,0.035)', '--blob-mul': '0.22', '--shadow-lg': '0 30px 60px -34px rgba(20,33,61,0.35)'
    })
  };

  const DEFAULT_CONTENT = {
    hero: {
      eyebrow: 'Aspiring Data Analyst',
      title: 'Adnan Bin Abdul Khaleque',
      tagline: 'Making sense of data, driving better decisions.',
      photo: null
    },
    about: {
      title: 'From thesis research to data-driven decisions.',
      steps: [
        {
          title: 'Thesis research',
          text: "My path into data started during my undergraduate thesis, where I worked on time-series forecasting for Bangladesh's energy transition — building models to understand how the country's power landscape is likely to shift in the years ahead."
        },
        {
          title: 'IEEE publication',
          text: 'That research was later published as a conference paper with IEEE, which became the real turning point for me — the moment data analysis stopped being coursework and became the direction I wanted to build a career around.'
        },
        {
          title: 'Self-driven mastery',
          text: "Since then, I've been learning deliberately and by doing: cleaning and structuring data in Excel with formulas and Power Query, visualizing it in Power BI and Tableau, and querying and analyzing it with SQL and Python — one personal project at a time."
        }
      ]
    },
    projectsSection: {
      eyebrow: 'My Work',
      title: 'Selected Projects',
      sub: 'Real-world analytics, dashboards and automation solutions built to solve practical business problems.'
    },
    projectCategories: ['Power BI', 'SQL', 'Excel', 'Excel Automation using Python'],
    projects: [
      {
        id: 'p1', title: 'RMG Production Analytics Dashboard',
        desc: 'Production analytics dashboard for monitoring production performance, machine utilization and operator efficiency.',
        tags: ['Power BI', 'DAX', 'Power Query', 'Excel'], category: 'Power BI',
        github: '', video: '', image: null, thumbStyle: 'bars'
      },
      {
        id: 'p2', title: 'Ads Performance Analytics Dashboard',
        desc: 'Marketing analytics dashboard for analyzing campaign performance, spending, reach, conversions and advertising KPIs.',
        tags: ['Power BI', 'DAX', 'Power Query'], category: 'Power BI',
        github: '', video: '', image: null, thumbStyle: 'line'
      }
    ],
    skills: {
      dataAnalysis: ['Excel', 'SQL', 'Python', 'Pandas'],
      visualization: ['Power BI', 'Tableau', 'Matplotlib'],
      database: ['MySQL', 'Power Query', 'DAX'],
      core: ['Data Cleaning', 'EDA', 'Descriptive Stats', 'Dashboard Design']
    },
    education: {
      degree: 'BSc in Electrical & Electronic Engineering',
      university: '[Your University Name]',
      year: '[20XX]',
      note: "CGPA available on request — add here if you'd like it displayed."
    },
    certifications: [],
    resume: { link: '#', fileName: null, fileData: null },
    contact: {
      email: 'your@email.com',
      whatsapp: '8800000000',
      linkedin: 'https://linkedin.com/in/yourprofile',
      github: 'https://github.com/yourprofile'
    },
    footer: {
      role: 'Data Analyst · EEE Graduate'
    }
  };

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function deepMerge(target, source) {
    const out = Array.isArray(target) ? target.slice() : { ...target };
    if (Array.isArray(source)) return source;
    for (const key in source) {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) && target[key]) {
        out[key] = deepMerge(target[key], source[key]);
      } else if (source[key] !== undefined) {
        out[key] = source[key];
      }
    }
    return out;
  }

  function getContent() {
    try {
      const raw = localStorage.getItem(KEYS.content);
      if (!raw) return deepClone(DEFAULT_CONTENT);
      const parsed = JSON.parse(raw);
      return deepMerge(deepClone(DEFAULT_CONTENT), parsed);
    } catch (e) {
      console.error('Store: failed to read content, using defaults', e);
      return deepClone(DEFAULT_CONTENT);
    }
  }

  function saveContent(content) {
    try {
      localStorage.setItem(KEYS.content, JSON.stringify(content));
      return true;
    } catch (e) {
      console.error('Store: failed to save content', e);
      return false;
    }
  }

  function resetContent() {
    try {
      localStorage.removeItem(KEYS.content);
      return true;
    } catch (e) {
      console.error('Store: failed to reset content', e);
      return false;
    }
  }

  function getTheme() {
    try {
      return localStorage.getItem(KEYS.theme) || DEFAULT_THEME;
    } catch (e) {
      return DEFAULT_THEME;
    }
  }

  function saveTheme(themeKey) {
    if (!THEMES[themeKey]) return false;
    try {
      localStorage.setItem(KEYS.theme, themeKey);
      applyTheme(themeKey);
      return true;
    } catch (e) {
      console.error('Store: failed to save theme', e);
      applyTheme(themeKey); // still preview it for this page view even if it can't persist
      return false;
    }
  }

  function applyTheme(themeKey) {
    if (global.IS_ADMIN_PAGE) return; // keep the admin panel's own look stable
    const theme = THEMES[themeKey] || THEMES[DEFAULT_THEME];
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  function getAuth() {
    try {
      const raw = localStorage.getItem(KEYS.auth);
      if (!raw) return { username: 'admin', password: 'Admin@123' };
      return JSON.parse(raw);
    } catch (e) {
      return { username: 'admin', password: 'Admin@123' };
    }
  }

  function saveAuth(auth) {
    try {
      localStorage.setItem(KEYS.auth, JSON.stringify(auth));
      return true;
    } catch (e) {
      console.error('Store: failed to save auth', e);
      return false;
    }
  }

  global.Store = {
    KEYS,
    THEMES,
    DEFAULT_THEME,
    DEFAULT_CONTENT,
    getContent,
    saveContent,
    resetContent,
    getTheme,
    saveTheme,
    applyTheme,
    getAuth,
    saveAuth,
    deepClone
  };

})(window);
