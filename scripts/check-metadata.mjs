#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const repoOwner = 'itdojp';
const repoName = 'evidence-based-engineering-book';
const repoFullName = `${repoOwner}/${repoName}`;
const githubUrl = `https://github.com/${repoFullName}`;
const issuesUrl = `${githubUrl}/issues`;
const pagesUrl = `https://${repoOwner}.github.io/${repoName}/`;
const siteUrl = `https://${repoOwner}.github.io`;
const baseUrl = `/${repoName}`;
const expectedLicense = 'CC-BY-NC-SA-4.0';
const expectedLicenseText = 'CC BY-NC-SA 4.0';

const failures = [];

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function readJson(filePath) {
  try {
    return JSON.parse(readText(filePath));
  } catch (error) {
    fail(`${filePath}: JSONを解析できません: ${error.message}`);
    return {};
  }
}

function fail(message) {
  failures.push(message);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    fail(`${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assertNoDuplicates(values, label) {
  const seen = new Set();
  const duplicates = [];
  for (const value of values) {
    if (seen.has(value) && !duplicates.includes(value)) {
      duplicates.push(value);
    }
    seen.add(value);
  }
  if (duplicates.length > 0) {
    fail(`${label}: duplicate entries ${JSON.stringify(duplicates)}`);
  }
}

function assertArraySetEqual(actual, expected, label) {
  assertNoDuplicates(actual, `${label} actual`);
  assertNoDuplicates(expected, `${label} expected`);
  const actualSet = [...new Set(actual)].sort();
  const expectedSet = [...new Set(expected)].sort();
  if (actualSet.length !== expectedSet.length || actualSet.some((value, index) => value !== expectedSet[index])) {
    fail(`${label}: expected set ${JSON.stringify(expectedSet)}, got ${JSON.stringify(actualSet)}`);
  }
}

function assertArrayEqual(actual, expected, label) {
  assertNoDuplicates(actual, `${label} actual`);
  assertNoDuplicates(expected, `${label} expected`);
  if (actual.length !== expected.length || actual.some((value, index) => value !== expected[index])) {
    fail(`${label}: expected ordered list ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function parseScalarMap(text) {
  const values = {};
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      continue;
    }
    const [, key, rawValue] = match;
    let value = rawValue.trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    values[key] = value;
  }
  return values;
}

function parseFrontMatter(filePath) {
  const text = readText(filePath);
  const match = text.match(/^---\r?\n([\s\S]*?)(?:\r?\n---)(?:\r?\n|$)/);
  if (!match) {
    fail(`${filePath}: YAML front matterが見つかりません`);
    return {};
  }
  return parseScalarMap(match[1]);
}

function normalizeRepositoryUrl(rawUrl) {
  if (typeof rawUrl !== 'string') {
    return '';
  }
  const trimmed = rawUrl.trim().replace(/\/+$/, '').replace(/\.git$/, '');
  try {
    const parsed = new URL(trimmed);
    const parts = parsed.pathname.split('/').filter(Boolean);
    if (parsed.hostname !== 'github.com' || parts.length !== 2) {
      return trimmed;
    }
    return `https://github.com/${parts[0]}/${parts[1]}`;
  } catch {
    return trimmed;
  }
}

function listContentIds(rootDir) {
  return fs.readdirSync(rootDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => fs.existsSync(path.join(rootDir, id, 'index.md')))
    .sort();
}

function collectMarkdownLinks(filePath, prefix) {
  const text = readText(filePath);
  const ids = [];
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
  for (const match of text.matchAll(linkPattern)) {
    const href = match[1];
    if (!href.startsWith(prefix)) {
      continue;
    }
    const [, id] = href.slice(prefix.length).match(/^([^/#)]+)/) || [];
    if (id) {
      ids.push(id);
    }
  }
  return ids;
}

function collectNavigationIds(filePath, section, prefix) {
  const lines = readText(filePath).split(/\r?\n/);
  const sectionStart = lines.findIndex((line) => line.trim() === `${section}:`);
  if (sectionStart < 0) {
    fail(`${filePath}: ${section} sectionが見つかりません`);
    return [];
  }

  const ids = [];
  for (const line of lines.slice(sectionStart + 1)) {
    if (/^\S/.test(line) && line.trim() !== '' && !line.trim().startsWith('#')) {
      break;
    }
    const pathMatch = line.match(/path:\s*["']?([^"'\s]+)["']?/);
    if (!pathMatch) {
      continue;
    }
    const navPath = pathMatch[1];
    if (!navPath.startsWith(prefix)) {
      continue;
    }
    const [, id] = navPath.slice(prefix.length).match(/^([^/]+)/) || [];
    if (id) {
      ids.push(id);
    }
  }
  return ids;
}

const bookConfig = readJson('book-config.json');
const packageJson = readJson('package.json');
const packageLock = readJson('package-lock.json');
const rootConfig = parseScalarMap(readText('_config.yml'));
const docsConfig = parseScalarMap(readText('docs/_config.yml'));
const docsIndex = parseFrontMatter('docs/index.md');

assertEqual(packageJson.name, repoName, 'package.json name');
assertEqual(packageJson.version, bookConfig.version, 'package.json version');
assertEqual(packageJson.description, bookConfig.description, 'package.json description');
assertEqual(packageJson.author, bookConfig.author, 'package.json author');
assertEqual(packageJson.license, expectedLicense, 'package.json license');
assertEqual(normalizeRepositoryUrl(packageJson.repository?.url), githubUrl, 'package.json repository.url');
assertEqual(packageJson.homepage, pagesUrl, 'package.json homepage');
assertEqual(packageJson.bugs?.url, issuesUrl, 'package.json bugs.url');
assertEqual(packageJson.scripts?.['check:metadata'], 'node scripts/check-metadata.mjs', 'package.json scripts.check:metadata');

assertEqual(packageLock.name, packageJson.name, 'package-lock.json name');
assertEqual(packageLock.version, packageJson.version, 'package-lock.json version');
assertEqual(packageLock.packages?.['']?.name, packageJson.name, 'package-lock root package name');
assertEqual(packageLock.packages?.['']?.version, packageJson.version, 'package-lock root package version');
assertEqual(packageLock.packages?.['']?.license, packageJson.license, 'package-lock root package license');

for (const [label, config] of [
  ['_config.yml', rootConfig],
  ['docs/_config.yml', docsConfig],
]) {
  assertEqual(config.title, bookConfig.title, `${label} title`);
  assertEqual(config.description, bookConfig.description, `${label} description`);
  assertEqual(config.author, bookConfig.author, `${label} author`);
  assertEqual(config.version, bookConfig.version, `${label} version`);
  assertEqual(config.lang, 'ja', `${label} lang`);
  assertEqual(config.url, siteUrl, `${label} url`);
  assertEqual(config.baseurl, baseUrl, `${label} baseurl`);
  assertEqual(normalizeRepositoryUrl(config.repository), githubUrl, `${label} repository`);
  assertEqual(config.license_text, expectedLicenseText, `${label} license_text`);
}

assertEqual(docsIndex.title, bookConfig.title, 'docs/index.md front matter title');
assertEqual(docsIndex.description, bookConfig.description, 'docs/index.md front matter description');
assertEqual(docsIndex.author, bookConfig.author, 'docs/index.md front matter author');
assertEqual(docsIndex.version, bookConfig.version, 'docs/index.md front matter version');
assertEqual(docsIndex.layout, 'book', 'docs/index.md front matter layout');

const configuredChapterIds = (bookConfig.structure?.chapters || []).map((item) => item.id);
const configuredAppendixIds = (bookConfig.structure?.appendices || []).map((item) => item.id);
assertArraySetEqual(configuredChapterIds, listContentIds('docs/chapters'), 'book-config chapters vs docs/chapters');
assertArraySetEqual(configuredAppendixIds, listContentIds('docs/appendices'), 'book-config appendices vs docs/appendices');
assertArrayEqual(collectMarkdownLinks('docs/index.md', 'chapters/'), configuredChapterIds, 'docs/index.md chapter links vs book-config chapters');
assertArrayEqual(collectMarkdownLinks('docs/index.md', 'appendices/'), configuredAppendixIds, 'docs/index.md appendix links vs book-config appendices');
assertArrayEqual(collectNavigationIds('docs/_data/navigation.yml', 'chapters', '/chapters/'), configuredChapterIds, 'navigation chapter order vs book-config chapters');
assertArrayEqual(collectNavigationIds('docs/_data/navigation.yml', 'appendices', '/appendices/'), configuredAppendixIds, 'navigation appendix order vs book-config appendices');

if (failures.length > 0) {
  console.error('Metadata consistency check failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Metadata consistency check passed for ${repoFullName} ${bookConfig.version}.`);
