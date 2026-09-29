import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSync } from 'rolldown/utils';

export const root = fileURLToPath(new URL('../', import.meta.url));
const contentKeys = new Set('title text label linkLabel duration promise alt question answer shortPromise subtitle heading copy intro locationText durationText priceText inclusionHeading notIncluded itineraryIntro stayHeading stayCopy foodHeading foodTags bookingCopy bookingCta ctaText days start price bring languages description imageAlt facts features highlights bullets inclusions points includedItems stayFeatures foodCopy options included'.split(' '));
const attributes = new Set('title subtitle eyebrow alt imageAlt aria-label aria-roledescription placeholder description label'.split(' '));
const files = [];
function walkDirectory(dir) {
  for (const item of fs.readdirSync(dir, {withFileTypes:true})) {
    const file = path.join(dir, item.name);
    if (item.isDirectory() && item.name !== 'translations') walkDirectory(file);
    else if (/\.(jsx|js)$/.test(file) && !/[/\\](i18n|phraseTranslations)\.js$/.test(file)) files.push(file);
  }
}
walkDirectory(path.join(root, 'src'));

export function collectCatalog() {
  const wanted = new Map();
  const rawJsx = [];
  function add(text, file) {
    if (typeof text !== 'string' || !/[A-Za-z]/.test(text) || /^(https?:|mailto:|tel:|[./])/.test(text)) return;
    if (!wanted.has(text)) wanted.set(text, path.relative(root, file));
  }
  for (const file of files) {
    const source = fs.readFileSync(file, 'utf8');
    const ast = parseSync(file, source).program;
    function walk(node, relevant = false, parent) {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'JSXText') {
        const value = node.value.replace(/\s+/g, ' ').trim();
        add(value, file);
        if (/[A-Za-z]/.test(value)) rawJsx.push({text:value, file:path.relative(root,file), tag:parent?.openingElement?.name?.name});
      }
      if (node.type === 'Literal' && relevant) add(node.value, file);
      if (node.type === 'JSXAttribute') relevant = attributes.has(node.name.name);
      if (node.type === 'Property') relevant = contentKeys.has(node.key.name || node.key.value)
        || (relevant && node.key.name === 'message');
      if (node.type === 'VariableDeclarator' && (/Languages$/.test(node.id?.name || '')
        || ['timing', 'nextAction', 'category'].includes(node.id?.name))) relevant = true;
      if (node.type === 'AssignmentExpression' && ['errors', 'nextErrors'].includes(node.left?.object?.name)) {
        walk(node.right, true, node);
        return;
      }
      if (node.type === 'ConditionalExpression') {
        walk(node.test, false, node);
        walk(node.consequent, relevant, node);
        walk(node.alternate, relevant, node);
        return;
      }
      if (node.type === 'CallExpression' && ['tx', 'setStatus', 'setNotice'].includes(node.callee?.name)) {
        walk(node.arguments[0], true, node);
        return;
      }
      for (const [key,value] of Object.entries(node)) {
        if (['key','id','name'].includes(key)) continue;
        if (Array.isArray(value)) value.forEach(child => walk(child, relevant, node));
        else if (value && typeof value === 'object') walk(value, relevant, node);
      }
    }
    walk(ast);
  }
  return { wanted, rawJsx };
}
