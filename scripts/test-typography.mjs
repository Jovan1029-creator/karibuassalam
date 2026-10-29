import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import postcss from 'postcss';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const css = postcss.parse(read('src/styles.css'));
const fonts = postcss.parse(read('src/fonts.css'));

// Inspect declarations across all matching rules, so a later component or
// breakpoint override cannot silently bring back a different type style.
function values(selector, property, tree = css) {
  const result = [];
  tree.walkRules(rule => {
    if (rule.selectors.includes(selector)) {
      rule.walkDecls(property, declaration => result.push(declaration.value));
    }
  });
  return result;
}

function assertValues(selector, property, expected) {
  const actual = values(selector, property);
  assert.ok(actual.length, `${selector} must declare ${property}`);
  assert.deepEqual([...new Set(actual)], [expected], `${selector}: ${property}`);
}

function declarations(node) {
  return Object.fromEntries(node.nodes.filter(n => n.type === 'decl').map(n => [n.prop, n.value]));
}

test('Peace Villages families and responsive size roles are shared sitewide', () => {
  const root = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === ':root'));
  const expected = {
    '--font-body': 'Inter, ui-sans-serif, system-ui, sans-serif',
    '--font-heading': '"Cormorant Garamond", Georgia, serif',
    '--text-body': '1rem',
    '--text-lead': 'clamp(1.05rem, 1.4vw, 1.3rem)',
    '--text-h1': 'clamp(2.5rem, 5.4vw, 5.75rem)',
    '--text-h2': 'clamp(2.5rem, 5.4vw, 5.75rem)',
    '--text-h3': 'clamp(1.65rem, 2.5vw, 2.35rem)',
    '--text-feature-title': 'clamp(1.9rem, 2.8vw, 3.2rem)',
    '--text-editorial-title': 'clamp(3rem, 5.5vw, 6.2rem)',
    '--text-editorial-body': 'clamp(1rem, 1.2vw, 1.15rem)',
    '--text-quote': 'clamp(1.75rem, 2.5vw, 2.8rem)',
    '--text-button': '0.75rem',
    '--text-nav': '0.74rem',
    '--text-eyebrow': '0.68rem',
    '--text-hero': 'clamp(3.1rem, 12.5vw, 5.25rem)',
  };
  for (const [property, value] of Object.entries(expected)) assert.equal(root[property], value, property);

  const responsive = {};
  css.walkAtRules('media', media => {
    media.walkRules(':root', rule => { responsive[media.params] = declarations(rule); });
  });
  assert.equal(responsive['(min-width: 1024px)']['--text-hero'], 'clamp(3.8rem, 5vw, 6rem)');
  assert.equal(responsive['(min-width: 1024px)']['--leading-hero'], '0.9');
  assert.equal(responsive['(max-width: 640px)']['--text-h2'], 'clamp(2.35rem, 11vw, 3.1rem)');
  assert.equal(responsive['(max-width: 640px)']['--text-editorial-title'], 'clamp(2.35rem, 11vw, 3.1rem)');
  assert.equal(responsive['(max-width: 640px)']['--leading-heading'], '0.98');
});

test('editorial titles are upright and do not retain old italic or heavy overrides', () => {
  for (const selector of ['h1', 'h2', 'h3', '.showcase-name', '.script-heading', '.hero-script']) {
    assertValues(selector, 'font-family', 'var(--font-heading)');
    assertValues(selector, 'font-weight', '600');
  }
  for (const selector of ['h1', 'h2', 'h3', '.showcase-name', '.landing-hero-copy h1 em']) {
    assertValues(selector, 'font-style', 'normal');
  }
  for (const selector of ['body', '.landing-hero-copy p', '.showcase-promise']) {
    assertValues(selector, 'font-weight', '400');
  }
  css.walkDecls('font-family', declaration => {
    assert.ok(['var(--font-body)', 'var(--font-heading)'].includes(declaration.value), declaration.toString());
  });
});

test('page, section, card and feature titles use the appropriate reference sizes', () => {
  const roles = {
    '--text-h1': ['h1'],
    '--text-h2': ['h2', '.script-heading', '.showcase-name', '.facilities-section h2', '.press-band h2'],
    '--text-h3': ['h3', '.amenity h3', '.circle-card h3', '.experience-card-body h3', '.volunteer-card h3', '.event-card h3', '.stay-option-body h3', '.hero-meta-title', '.happenings-more-card h3'],
    '--text-hero': ['.landing-hero-copy h1', '.hero-script', '.hero-slider-center-2026 .hero-script'],
    '--text-feature-title': ['.happenings-month-header h2', '.happenings-programme h3', '.happenings-later h2'],
    '--text-editorial-title': ['.retreat-editorial-copy h1'],
    '--text-editorial-body': ['.retreat-editorial-description'],
    '--text-quote': ['.guest-review-card blockquote p', '.retreat-editorial-lead'],
    '--text-lead': ['.lead', '.landing-hero-copy p', '.showcase-promise', '.set-intro p', '.cta-band-inner p', '.hero-slide-copy'],
  };
  for (const [token, selectors] of Object.entries(roles)) {
    for (const selector of selectors) assertValues(selector, 'font-size', `var(${token})`);
  }
  for (const selector of ['.landing-hero-copy h1', '.hero-script', '.hero-slider-center-2026 .hero-script']) {
    assertValues(selector, 'line-height', 'var(--leading-hero)');
  }
});

test('buttons, navigation and form controls use Inter with reference-sized CTA lettering', () => {
  for (const selector of ['button', 'input', 'textarea', 'select', '.btn', '.desktop-nav a', '.nav-dropdown-trigger']) {
    assertValues(selector, 'font-family', 'var(--font-body)');
  }
  for (const selector of ['.btn', '.btn-sm', '.btn-lg', '.nav-actions > .btn', '.stay-option-action']) {
    assertValues(selector, 'font-size', 'var(--text-button)');
  }
  assertValues('.btn', 'text-transform', 'uppercase');
  assertValues('.btn', 'letter-spacing', '0.08em');
  assertValues('.btn', 'min-height', '3.25rem');
  for (const selector of ['.desktop-nav a', '.nav-dropdown-trigger']) {
    assertValues(selector, 'font-size', 'var(--text-nav)');
    assertValues(selector, 'text-transform', 'uppercase');
    assertValues(selector, 'letter-spacing', '0.095em');
  }
  for (const selector of ['.eyebrow', '.landing-hero-eyebrow', '.hero-kicker']) {
    assertValues(selector, 'font-size', 'var(--text-eyebrow)');
    assertValues(selector, 'letter-spacing', '0.18em');
  }
});

test('Ramadan follows the reference split composition and stacks on smaller screens', () => {
  const base = css.clone();
  base.walkAtRules(rule => rule.remove());
  assert.deepEqual(values('.retreat-editorial-grid', 'grid-template-columns', base), ['minmax(0, 1fr)'], 'Default to a single column on phones and tablets');
  const desktop = css.nodes.find(n => n.type === 'atrule' && n.name === 'media' && n.params === '(min-width: 1024px)' && n.nodes.some(rule => rule.selector === '.retreat-editorial-grid'));
  assert.ok(desktop, 'Use two columns at the reference desktop breakpoint');
  assert.deepEqual(values('.retreat-editorial-grid', 'grid-template-columns', desktop), ['repeat(2, minmax(0, 1fr))']);
  assert.deepEqual(values('.retreat-editorial-grid', 'gap', desktop), ['4rem']);
  assert.deepEqual(values('.retreat-editorial-photo', 'min-height', desktop), ['42rem']);
  assertValues('.retreat-editorial-copy', 'justify-content', 'center');
  assertValues('.retreat-editorial-copy h1', 'line-height', '0.91');
  assertValues('.retreat-editorial-copy h1', 'letter-spacing', '-0.045em');
  assertValues('.retreat-editorial-lead', 'font-family', 'var(--font-heading)');
  assertValues('.retreat-editorial-lead', 'line-height', '1.08');
  assertValues('.retreat-editorial-description', 'line-height', '1.8');
  const phone = css.nodes.find(n => n.type === 'atrule' && n.name === 'media' && n.params === '(max-width: 700px)' && n.nodes.some(rule => rule.selector === '.retreat-editorial-actions'));
  assert.ok(phone, 'Stack the enquiry actions and facts on phones');
  for (const [selector, property, value] of [
    ['.retreat-detail-editorial .retreat-facts-strip', 'grid-template-columns', 'minmax(0, 1fr)'],
    ['.retreat-editorial-actions', 'flex-direction', 'column'],
  ]) assert.deepEqual(values(selector, property, phone), [value], `${selector}: ${property}`);
  css.walkRules(rule => {
    if (rule.selector.includes('.retreat-editorial-copy') || rule.selector.includes('.retreat-editorial-description')) {
      for (const declaration of rule.nodes.filter(n => n.type === 'decl')) {
        assert.ok(!['height', 'max-height', '-webkit-line-clamp', 'position', 'order'].includes(declaration.prop), 'Keep all translated text in normal flow without truncation or absolute positioning');
      }
    }
  });
});

test('local WOFF2 subsets are valid and cover English, German and Turkish', () => {
  const faces = [];
  fonts.walkAtRules('font-face', rule => faces.push(declarations(rule)));
  assert.equal(faces.length, 4);
  assert.equal(new Set(faces.map(face => face.src)).size, 4);
  for (const family of ['Inter', "'Cormorant Garamond'"]) {
    const subsets = faces.filter(face => face['font-family'] === family);
    assert.equal(subsets.length, 2);
    for (const face of subsets) {
      assert.equal(face['font-display'], 'swap');
      assert.equal(face['font-style'], 'normal');
      assert.equal(face['font-weight'], family === 'Inter' ? '100 900' : '400 700');
      const file = face.src.match(/url\('([^']+)'\)/)?.[1];
      assert.match(file, /^\/fonts\/[a-z-]+\.woff2$/);
      const binary = readFileSync(new URL(`../public${file}`, import.meta.url));
      assert.equal(binary.subarray(0, 4).toString(), 'wOF2');
      assert.equal(binary.readUInt32BE(8), binary.length, 'WOFF2 header length must match the downloaded file');
      assert.ok(binary.length > 1000, 'Not an empty asset or HTML error response');
    }
    const covers = codepoint => subsets.some(face => face['unicode-range'].split(',').some(range => {
      const [start, end = start] = range.trim().slice(2).split('-').map(value => parseInt(value, 16));
      return codepoint >= start && codepoint <= end;
    }));
    for (const character of 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzÄÖÜäöüßÇçĞğİıÖöŞşÜü') {
      assert.ok(covers(character.codePointAt(0)), `${family} must cover ${character}`);
    }
  }
  for (const file of ['Inter-OFL.txt', 'CormorantGaramond-OFL.txt']) {
    assert.match(read(`public/fonts/${file}`), /SIL OPEN FONT LICENSE Version 1\.1/);
  }
});

test('both Latin fonts are preloaded and no third-party font request is required', () => {
  const html = read('index.html');
  for (const file of ['inter-latin.woff2', 'cormorant-garamond-latin.woff2']) {
    assert.ok(html.includes(`rel="preload" href="/fonts/${file}" as="font" type="font/woff2" crossorigin`));
  }
  assert.doesNotMatch(html, /fonts\.(googleapis|gstatic)\.com/);
  assert.doesNotMatch(read('src/fonts.css'), /https?:\/\//);
  assert.ok(css.nodes.some(n => n.type === 'atrule' && n.name === 'import' && n.params === '"./fonts.css"'));
});
