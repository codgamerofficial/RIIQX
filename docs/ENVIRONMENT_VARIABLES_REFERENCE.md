# RIIQX — Master Environment Variables & Secrets Reference Manual

**Platform:** RIIQX (Next.js 14 E-Commerce, Multi-Modal AI Twin & Autonomous Intelligence Platform)  
**Security Classification:** Public Reference / Sanitized  
**Notice:** This document contains zero live credentials or private tokens. All values provided are syntax examples or placeholder templates.

---

## Table of Contents
1. [Security Rules & Best Practices](#1-security-rules--best-practices)
2. [Database & Identity (Supabase)](#2-database--identity-supabase)
3. [Core Security, Cryptography & Session Secrets](#3-core-security-cryptography--session-secrets)
4. [Artificial Intelligence & Multi-Model LLM Providers](#4-artificial-intelligence--multi-model-llm-providers)
5. [Social Media Publishing & Connected Accounts](#5-social-media-publishing--connected-accounts)
6. [Cloud Storage, Media & AWS Bedrock Infrastructure](#6-cloud-storage-media--aws-bedrock-infrastructure)
7. [Affiliate Monetization & Retailer Integration](#7-affiliate-monetization--retailer-integration)
8. [Geospatial Mapping & Web Search Intelligence](#8-geospatial-mapping--web-search-intelligence)
9. [Application Routing & Runtime Flags](#9-application-routing--runtime-flags)
10. [Setup Checklist for Developers](#10-setup-checklist-for-developers)

---

## 1. Security Rules & Best Practices

1. **Never Commit Secrets:** `.env`, `.env.local`, and private credentials must never be staged or committed to Git. `.gitignore` must enforce this.
2. **Client-Side vs. Server-Side Scope:** Only variables prefixed with `NEXT_PUBLIC_` are injected into client-side browser bundles. Never prefix API keys, service role tokens, or session secrets with `NEXT_PUBLIC_`.
3. **Secret Rotation Protocol:** In the event of an accidental exposure or security audit, immediately rotate credentials at the provider dashboard, update Vercel Environment Variables, and redeploy.
4. **Standard Casing:** All environment variables must use uppercase `SNAKE_CASE`.

---

## 2. Database & Identity (Supabase)

Supabase PostgreSQL is the authoritative datastore and identity provider for RIIQX.

| Variable Name | Required | Scope | Format / Type | Description & Fallback |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Client & Server | URL (`https://*.supabase.co`) | The canonical HTTPS endpoint for your Supabase project. Required for database queries, storage, and authentication. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Client & Server | JWT String | Public anonymous key with permissions strictly governed by PostgreSQL Row-Level Security (RLS) policies. |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** (Server) | Server-Only | JWT String | Administrative master key bypassing RLS. Used exclusively in server-side workers, cron sweeps, and background queues. |

### How to Acquire:
1. Navigate to [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project and open **Project Settings > API**.
3. Copy **Project URL**, **anon/public** key, and **service_role** key.

---

## 3. Core Security, Cryptography & Session Secrets

| Variable Name | Required | Scope | Format / Type | Description & Fallback |
| :--- | :--- | :--- | :--- | :--- |
| `SESSION_SECRET` | **Yes** | Server-Only | 64-char Hex String | 32-byte cryptographic entropy for signing HTTP-only session cookies and verifying server-side authentication state. |
| `CRON_SECRET` | **Yes** | Server-Only | 64-char Hex String | Bearer authorization token used by GitHub Actions / external cron schedulers to trigger protected API routes like `/api/cron/deal-pipeline`. |
| `TOKEN_ENCRYPTION_KEY` | **Yes** | Server-Only | 64-char Hex String | AES-256-GCM symmetric encryption key for encrypting OAuth tokens in `connected_accounts` table. |
| `AFFILIATE_WEBHOOK_SECRET` | Optional | Server-Only | String | HMAC secret for verifying incoming partner conversion postbacks. |

### Generation Command:
```bash
# Generate 32-byte random cryptographic hex strings
openssl rand -hex 32
```

---

## 4. Artificial Intelligence & Multi-Model LLM Providers

RIIQX features an enterprise-grade multi-tiered AI failover manager (`AIServiceManager`).

| Variable Name | Provider | Required | Format / Model | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GROQ_API_KEY` | Groq Cloud | Recommended (Fast) | `gsk_...` | Ultra-fast LPU inference for real-time price intelligence and decision summaries. |
| `GROQ_MODEL` | Groq Cloud | Optional | String (e.g. `llama-3.3-70b-versatile`) | Primary Groq model ID. |
| `OPENROUTER_API_KEY` | OpenRouter | Recommended | `sk-or-v1-...` | Unified API aggregator providing access to Claude, GPT-4o, and open-weights models. |
| `OPENROUTER_MODEL` | OpenRouter | Optional | String | Model target (e.g. `meta-llama/llama-3.3-70b-instruct`). |
| `GEMINI_API_KEY` | Google AI Studio | Recommended | `AIzaSy...` | Google Gemini API key for multimodal vision, OCR receipt scanning, and product analysis. |
| `COHERE_API_KEY` | Cohere | Optional | String | Cohere Command R+ and embedding models for semantic product matching. |
| `NVIDIA_NIM_API_KEY` | NVIDIA NIM | Optional | `nvapi-...` | High-throughput GPU inference for specialized deep learning and vision tasks. |
| `AIML_API_KEY` | AI/ML API | Optional | String | Secondary AI aggregator fallback. |
| `AGENT_ROUTER_API_KEY` | AgentRouter | Optional | String | Multi-agent autonomous workflow router. |
| `WAYJET_API_KEY` | WayJet | Optional | String | Auxiliary text generation and automation endpoint. |

---

## 5. Social Media Publishing & Connected Accounts

Governs autonomous and one-click social media distribution to Instagram, YouTube, LinkedIn, X (Twitter), and WhatsApp.

### 5.1 Google & YouTube
| Variable Name | Required | Description |
| :--- | :--- | :--- |
| `GOOGLE_CLIENT_ID` | For YouTube | Google Cloud OAuth 2.0 Web Client ID |
| `GOOGLE_CLIENT_SECRET` | For YouTube | Google Cloud OAuth 2.0 Web Client Secret |
| `GOOGLE_REDIRECT_URI` | For YouTube | Callback URL: `http://localhost:3001/api/social/oauth/callback/youtube` |
| `YOUTUBE_API_KEY` | Optional | YouTube Data API v3 public server key |

### 5.2 Meta (Instagram & Facebook)
| Variable Name | Required | Description |
| :--- | :--- | :--- |
| `META_APP_ID` | For Instagram | Meta for Developers App ID |
| `META_APP_SECRET` | For Instagram | Meta for Developers App Secret |
| `META_REDIRECT_URI` | For Instagram | Callback URL: `http://localhost:3001/api/social/oauth/callback/meta` |
| `INSTAGRAM_BUSINESS_ACCOUNT_ID` | Optional | Default Instagram Business Account ID for system publishing |
| `INSTAGRAM_ACCESS_TOKEN` | Optional | Long-lived System User access token for server-side direct publishing |

### 5.3 LinkedIn & Twitter/X
| Variable Name | Required | Description |
| :--- | :--- | :--- |
| `LINKEDIN_CLIENT_ID` | For LinkedIn | LinkedIn Developer App Client ID |
| `LINKEDIN_CLIENT_SECRET` | For LinkedIn | LinkedIn Developer App Client Secret |
| `LINKEDIN_REDIRECT_URI` | For LinkedIn | Callback URL: `http://localhost:3001/api/social/oauth/callback/linkedin` |
| `TWITTER_CLIENT_ID` / `X_CLIENT_ID` | For Twitter | Twitter Developer Portal OAuth 2.0 Client ID |
| `TWITTER_CLIENT_SECRET` / `X_CLIENT_SECRET` | For Twitter | Twitter Developer Portal OAuth 2.0 Client Secret |
| `TWITTER_REDIRECT_URI` / `X_REDIRECT_URI` | For Twitter | Callback URL: `http://localhost:3001/api/social/oauth/callback/twitter` |

### 5.4 WhatsApp Cloud API
| Variable Name | Required | Description |
| :--- | :--- | :--- |
| `WHATSAPP_PHONE_NUMBER_ID` | For WhatsApp | Cloud API Verified Phone Number ID |
| `WHATSAPP_BUSINESS_ACCOUNT_ID`| For WhatsApp | WhatsApp Business Account (WABA) ID |
| `WHATSAPP_ACCESS_TOKEN` | For WhatsApp | Permanent System User access token with `whatsapp_business_messaging` |

---

## 6. Cloud Storage, Media & AWS Bedrock Infrastructure

| Variable Name | Scope | Description |
| :--- | :--- | :--- |
| `AWS_REGION` | Server | AWS Region for Bedrock and S3 (default: `ap-southeast-2`) |
| `AWS_ACCESS_KEY_ID` | Server | IAM user access key with Bedrock and S3 access |
| `AWS_SECRET_ACCESS_KEY` | Server | IAM user secret access key |
| `BEDROCK_MODEL_ID` | Server | Amazon Bedrock Model identifier (e.g. `au.anthropic.claude-sonnet-4-6`) |
| `FAL_KEY` | Server | Fal.ai API key for fast video rendering |
| `LUMA_API_KEY` | Server | Luma Dream Machine API for cinematic AI video generation |
| `RUNWAY_API_SECRET` | Server | Runway Gen-3 Alpha API for high-definition video synthesis |

---

## 7. Affiliate Monetization & Retailer Integration

The RIIQX Genuine Affiliate Engine strictly routes verified products through approved publisher accounts. When unconfigured, it safely outputs clean canonical URLs.

| Variable Name | Merchant Target | Example Format | Notes |
| :--- | :--- | :--- | :--- |
| `AMAZON_ASSOCIATE_TAG` | Amazon India | `riiqx-21` | Appends `tag=riiqx-21` to Amazon PDP links |
| `FLIPKART_AFFILIATE_ID` | Flipkart | `aff_riiqx` | Appends `affid=...` parameter |
| `TATA_CLIQ_AFFILIATE_TAG` | Tata CLiQ | String | Approved publisher ID |
| `CROMA_AFFILIATE_TAG` | Croma Retail | String | Approved publisher ID |
| `MYNTRA_AFFILIATE_TAG` | Myntra Fashion | String | Approved publisher ID |
| `RELIANCE_DIGITAL_AFFILIATE_TAG` | Reliance Digital | String | Approved publisher ID |
| `NYKAA_AFFILIATE_TAG` | Nykaa Beauty | String | Approved publisher ID |

---

## 8. Geospatial Mapping & Web Search Intelligence

| Variable Name | Scope | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_CARTO_API_KEY` | Client | CARTO Vector tile & GIS key for local store radius mapping. Safe public key. |
| `SEARXNG_URL` / `SEARXNG_BASE_URL` | Server | URL of self-hosted SearXNG metasearch instance for anti-bot bypass live product verification. |

---

## 9. Application Routing & Runtime Flags

| Variable Name | Default / Example | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3001` | Canonical base URL used for absolute redirects, metadata, and OAuth callbacks. |
| `NODE_ENV` | `development` | Node runtime environment (`development`, `test`, `production`). |
| `PORT` | `3001` | Local development server port. |
| `MOCK_MODE` | `false` | Set to `true` to simulate third-party API responses during offline unit tests. |
| `NEXT_PUBLIC_MOCK_MODE` | `false` | Browser-accessible mirror of mock switch for frontend demo workflows. |
| `AUTONOMOUS_PUBLISHING` | `true` | Enables or disables background social media distribution. |

---

## 10. Setup Checklist for Developers

1. **Clone Repository & Branch:**
   ```bash
   git clone https://github.com/codgamerofficial/RIIQX.git
   cd RIIQX
   ```
2. **Create Local Configuration:**
   ```bash
   cp .env.example .env.local
   ```
3. **Populate Core Secrets:**
   - Supply `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - Run `openssl rand -hex 32` to generate `SESSION_SECRET`, `CRON_SECRET`, and `TOKEN_ENCRYPTION_KEY`.
   - Add at least one AI inference key (e.g. `GROQ_API_KEY` or `GEMINI_API_KEY`).
4. **Install & Run:**
   ```bash
   npm install
   npm run dev
   ```
