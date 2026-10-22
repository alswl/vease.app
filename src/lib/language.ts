const translations: Record<string, string> = {
  'nav-tag': 'macOS · Apple Silicon · Beta access open',
  'hero-eyebrow': 'Applications for beta access are open',
  'hero-title': 'AI video editing<br><span class="grad">travel footage to vlog</span>',
  'hero-sub': 'Turn a travel footage folder into a <strong>one-minute video</strong>. AI creates the shot log, outline, and rough cut. You can step in at every stage; nothing moves forward until you approve it.',
  'hero-download': 'Download for macOS',
  'hero-note': 'macOS Apple Silicon · ZIP or DMG',
  'hero-req': 'All you need is an Apple Silicon Mac. Python, ffmpeg, and rendering tools are included.',
  'workflow-kicker': 'Workflow', 'workflow-title': 'Six steps from footage to finished video',
  'workflow-desc': 'AI works first at every stage. Review the result, give feedback, and approve before moving on. Changes are recorded and can be undone.',
  'step1-title': 'Import footage', 'step1-desc': 'Drop in a travel footage folder to create proxies and shot-level clips. Original files remain read-only.',
  'step2-title': 'AI shot logging', 'step2-desc': 'Each shot gets a description, tags, and quality score. Speech is transcribed and searchable.',
  'step3-title': 'Create an outline', 'step3-desc': 'AI proposes a story outline: what to keep, cut, and reorder. Edit it and approve before continuing.',
  'step4-title': 'AI rough cut', 'step4-desc': 'AI creates several candidate storylines. Preview each one and choose your favorite.',
  'step5-title': 'Revise with feedback', 'step5-desc': 'Tell AI what to change. It edits only that part, with a reason recorded for every revision.',
  'step6-title': 'Export', 'step6-desc': 'Render the approved video with consistent loudness, ready to share. Built-in rendering handles captions and titles.',
  'shots-kicker': 'The real interface', 'shots-title': 'A look at the beta app',
  'shot1-step': 'Steps 01–02 · Import footage / AI shot logging',
  'shot2-step': 'Steps 04–05 · AI rough cut / Revise with feedback',
  'shot1-alt': 'Project browser importing footage, with AI shot logging progress',
  'shot1-caption': 'Drop in a footage folder to begin. AI adds descriptions and tags to each clip, with live progress.',
  'shot2-alt': 'Rough-cut workspace with outline and clips, a visual storyline, feedback, and inspector',
  'shot2-caption': 'Give feedback on any part of the AI storyline. AI revises only the section you mention.',
  'highlights-kicker': 'Highlights', 'highlights-title': 'A complete editing workflow in one app',
  'highlights-desc': 'No command line or developer setup required.',
  'feature1-title': 'AI director included', 'feature1-desc': 'The director runs in the app and can only use controlled editing actions. Every step is visible in real time.',
  'feature2-title': 'Your originals stay on your Mac', 'feature2-desc': 'Footage is processed locally. AI features send only the analysis data they need.',
  'feature3-title': 'Ready on a clean Mac', 'feature3-desc': 'Python, ffmpeg, the rendering engine, and AI runtime are included in the download.',
  'feature4-title': 'Private beta', 'feature4-desc': 'Access is by invitation. Your feedback during the beta will shape what comes next.',
  'download-title': 'Make your next trip a vlog', 'download-desc': 'Import footage, review an AI cut, make a few edits, and export.',
  'footer-copy': '© 2026 Vease · AI edits, you stay in control · Private beta',
};

const chinese = new Map<string, string>();

export function setLanguage(language: 'zh-CN' | 'en'): void {
  document.documentElement.lang = language;
  document.documentElement.dataset.language = language;
  document.querySelectorAll<HTMLElement>('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n!;
    if (!chinese.has(key)) chinese.set(key, element.innerHTML);
    element.innerHTML = language === 'en' ? translations[key] ?? chinese.get(key)! : chinese.get(key)!;
  });
  document.querySelectorAll<HTMLElement>('[data-i18n-alt]').forEach(element => {
    const key = element.dataset.i18nAlt!;
    const baseAlt = element.dataset.baseAlt ?? element.getAttribute('alt') ?? '';
    element.dataset.baseAlt = baseAlt;
    element.setAttribute('alt', language === 'en' ? translations[key] ?? baseAlt : baseAlt);
  });
  document.querySelector<HTMLButtonElement>('[data-language-toggle]')?.replaceChildren(document.createTextNode(language === 'en' ? '中文' : 'English'));
  const toggle = document.querySelector<HTMLButtonElement>('[data-language-toggle]');
  toggle?.setAttribute('aria-label', language === 'en' ? '切换语言' : 'Switch language');
  window.dispatchEvent(new CustomEvent('languagechange', { detail: language }));
  localStorage.setItem('vease-language', language);
}

export function initializeLanguage(): void {
  const toggle = document.querySelector<HTMLButtonElement>('[data-language-toggle]');
  toggle?.addEventListener('click', () => setLanguage(document.documentElement.lang === 'en' ? 'zh-CN' : 'en'));
  const saved = localStorage.getItem('vease-language');
  setLanguage(saved === 'en' ? 'en' : 'zh-CN');
}
