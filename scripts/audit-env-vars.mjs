import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 1. Gather all files referencing process.env
let grepOutput = '';
try {
  grepOutput = execSync('git grep -n -E "process\\.env\\.[A-Za-z0-9_]+" src/ tests/ scripts/ .github/ next.config.mjs', { encoding: 'utf-8' });
} catch (e) {
  grepOutput = e.stdout || '';
}

const codeRefs = new Map();
grepOutput.split('\n').forEach(line => {
  const match = line.match(/^([^:]+):(\d+):.*process\.env\.([A-Za-z0-9_]+)/);
  if (match) {
    const [, file, lineNo, varName] = match;
    if (!codeRefs.has(varName)) {
      codeRefs.set(varName, []);
    }
    codeRefs.get(varName).push(`${file}:${lineNo}`);
  }
});

// Also check for import.meta.env
let metaGrepOutput = '';
try {
  metaGrepOutput = execSync('git grep -n -E "import\\.meta\\.env\\.[A-Za-z0-9_]+"', { encoding: 'utf-8' });
} catch (e) {
  metaGrepOutput = e.stdout || '';
}
metaGrepOutput.split('\n').forEach(line => {
  const match = line.match(/^([^:]+):(\d+):.*import\.meta\.env\.([A-Za-z0-9_]+)/);
  if (match) {
    const [, file, lineNo, varName] = match;
    if (!codeRefs.has(varName)) codeRefs.set(varName, []);
    codeRefs.get(varName).push(`${file}:${lineNo}`);
  }
});

// Read environment files
function parseEnvKeys(filePath) {
  if (!fs.existsSync(filePath)) return new Set();
  const content = fs.readFileSync(filePath, 'utf-8');
  const keys = new Set();
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        keys.add(trimmed.slice(0, eqIdx).trim());
      }
    }
  });
  return keys;
}

function parseEnvValuesCategorized(filePath) {
  if (!fs.existsSync(filePath)) return new Map();
  const content = fs.readFileSync(filePath, 'utf-8');
  const map = new Map();
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        const rawVal = trimmed.slice(eqIdx + 1).trim();
        const isPlaceholder = !rawVal || rawVal.includes('your-') || rawVal.includes('placeholder') || rawVal.includes('example') || rawVal.includes('mock');
        const isEmpty = !rawVal;
        map.set(key, { isPlaceholder, isEmpty, length: rawVal.length });
      }
    }
  });
  return map;
}

const envKeys = parseEnvKeys('.env');
const envValues = parseEnvValuesCategorized('.env');
const envLocalKeys = parseEnvKeys('.env.local');
const envLocalValues = parseEnvValuesCategorized('.env.local');
const envExampleKeys = parseEnvKeys('.env.example');

// Vercel env keys
let vercelProdKeys = new Set();
let vercelPreviewKeys = new Set();
try {
  const vercelEnvOutput = execSync('npx vercel env ls', { encoding: 'utf-8' });
  vercelEnvOutput.split('\n').forEach(line => {
    const parts = line.trim().split(/\s{2,}/);
    if (parts.length >= 3 && parts[1] === 'Encrypted') {
      const name = parts[0].trim();
      const env = parts[2].trim();
      if (env.includes('Production')) vercelProdKeys.add(name);
      if (env.includes('Preview')) vercelPreviewKeys.add(name);
    }
  });
} catch (e) {
  // Ignored
}

// GitHub Actions secrets
const ghWorkflowContent = fs.existsSync('.github/workflows/deal-pipeline-cron.yml')
  ? fs.readFileSync('.github/workflows/deal-pipeline-cron.yml', 'utf-8')
  : '';
const ghSecrets = new Set();
const ghSecretMatches = ghWorkflowContent.matchAll(/secrets\.([A-Za-z0-9_]+)/g);
for (const m of ghSecretMatches) {
  ghSecrets.add(m[1]);
}

// Master list of all unique variable names
const allVarNames = new Set([
  ...codeRefs.keys(),
  ...envKeys,
  ...envLocalKeys,
  ...envExampleKeys,
  ...vercelProdKeys,
  ...vercelPreviewKeys
]);

const report = [];

for (const name of Array.from(allVarNames).sort()) {
  const isPublic = name.startsWith('NEXT_PUBLIC_');
  const refs = codeRefs.get(name) || [];
  const inEnv = envKeys.has(name);
  const inEnvLocal = envLocalKeys.has(name);
  const inEnvExample = envExampleKeys.has(name);
  const inVercelProd = vercelProdKeys.has(name);
  const inVercelPreview = vercelPreviewKeys.has(name);
  const inGhSecrets = ghSecrets.has(name);

  const envValMeta = envValues.get(name) || envLocalValues.get(name);
  const isPlaceholder = envValMeta?.isPlaceholder || false;
  const isEmpty = envValMeta?.isEmpty || false;

  let category = 'Application & General';
  if (name.includes('SUPABASE')) category = 'Database & Auth (Supabase)';
  else if (name.includes('AWS') || name.includes('BEDROCK')) category = 'Cloud Infrastructure (AWS & Bedrock)';
  else if (name.includes('OPENAI') || name.includes('GROQ') || name.includes('OPENROUTER') || name.includes('AIML') || name.includes('NVIDIA') || name.includes('COHERE') || name.includes('AGENT_ROUTER') || name.includes('AGENTROUTER') || name.includes('GEMINI') || name.includes('WAYJET') || name.includes('AI_')) category = 'AI Models & LLM Providers';
  else if (name.includes('GOOGLE') || name.includes('YOUTUBE')) category = 'Google & YouTube Integration';
  else if (name.includes('META') || name.includes('INSTAGRAM') || name.includes('THREADS') || name.includes('WHATSAPP') || name.includes('LINKEDIN') || name.includes('TWITTER') || name.includes('X_')) category = 'Social Media & Publishing APIs';
  else if (name.includes('AFFILIATE') || name.includes('AMAZON_') || name.includes('FLIPKART_') || name.includes('TATA_CLIQ_') || name.includes('CROMA_') || name.includes('MYNTRA_') || name.includes('RELIANCE_') || name.includes('NYKAA_')) category = 'Affiliate & Commerce Routing';
  else if (name.includes('SECRET') || name.includes('TOKEN') || name.includes('KEY')) category = 'Security & Session Secrets';
  else if (name.includes('CARTO') || name.includes('SEARXNG')) category = 'Geospatial & Web Search Intelligence';

  let status = 'Configured';
  let misconfigured = false;
  const issues = [];

  if (refs.length === 0) {
    issues.push('Unreferenced in codebase (dead variable)');
  }
  if (!inEnv && !inEnvLocal && refs.length > 0) {
    issues.push('Referenced in code but missing from local .env/.env.local');
  }
  if (isPlaceholder) {
    issues.push('Placeholder value detected');
  }
  if (!inEnvExample) {
    issues.push('Missing from .env.example documentation');
  }
  // Check for casing duplicates
  const lowerName = name.toLowerCase();
  const duplicates = Array.from(allVarNames).filter(n => n !== name && n.toLowerCase() === lowerName);
  if (duplicates.length > 0) {
    issues.push(`Duplicate casing variant of ${duplicates.join(', ')}`);
    misconfigured = true;
  }

  report.push({
    name,
    category,
    isPublic,
    isSecret: !isPublic,
    referencedFiles: refs,
    inEnv,
    inEnvLocal,
    inEnvExample,
    inVercelProd,
    inVercelPreview,
    inGhSecrets,
    isPlaceholder,
    isEmpty,
    issues,
  });
}

fs.writeFileSync('scripts/env-audit-results.json', JSON.stringify(report, null, 2));
console.log(`Audited ${report.length} environment variables. Results written to scripts/env-audit-results.json.`);
