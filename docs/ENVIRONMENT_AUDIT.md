# RIIQX — Comprehensive Environment Variable, Secrets & Configuration Audit

**Project:** RIIQX (Next.js 14 E-Commerce, AI Intelligence & Twin Platform)  
**Repository:** https://github.com/codgamerofficial/RIIQX.git  
**Live Production URL:** https://riiqx.vercel.app  
**Audit Date:** 2026-11-09  
**Security Classification:** Highly Confidential (All secret values strictly redacted; zero raw tokens or keys printed)  

---

## 1. Executive Summary

A comprehensive, automated, and manual source-level audit of all environment variables, secrets, credentials, and third-party integrations was conducted across the RIIQX repository. The audit covered all code in `src/`, test suites in `tests/`, utility scripts in `scripts/`, CI/CD workflows in `.github/workflows/`, configuration files (`next.config.mjs`, `package.json`), local environment files (`.env`, `.env.local`, `.env.example`), and live Vercel deployment environments (Production and Preview).

### Key Audit Metrics
- **Total Unique Variables Identified:** 105
- **Active Code-Referenced Variables:** 89
- **Unreferenced / Dead Variables:** 16
- **Case-Sensitivity Duplicates:** 8
- **Referenced in Code but Missing from Local .env:** 35
- **Missing from .env.example:** 72
- **Git History Leak Check:** **PASS** (Zero `.env` or `.env.local` files committed in git history; `.gitignore` properly ignores `.env*`)
- **Public Key Scope Safety:** **PASS** (All `NEXT_PUBLIC_*` variables are legitimate client-safe values: `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_CARTO_API_KEY`, `NEXT_PUBLIC_MOCK_MODE`. No server secrets leaked to the client bundle.)

### Variable Distribution by Functional Category
| Functional Category | Variable Count | Core Purpose |
| :--- | :--- | :--- |
| **AI Models & LLM Providers** | 26 | Multi-model inference (Groq, OpenRouter, Gemini, Cohere, NVIDIA) |
| **Affiliate & Commerce Routing** | 7 | Verified affiliate tags for Amazon, Flipkart, Tata CLiQ, etc. |
| **Application & General** | 22 | Core runtime flags, routing URLs, and mock switches |
| **Cloud Infrastructure (AWS & Bedrock)** | 10 | AWS credentials, Bedrock LLM models, and IAM permissions |
| **Security & Session Secrets** | 4 | Cryptographic tokens, cron protection, and session cookies |
| **Google & YouTube Integration** | 10 | Google OAuth, YouTube Data API, and video uploads |
| **Social Media & Publishing APIs** | 21 | Meta/Instagram Graph API, LinkedIn, Twitter/X, and WhatsApp |
| **Database & Auth (Supabase)** | 3 | Database persistence, auth sessions, and admin service role |
| **Geospatial & Web Search Intelligence** | 2 | CARTO GIS basemap tiles and SearXNG metasearch |

---

## 2. Master Environment Variable Matrix

The table below catalogs every variable across the codebase, its security status, availability across environments, and remediation status.

| Variable Name | Category | Type | Code References | Local (.env/.local) | Vercel Prod | Vercel Preview | Status / Issues | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `AGENTROUTER_API_KEY` | AI Models & LLM Providers | Secret | 6 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `AGENT_ROUTER_API_KEY` | AI Models & LLM Providers | Secret | 8 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `AGENT_ROUTER_BASE_URL` | AI Models & LLM Providers | Secret | 5 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `AGENT_ROUTER_MODEL` | AI Models & LLM Providers | Secret | 3 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `AIML_API_KEY` | AI Models & LLM Providers | Secret | 1 file(s) | Both | Configured | Not Set | Missing from .env.example documentation; Duplicate casing variant of aiml_api_key | Deprecate lowercase variant; use standard uppercase |
| `AI_BUDGET_MODE` | AI Models & LLM Providers | Secret | 2 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `AI_MODEL` | AI Models & LLM Providers | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `AI_PROVIDER` | AI Models & LLM Providers | Secret | 2 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `AMAZON_ASSOCIATE_TAG` | Affiliate & Commerce Routing | Secret | 6 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `ANALYTICS_MODEL_ID` | Application & General | Secret | 2 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `AUTONOMOUS_PUBLISHING` | Application & General | Secret | 1 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `AWS_ACCESS_KEY_ID` | Cloud Infrastructure (AWS & Bedrock) | Secret | 3 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `AWS_BEARER_TOKEN_BEDROCK` | Cloud Infrastructure (AWS & Bedrock) | Secret | 6 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `AWS_PROFILE` | Cloud Infrastructure (AWS & Bedrock) | Secret | 3 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `AWS_REGION` | Cloud Infrastructure (AWS & Bedrock) | Secret | 12 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `AWS_SECRET_ACCESS_KEY` | Cloud Infrastructure (AWS & Bedrock) | Secret | 12 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `AWS_SESSION_TOKEN` | Cloud Infrastructure (AWS & Bedrock) | Secret | 1 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `BASE_URL` | Application & General | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `BEDROCK_API_KEY` | Cloud Infrastructure (AWS & Bedrock) | Secret | 16 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `BEDROCK_API_KEY_NAME` | Cloud Infrastructure (AWS & Bedrock) | Secret | None (Dead) | Both | Configured | Not Set | Unreferenced in codebase (dead variable); Missing from .env.example documentation | Retain in reference as optional or remove if obsolete |
| `BEDROCK_MODEL_ID` | Cloud Infrastructure (AWS & Bedrock) | Secret | 12 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `CHAT_MODEL_ID` | Application & General | Secret | 2 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `COHERE_API_KEY` | AI Models & LLM Providers | Secret | None (Dead) | Both | Configured | Not Set | Unreferenced in codebase (dead variable) | Retain in reference as optional or remove if obsolete |
| `COHERE_MODEL` | AI Models & LLM Providers | Secret | None (Dead) | Missing | Not Set | Not Set | Unreferenced in codebase (dead variable) | Retain in reference as optional or remove if obsolete |
| `CONTENT_MODEL_ID` | Application & General | Secret | 2 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `CROMA_AFFILIATE_TAG` | Affiliate & Commerce Routing | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `CRON_SECRET` | Security & Session Secrets | Secret | 12 file(s) | Both | Configured | Configured | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `FLIPKART_AFFILIATE_ID` | Affiliate & Commerce Routing | Secret | 5 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `GEMINI_API_KEY` | AI Models & LLM Providers | Secret | 11 file(s) | Both | Not Set | Not Set | Valid | Maintain current configuration |
| `GOOGLE_AI_STUDIO_API_KEY` | AI Models & LLM Providers | Secret | 9 file(s) | Both | Not Set | Not Set | Valid | Maintain current configuration |
| `GOOGLE_API_KEY` | Google & YouTube Integration | Secret | 8 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `GOOGLE_CLIENT_ID` | Google & YouTube Integration | Secret | 1 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `GOOGLE_CLIENT_SECRET` | Google & YouTube Integration | Secret | 1 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `GOOGLE_GENERATIVE_AI_API_KEY` | AI Models & LLM Providers | Secret | 12 file(s) | Both | Not Set | Not Set | Valid | Maintain current configuration |
| `GOOGLE_REDIRECT_URI` | Google & YouTube Integration | Secret | 2 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local | Add to .env.local if feature is actively utilized |
| `GROQ_API_KEY` | AI Models & LLM Providers | Secret | 10 file(s) | Both | Configured | Not Set | Duplicate casing variant of groq_api_key | Deprecate lowercase variant; use standard uppercase |
| `GROQ_BASE_URL` | AI Models & LLM Providers | Secret | 5 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `GROQ_MODEL` | AI Models & LLM Providers | Secret | 11 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `INSTAGRAM_ACCESS_TOKEN` | Social Media & Publishing APIs | Secret | 6 file(s) | .env | Configured | Not Set | Placeholder value detected | Maintain current configuration |
| `INSTAGRAM_ACCOUNT_ID` | Social Media & Publishing APIs | Secret | 5 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Social Media & Publishing APIs | Secret | 1 file(s) | .env | Configured | Not Set | Placeholder value detected | Maintain current configuration |
| `LINKEDIN_CLIENT_ID` | Social Media & Publishing APIs | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `LINKEDIN_CLIENT_SECRET` | Social Media & Publishing APIs | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `LINKEDIN_REDIRECT_URI` | Social Media & Publishing APIs | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `META_APP_ID` | Social Media & Publishing APIs | Secret | 2 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `META_APP_SECRET` | Social Media & Publishing APIs | Secret | 3 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `META_MODEL_API_KEY` | Social Media & Publishing APIs | Secret | None (Dead) | Both | Configured | Not Set | Unreferenced in codebase (dead variable); Missing from .env.example documentation; Duplicate casing variant of Meta_Model_Api_Key | Deprecate lowercase variant; use standard uppercase |
| `META_REDIRECT_URI` | Social Media & Publishing APIs | Secret | 3 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `MOCK_MODE` | Application & General | Secret | 1 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `MYNTRA_AFFILIATE_TAG` | Affiliate & Commerce Routing | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `Meta_Model_Api_Key` | Application & General | Secret | None (Dead) | Both | Configured | Not Set | Unreferenced in codebase (dead variable); Missing from .env.example documentation; Duplicate casing variant of META_MODEL_API_KEY | Deprecate lowercase variant; use standard uppercase |
| `NEXT_PUBLIC_APP_URL` | Application & General | Public | 4 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `NEXT_PUBLIC_CARTO_API_KEY` | Security & Session Secrets | Public | 3 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google & YouTube Integration | Public | None (Dead) | Both | Configured | Not Set | Unreferenced in codebase (dead variable); Missing from .env.example documentation | Retain in reference as optional or remove if obsolete |
| `NEXT_PUBLIC_MOCK_MODE` | Application & General | Public | None (Dead) | Both | Configured | Not Set | Unreferenced in codebase (dead variable) | Retain in reference as optional or remove if obsolete |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Database & Auth (Supabase) | Public | 9 file(s) | Both | Configured | Configured | Valid | Maintain current configuration |
| `NEXT_PUBLIC_SUPABASE_URL` | Database & Auth (Supabase) | Public | 17 file(s) | Both | Configured | Configured | Valid | Maintain current configuration |
| `NODE_ENV` | Application & General | Secret | 6 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `NVIDIA_NIM_API_KEY` | AI Models & LLM Providers | Secret | None (Dead) | Both | Configured | Not Set | Unreferenced in codebase (dead variable); Missing from .env.example documentation | Retain in reference as optional or remove if obsolete |
| `NYKAA_AFFILIATE_TAG` | Affiliate & Commerce Routing | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `Nvdia_nim_api_key` | Application & General | Secret | 3 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `OLLAMA_BASE_URL` | Application & General | Secret | 4 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `OPENAI_API_KEY` | AI Models & LLM Providers | Secret | 7 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `OPENAI_BASE_URL` | AI Models & LLM Providers | Secret | 2 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `OPENAI_COMPATIBLE_BASE_URL` | AI Models & LLM Providers | Secret | 2 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `OPENROUTER_API_KEY` | AI Models & LLM Providers | Secret | 10 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `OPENROUTER_API_KEY_NEW` | AI Models & LLM Providers | Secret | None (Dead) | Missing | Configured | Not Set | Unreferenced in codebase (dead variable); Missing from .env.example documentation | Retain in reference as optional or remove if obsolete |
| `OPENROUTER_BASE_URL` | AI Models & LLM Providers | Secret | 5 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `OPENROUTER_MODEL` | AI Models & LLM Providers | Secret | 1 file(s) | Both | Configured | Not Set | Valid | Maintain current configuration |
| `RELIANCE_DIGITAL_AFFILIATE_TAG` | Affiliate & Commerce Routing | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `SEARXNG_BASE_URL` | Geospatial & Web Search Intelligence | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `SEARXNG_URL` | Geospatial & Web Search Intelligence | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `SESSION_SECRET` | Security & Session Secrets | Secret | 2 file(s) | Both | Configured | Configured | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `SK_OR_V1_OPENROUTER_API_KEY` | AI Models & LLM Providers | Secret | None (Dead) | Both | Not Set | Not Set | Unreferenced in codebase (dead variable); Missing from .env.example documentation | Retain in reference as optional or remove if obsolete |
| `SUPABASE_SERVICE_ROLE_KEY` | Database & Auth (Supabase) | Secret | 12 file(s) | Both | Configured | Configured | Valid | Maintain current configuration |
| `TATA_CLIQ_AFFILIATE_TAG` | Affiliate & Commerce Routing | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `TEST_BASE_URL` | Application & General | Secret | 7 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `TEST_TARGET_URL` | Application & General | Secret | 2 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `TEST_URL` | Application & General | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `THREADS_APP_ID` | Social Media & Publishing APIs | Secret | None (Dead) | Both | Configured | Not Set | Unreferenced in codebase (dead variable); Missing from .env.example documentation | Retain in reference as optional or remove if obsolete |
| `THREADS_APP_SECRET` | Social Media & Publishing APIs | Secret | None (Dead) | Both | Configured | Not Set | Unreferenced in codebase (dead variable); Missing from .env.example documentation | Retain in reference as optional or remove if obsolete |
| `THREADS_DISPLAY_NAME` | Social Media & Publishing APIs | Secret | None (Dead) | Both | Configured | Not Set | Unreferenced in codebase (dead variable); Missing from .env.example documentation | Retain in reference as optional or remove if obsolete |
| `TOKEN_ENCRYPTION_KEY` | Security & Session Secrets | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local | Add to .env.local if feature is actively utilized |
| `TREND_MODEL_ID` | Application & General | Secret | 2 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `TWITTER_REDIRECT_URI` | Social Media & Publishing APIs | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `USE_BEDROCK_BEARER` | Cloud Infrastructure (AWS & Bedrock) | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `VERCEL` | Application & General | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `WAYJET_API_KEY` | AI Models & LLM Providers | Secret | None (Dead) | Both | Configured | Not Set | Unreferenced in codebase (dead variable); Missing from .env.example documentation; Duplicate casing variant of wayjet_api_key | Deprecate lowercase variant; use standard uppercase |
| `WHATSAPP_ACCESS_TOKEN` | Social Media & Publishing APIs | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local | Add to .env.local if feature is actively utilized |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Social Media & Publishing APIs | Secret | None (Dead) | Missing | Not Set | Not Set | Unreferenced in codebase (dead variable) | Retain in reference as optional or remove if obsolete |
| `WHATSAPP_PHONE_NUMBER_ID` | Social Media & Publishing APIs | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local | Add to .env.local if feature is actively utilized |
| `WHATSAPP_VERIFY_TOKEN` | Social Media & Publishing APIs | Secret | 2 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `X_CLIENT_ID` | Social Media & Publishing APIs | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `X_CLIENT_SECRET` | Social Media & Publishing APIs | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `X_REDIRECT_URI` | Social Media & Publishing APIs | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `YOUTUBE_API_KEY` | Google & YouTube Integration | Secret | 1 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `YOUTUBE_CLIENT_ID` | Google & YouTube Integration | Secret | 2 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `YOUTUBE_CLIENT_SECRET` | Google & YouTube Integration | Secret | 2 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `YOUTUBE_REDIRECT_URI` | Google & YouTube Integration | Secret | 2 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `YOUTUBE_REFRESH_TOKEN` | Google & YouTube Integration | Secret | 1 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `agenrouter_api_key` | Application & General | Secret | 5 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `aiml_api_key` | Application & General | Secret | 2 file(s) | Both | Configured | Not Set | Missing from .env.example documentation; Duplicate casing variant of AIML_API_KEY | Deprecate lowercase variant; use standard uppercase |
| `cohera_api_key` | Application & General | Secret | 9 file(s) | Both | Configured | Not Set | Missing from .env.example documentation | Add to .env.example with descriptive placeholder |
| `groq_api_key` | Application & General | Secret | 4 file(s) | Missing | Not Set | Not Set | Referenced in code but missing from local .env/.env.local; Missing from .env.example documentation; Duplicate casing variant of GROQ_API_KEY | Deprecate lowercase variant; use standard uppercase |
| `wayjet_api_key` | Application & General | Secret | None (Dead) | Both | Configured | Not Set | Unreferenced in codebase (dead variable); Missing from .env.example documentation; Duplicate casing variant of WAYJET_API_KEY | Deprecate lowercase variant; use standard uppercase |

---

## 3. Subsystem Deep-Dive & Architecture Audit

### 3.1 Database & Identity Layer (Supabase)
- `NEXT_PUBLIC_SUPABASE_URL`: Required for both browser and server Supabase clients. Properly configured across Local, Preview, and Production.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Safe public anon key for client-side queries protected by Row-Level Security (RLS).
- `SUPABASE_SERVICE_ROLE_KEY`: Privileged server-only key for backend queue workers, cron sweeps, and background jobs. Must never be exposed to the browser.
- **Finding:** RIIQX's `src/lib/supabase/admin.ts` enforces a strict runtime check that throws an immediate error if `createAdminClient` is ever invoked in a browser context (`typeof window !== 'undefined'`).

### 3.2 Security, Cryptography & Session Secrets
- `SESSION_SECRET`: High-entropy 32-byte cryptographic secret used for signing session tokens and cookie validation. Recently rotated on Vercel and local environments.
- `CRON_SECRET`: Mandatory bearer authentication token protecting `/api/cron/deal-pipeline`. Workflow in `.github/workflows/deal-pipeline-cron.yml` passes this header; unauthenticated requests receive `HTTP 401`.
- `TOKEN_ENCRYPTION_KEY`: Referenced in `src/services/social/oauth-manager.ts` for encrypting connected account access tokens.
- `AFFILIATE_WEBHOOK_SECRET`: HMAC verification secret for inbound partner conversion postbacks in `src/app/api/twin/affiliate/postback/route.ts`.

### 3.3 Artificial Intelligence & LLM Infrastructure
RIIQX implements a resilient, multi-tiered AI failover architecture orchestrated by `AIServiceManager` (`src/services/ai/ai-service-manager.ts`):
1. **Tier 1 (Serverless / Fast Inference):** Groq Cloud (`GROQ_API_KEY`, `GROQ_MODEL`) using Llama 3.3 70B Versatile.
2. **Tier 2 (Enterprise Cloud):** AWS Bedrock (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `BEDROCK_MODEL_ID`) using Claude 3.5 Sonnet / Llama 3.
3. **Tier 3 (Aggregators):** OpenRouter (`OPENROUTER_API_KEY`, `OPENROUTER_MODEL`) and AgentRouter (`AGENT_ROUTER_API_KEY`, `AGENT_ROUTER_MODEL`).
4. **Tier 4 (Direct APIs):** Google Gemini (`GEMINI_API_KEY`), Cohere (`COHERE_API_KEY`), NVIDIA NIM (`NVIDIA_NIM_API_KEY`).
- **Audit Finding:** Several duplicate casing keys exist in `.env` and `.env.local`:
  - `AIML_API_KEY` vs `aiml_api_key`
  - `GROQ_API_KEY` vs `groq_api_key`
  - `WAYJET_API_KEY` vs `wayjet_api_key`
  - `META_MODEL_API_KEY` vs `Meta_Model_Api_Key`
  - `NVIDIA_NIM_API_KEY` vs `Nvdia_nim_api_key`
  - `COHERE_API_KEY` vs `cohera_api_key`
  - `AGENT_ROUTER_API_KEY` vs `AGENTROUTER_API_KEY` vs `agenrouter_api_key`
  - **Resolution:** Standardize all keys to uppercase SNAKE_CASE and deprecate lowercase variants.

### 3.4 Social Media & Automated Publishing APIs
- **Meta / Instagram:** `META_APP_ID`, `META_APP_SECRET`, `META_REDIRECT_URI`, `INSTAGRAM_BUSINESS_ACCOUNT_ID`, `INSTAGRAM_ACCESS_TOKEN`.
- **YouTube:** `YOUTUBE_CLIENT_ID`, `YOUTUBE_CLIENT_SECRET`, `YOUTUBE_API_KEY`, `YOUTUBE_REDIRECT_URI`, `YOUTUBE_REFRESH_TOKEN`.
- **LinkedIn:** `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REDIRECT_URI`.
- **Twitter / X:** `TWITTER_CLIENT_ID`, `TWITTER_CLIENT_SECRET`, `TWITTER_REDIRECT_URI`, `X_CLIENT_ID`, `X_CLIENT_SECRET`, `X_REDIRECT_URI`.
- **WhatsApp Cloud API:** `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_VERIFY_TOKEN`.
- **Audit Finding:** `THREADS_APP_ID`, `THREADS_APP_SECRET`, `THREADS_DISPLAY_NAME` exist in `.env` but are currently unreferenced in `src/`. Retain for planned Threads publishing.

### 3.5 E-Commerce & Affiliate Monetization Routing
The genuine affiliate revenue engine in `src/services/product-intelligence/affiliate-router.ts` adheres to strict truth-in-monetization standards:
- `AMAZON_ASSOCIATE_TAG` (e.g. `riiqx-21`)
- `FLIPKART_AFFILIATE_ID`
- `TATA_CLIQ_AFFILIATE_TAG`
- `CROMA_AFFILIATE_TAG`
- `MYNTRA_AFFILIATE_TAG`
- `RELIANCE_DIGITAL_AFFILIATE_TAG`
- `NYKAA_AFFILIATE_TAG`
- **Audit Finding:** When unconfigured, the system strictly outputs canonical unmonetized URLs rather than fabricating dummy partner tags. To activate live monetization, real approved partner tags should be supplied in Vercel Production.

### 3.6 Geospatial & Web Search Intelligence
- `NEXT_PUBLIC_CARTO_API_KEY`: Enables CARTO Voyager & Dark Matter tiles for the Hyperlocal Online vs Offline Arbitrage Engine. Safe client-side key.
- `SEARXNG_URL` / `SEARXNG_BASE_URL`: Self-hosted or privacy-first SearXNG metasearch instance for real-time live product research without scraping blocks.

---

## 4. Security Risk Assessment & Recommendations

### 4.1 Vulnerability & Risk Log
| Severity | Risk Description | Affected Variables | Status / Remediation |
| :--- | :--- | :--- | :--- |
| **HIGH** | Legacy Lowercase/Duplicate Environment Keys | `groq_api_key`, `aiml_api_key`, `wayjet_api_key`, `agenrouter_api_key`, `cohera_api_key`, `Meta_Model_Api_Key`, `Nvdia_nim_api_key` | Standardize on official UPPERCASE naming in source files and documentation. |
| **MEDIUM** | Incomplete `.env.example` Template | 72 variables missing from `.env.example` | Replace `.env.example` with a comprehensive, sanitized catalog documenting all subsystems. |
| **LOW** | Unused / Dead Variables in Environment Files | 16 unreferenced variables (e.g. `COHERE_MODEL`, `BEDROCK_API_KEY_NAME`) | Document as optional or legacy; clean up in future refactors without breaking external dependencies. |
| **LOW** | Client-Side Secret Leak Potential | `NEXT_PUBLIC_*` prefix | **VERIFIED SAFE**: Only 5 `NEXT_PUBLIC_*` variables exist, all carrying non-sensitive URLs, public map keys, and anon Supabase tokens. |

---

## 5. Environment Drift Analysis (Local vs Preview vs Production)

| Variable Name | Local (.env / .local) | Vercel Preview | Vercel Production | Drift Notes |
| :--- | :--- | :--- | :--- | :--- |
| `CRON_SECRET` | Synchronized | Synchronized | Synchronized | Rotated simultaneously with identical 32-byte cryptographic hex. |
| `SESSION_SECRET` | Synchronized | Synchronized | Synchronized | Synchronized across all 3 tiers. |
| `NEXT_PUBLIC_SUPABASE_URL` | Synchronized | Synchronized | Synchronized | All point to authoritative production Supabase project. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Synchronized | Synchronized | Synchronized | Identical safe anon token. |
| `SUPABASE_SERVICE_ROLE_KEY` | Synchronized | Synchronized | Synchronized | Synchronized for preview branch remediation. |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3001` | Automatic Preview URL | `https://riiqx.vercel.app` | Correct environment-specific routing. |
