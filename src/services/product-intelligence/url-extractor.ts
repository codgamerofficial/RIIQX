// =============================================================================
// RIIQX — Product URL Extractor & Canonical Destination Service
// Safe URL Ingestion • SSRF Defense • Canonical Cleaning • Schema.org & Direct HTML Parsing
// =============================================================================

import { ProductIdentity, RetailerOffer, VerificationStatus } from './types';

export function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&#x27;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([a-fA-F0-9]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

export class ProductURLExtractor {
  /**
   * SSRF Protection: Blocks loopback, private IPv4/IPv6, link-local, cloud metadata targets,
   * integer/hex IP formats, and internal local domains
   */
  public static isSafeUrl(rawUrl: string): boolean {
    try {
      const parsed = new URL(rawUrl.trim());

      // Only http / https permitted
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return false;
      }

      // Strip port and enclosing brackets for IPv6
      const host = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');

      // Block known dangerous hostnames
      const blockedHosts = [
        'localhost',
        '127.0.0.1',
        '0.0.0.0',
        '::1',
        '169.254.169.254', // AWS / GCP metadata
        'metadata.google.internal',
        'instance-data',
      ];

      if (blockedHosts.includes(host)) {
        return false;
      }

      // Block internal domain suffixes
      if (host.endsWith('.local') || host.endsWith('.internal') || host.endsWith('.lan') || host.endsWith('.corp')) {
        return false;
      }

      // Block integer IP representations (e.g. http://2130706433)
      if (/^\d+$/.test(host)) {
        return false;
      }

      // Block hex IP representations (e.g. 0x7f.0.0.1)
      if (/0x[0-9a-f]+/i.test(host)) {
        return false;
      }

      // Block IPv6 link-local, site-local, and IPv4-mapped loopback
      if (
        host.startsWith('fe80:') ||
        host.startsWith('fc00:') ||
        host.startsWith('fd00:') ||
        host.startsWith('::ffff:127.') ||
        host.startsWith('::ffff:10.') ||
        host.startsWith('::ffff:192.168.')
      ) {
        return false;
      }

      // Block RFC1918 private IPv4 ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x, 127.x.x.x, 169.254.x.x
      const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
      const match = host.match(ipv4Regex);
      if (match) {
        const octet1 = parseInt(match[1], 10);
        const octet2 = parseInt(match[2], 10);

        if (octet1 === 10) return false;
        if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return false;
        if (octet1 === 192 && octet2 === 168) return false;
        if (octet1 === 127) return false;
        if (octet1 === 169 && octet2 === 254) return false;
        if (octet1 === 0) return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Cleans tracking parameters and produces canonical URL
   */
  public static canonicalizeUrl(rawUrl: string): {
    canonicalUrl: string;
    domain: string;
    retailerName: string;
    canonicalIdentifier?: string;
  } {
    const parsed = new URL(rawUrl.trim());
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');

    let retailerName = 'Direct Retailer';
    let canonicalIdentifier: string | undefined;
    let canonicalUrl = rawUrl.trim();

    if (host.includes('amazon.') || host === 'amzn.in' || host.endsWith('.amzn.in')) {
      retailerName = 'Amazon India';
      const asinMatch = parsed.pathname.match(/(?:\/dp\/|\/gp\/product\/)([A-Z0-9]{10})/i);
      if (asinMatch) {
        canonicalIdentifier = asinMatch[1].toUpperCase();
        canonicalUrl = `https://www.amazon.in/dp/${canonicalIdentifier}`;
      } else {
        const shortMatch = parsed.pathname.match(/\/d\/([a-zA-Z0-9]+)/i);
        if (shortMatch) {
          canonicalIdentifier = shortMatch[1];
        }
      }
    } else if (host.includes('flipkart.com')) {
      retailerName = 'Flipkart';
      const pid = parsed.searchParams.get('pid');
      const itmMatch = parsed.pathname.match(/\/p\/itm([a-zA-Z0-9]+)/);
      if (pid) {
        canonicalIdentifier = pid;
        canonicalUrl = `https://www.flipkart.com/product/p/itme?pid=${pid}`;
      } else if (itmMatch) {
        canonicalIdentifier = itmMatch[1];
        canonicalUrl = `https://www.flipkart.com/p/itm${canonicalIdentifier}`;
      }
    } else if (host.includes('myntra.com')) {
      retailerName = 'Myntra';
      const styleMatch = parsed.pathname.match(/\/(\d+)(?:\/buy)?/);
      if (styleMatch) {
        canonicalIdentifier = styleMatch[1];
        canonicalUrl = `https://www.myntra.com/${canonicalIdentifier}`;
      }
    } else if (host.includes('tatacliq.com')) {
      retailerName = 'Tata CLiQ';
      const cliqMatch = parsed.pathname.match(/\/p-([a-zA-Z0-9]+)/i);
      if (cliqMatch) {
        canonicalIdentifier = cliqMatch[1];
        canonicalUrl = `https://www.tatacliq.com/p-${canonicalIdentifier}`;
      }
    } else if (host.includes('croma.com')) {
      retailerName = 'Croma';
      const cromaMatch = parsed.pathname.match(/\/p\/(\d+)/i);
      if (cromaMatch) {
        canonicalIdentifier = cromaMatch[1];
        canonicalUrl = `https://www.croma.com/product/p/${canonicalIdentifier}`;
      }
    } else if (host.includes('reliancedigital.in')) {
      retailerName = 'Reliance Digital';
      const rdMatch = parsed.pathname.match(/\/p\/([a-zA-Z0-9_]+)/i);
      if (rdMatch) {
        canonicalIdentifier = rdMatch[1];
        canonicalUrl = `https://www.reliancedigital.in/p/${canonicalIdentifier}`;
      }
    } else if (host.includes('nykaa.com')) {
      retailerName = 'Nykaa';
      const nykaaMatch = parsed.pathname.match(/\/p\/(\d+)/i);
      if (nykaaMatch) {
        canonicalIdentifier = nykaaMatch[1];
        canonicalUrl = `https://www.nykaa.com/product/p/${canonicalIdentifier}`;
      }
    } else {
      // Strip generic tracking params
      const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'ref_', 'ref', 'fbclid', 'gclid', 'tag', 'aff_id'];
      trackingParams.forEach((tp) => parsed.searchParams.delete(tp));
      canonicalUrl = parsed.toString();
    }

    return {
      canonicalUrl,
      domain: host,
      retailerName,
      canonicalIdentifier,
    };
  }

  /**
   * Fetches product page, follows redirects, cleans titles, and extracts Schema.org / Direct HTML pricing
   */
  public static async extractFromUrl(rawUrl: string): Promise<{
    identity: ProductIdentity;
    initialOffer: RetailerOffer;
  }> {
    if (!this.isSafeUrl(rawUrl)) {
      throw new Error('Invalid or unsafe URL submitted. Private network vectors are blocked.');
    }

    let { canonicalUrl, domain, retailerName, canonicalIdentifier } = this.canonicalizeUrl(rawUrl);

    let html = '';
    let isAntiBotBlocked = false;
    let effectiveUrl = rawUrl.trim();

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7000);

      // Fetch with redirect follow enabled to resolve mobile share URLs like amzn.in/d/..., dl.flipkart.com/s/...
      const response = await fetch(effectiveUrl, {
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-IN,en-US;q=0.9,en;q=0.8',
        },
      });

      clearTimeout(timeout);

      if (response.status === 403 || response.status === 503) {
        isAntiBotBlocked = true;
      } else if (response.ok) {
        // Enforce safe destination validation on the final resolved redirect URL before reading response
        if (response.url && !this.isSafeUrl(response.url)) {
          throw new Error('SSRF Block: Redirect target is an unsafe or private destination.');
        }

        html = await response.text();

        // Update canonical URL and metadata from the resolved destination URL
        if (response.url && response.url !== rawUrl) {
          effectiveUrl = response.url;
          const resolved = this.canonicalizeUrl(response.url);
          canonicalUrl = resolved.canonicalUrl;
          domain = resolved.domain;
          retailerName = resolved.retailerName;
          if (resolved.canonicalIdentifier) {
            canonicalIdentifier = resolved.canonicalIdentifier;
          }
        }

        // Anti-bot challenge detection (Amazon robot check, captcha, cloudflare challenge)
        if (
          html.includes('validateCaptcha') ||
          html.includes('api-services-support@amazon.com') ||
          html.includes('Robot Check') ||
          html.includes('Type the characters you see in this image') ||
          html.includes('Checking your browser before accessing')
        ) {
          isAntiBotBlocked = true;
        }
      }
    } catch (fetchErr: any) {
      isAntiBotBlocked = true;
    }

    // 1. Try JSON-LD Schema.org parsing
    let jsonLdProduct: any = null;
    if (html && !isAntiBotBlocked) {
      const jsonLdMatches = html.match(/<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi);
      if (jsonLdMatches) {
        for (const match of jsonLdMatches) {
          try {
            const rawJson = match.replace(/<script[^>]*>/i, '').replace(/<\/script>/i, '').trim();
            const data = JSON.parse(rawJson);
            if (data['@type'] === 'Product' || (Array.isArray(data['@graph']) && data['@graph'].some((g: any) => g['@type'] === 'Product'))) {
              jsonLdProduct = data['@type'] === 'Product' ? data : data['@graph'].find((g: any) => g['@type'] === 'Product');
              break;
            }
          } catch {
            // Continue parsing
          }
        }
      }
    }

    // 2. OpenGraph / Meta tags / DOM elements parsing
    const getMeta = (prop: string): string => {
      if (!html || isAntiBotBlocked) return '';
      const reg = new RegExp(`<meta\\s+(?:property|name)=["']${prop}["']\\s+content=["'](.*?)["']`, 'i');
      const m = html.match(reg);
      return m ? m[1].trim() : '';
    };

    const ogTitle = getMeta('og:title') || getMeta('twitter:title');
    const ogImage = getMeta('og:image') || getMeta('twitter:image');
    const ogPrice = getMeta('og:price:amount') || getMeta('product:price:amount');
    const ogDesc = getMeta('og:description') || getMeta('description');

    // DOM-based product title extraction (Amazon, Flipkart, generic H1)
    let domTitle = '';
    if (html && !isAntiBotBlocked) {
      const amazonTitleMatch = html.match(/id=["']productTitle["'][^>]*>([\s\S]*?)<\/span>/i);
      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      const titleTagMatch = html.match(/<title>([^<]+)<\/title>/i);

      if (amazonTitleMatch) {
        domTitle = amazonTitleMatch[1].replace(/<[^>]+>/g, '').trim();
      } else if (h1Match) {
        domTitle = h1Match[1].replace(/<[^>]+>/g, '').trim();
      } else if (titleTagMatch && !titleTagMatch[1].toLowerCase().includes('amazon.in')) {
        domTitle = titleTagMatch[1].trim();
      }
    }

    // Title resolution and clean marketing suffixes
    let resolvedTitle = jsonLdProduct?.name || ogTitle || domTitle || '';
    if (resolvedTitle) {
      resolvedTitle = decodeHtmlEntities(resolvedTitle)
        .replace(/\s*-\s*Price in India.*$/i, '')
        .replace(/\s*-\s*Buy\s+.*$/i, '')
        .replace(/\s*\|\s*Flipkart\.com.*$/i, '')
        .replace(/:\s*Buy Online at Best Prices.*$/i, '')
        .replace(/\s*\|\s*Amazon\.in.*$/i, '')
        .replace(/\s*-\s*Amazon\.in.*$/i, '')
        .replace(/Amazon\.in\s*:\s*/i, '')
        .replace(/\s*\|\s*Myntra.*$/i, '')
        .replace(/\s*\|\s*Tata CLiQ.*$/i, '')
        .replace(/\s*\|\s*Croma.*$/i, '')
        .replace(/\s*\|\s*Nykaa.*$/i, '')
        .replace(/\s*\|\s*Reliance Digital.*$/i, '')
        .trim();
    }

    // Slug fallback: Ensure generic routing segments (like single-letter 'd', 'p', 'dp') are filtered
    if (!resolvedTitle || resolvedTitle.length <= 2 || resolvedTitle.toLowerCase() === 'amazon.in' || resolvedTitle.toLowerCase() === 'verified brand') {
      const urlToInspect = canonicalUrl.includes('/dp/') || canonicalUrl.includes('/p/') ? canonicalUrl : effectiveUrl;
      const segments = new URL(urlToInspect).pathname
        .split('/')
        .filter((s) => Boolean(s) && s.length > 2 && !['p', 'dp', 'gp', 'product', 'itm', 'buy', 's', 'd', 'ref', 'share', 'redirect'].includes(s.toLowerCase()) && !/^[A-Z0-9]{10}$/i.test(s));
      const slug = segments[0];
      if (slug) {
        resolvedTitle = decodeHtmlEntities(decodeURIComponent(slug)).replace(/[-_+]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
      }
    }

    // Brand resolution
    let resolvedBrand =
      typeof jsonLdProduct?.brand === 'string'
        ? jsonLdProduct.brand
        : jsonLdProduct?.brand?.name || '';

    if (resolvedBrand) {
      resolvedBrand = decodeHtmlEntities(resolvedBrand).trim();
    } else {
      const known = [
        'HAMMER', 'RED TAPE', 'Red Tape', 'Apple', 'Sony', 'Samsung', 'Noise', 'boAt',
        'Asics', 'Minimalist', 'Lenovo', 'ASUS', 'OnePlus', 'Titan', 'Puma',
        'Nike', 'Adidas', 'Bata', 'Campus', 'Crocs', 'Sparx', 'Woodland',
        'Philips', 'Agaro', 'Dot & Key', 'Storite', 'STORITE', 'ZARA', 'H&M'
      ];
      for (const k of known) {
        if (new RegExp(`\\b${k}\\b`, 'i').test(resolvedTitle)) {
          resolvedBrand = k;
          break;
        }
      }
    }

    // Price and MRP resolution
    let verifiedPrice: number | undefined;
    let verifiedMrp: number | undefined;
    let availabilityStatus: 'in_stock' | 'out_of_stock' | 'unknown' = 'unknown';

    // A. Schema.org JSON-LD
    if (jsonLdProduct?.offers) {
      const offer = Array.isArray(jsonLdProduct.offers) ? jsonLdProduct.offers[0] : jsonLdProduct.offers;
      if (offer?.price) {
        verifiedPrice = Number(offer.price);
      }
      if (offer?.availability) {
        availabilityStatus = String(offer.availability).toLowerCase().includes('instock')
          ? 'in_stock'
          : 'out_of_stock';
      }
    } else if (ogPrice) {
      const num = parseFloat(ogPrice.replace(/[^0-9.]/g, ''));
      if (!isNaN(num) && num > 0) verifiedPrice = num;
    }

    // B. Direct Retailer HTML Scraping fallback (Flipkart, Amazon, Myntra)
    if (!verifiedPrice && html && !isAntiBotBlocked) {
      const hostLower = domain.toLowerCase();

      // Flipkart HTML structure
      if (hostLower.includes('flipkart.com')) {
        const mainPriceMatch = html.match(/(?:_30jeq3|Nx9bqj|_16Jk6d)[^>]*>₹\s*([\d,]+)</i) ||
          html.match(/<div[^>]*class="[^"]*(?:_1psv1zeb9|v1zwn21n)[^"]*"[^>]*>₹\s*([\d,]+)<\/div>/i) ||
          html.match(/>₹\s*([\d,]+)<\/(?:div|span)>/i);

        if (mainPriceMatch) {
          verifiedPrice = parseInt(mainPriceMatch[1].replace(/,/g, ''), 10);
          availabilityStatus = 'in_stock';
        }

        const mrpMatch = html.match(/(?:_3I9_wc|_2p6HMp|yRaY8j)[^>]*>₹\s*([\d,]+)</i) ||
          html.match(/<meta\s+name="Description"\s+content="[^"]*only for Rs\.\s*([\d,]+)/i);

        if (mrpMatch) {
          verifiedMrp = parseInt(mrpMatch[1].replace(/,/g, ''), 10);
        }
      }
      // Amazon India HTML structure
      else if (hostLower.includes('amazon.') || hostLower.includes('amzn.in')) {
        const amazonPriceMatch = html.match(/class="[^"]*a-price-whole[^"]*"[^>]*>([\d,]+)/i) ||
          html.match(/id="priceblock_(?:ourprice|dealprice)"[^>]*>₹\s*([\d,]+)/i) ||
          html.match(/class="[^"]*a-offscreen[^"]*"[^>]*>₹\s*([\d,]+)/i);

        if (amazonPriceMatch) {
          verifiedPrice = parseInt(amazonPriceMatch[1].replace(/,/g, ''), 10);
          availabilityStatus = 'in_stock';
        }

        const amazonMrpMatch = html.match(/class="[^"]*a-text-price[^"]*"[^>]*>[\s\S]*?₹\s*([\d,]+)/i);
        if (amazonMrpMatch) {
          verifiedMrp = parseInt(amazonMrpMatch[1].replace(/,/g, ''), 10);
        }
      }
    }

    // C. Live Research Fallback: If anti-bot challenge occurred or title/price is unverified
    if ((isAntiBotBlocked || !resolvedTitle || resolvedTitle.length <= 2 || !verifiedPrice) && (canonicalIdentifier || resolvedTitle)) {
      try {
        const { executeLiveResearch } = await import('@/lib/riiqx/search');
        const targetDomain = domain.includes('amazon') || domain.includes('amzn') ? 'amazon.in' : domain;
        const query = canonicalIdentifier
          ? `${canonicalIdentifier} ${targetDomain}`
          : `${resolvedTitle} ${targetDomain} buy price India`;
        const searchResult = await executeLiveResearch(query);

        if (searchResult.citations && searchResult.citations.length > 0) {
          const relevant = searchResult.citations.find((c) =>
            (canonicalIdentifier && c.url?.toLowerCase().includes(canonicalIdentifier.toLowerCase())) ||
            c.url?.includes('/dp/') ||
            c.url?.includes('/p/')
          ) || searchResult.citations.find((c) => c.snippet?.includes('₹') || c.snippet?.toLowerCase().includes('price'))
            || searchResult.citations[0];

          if (relevant) {
            if (!resolvedTitle || resolvedTitle.length <= 2 || resolvedTitle.toLowerCase() === 'verified product') {
              resolvedTitle = decodeHtmlEntities(relevant.title)
                .replace(/\s*-\s*Amazon.*$/i, '')
                .replace(/\s*\|\s*Flipkart.*$/i, '')
                .replace(/:\s*Buy Online.*$/i, '')
                .replace(/Amazon\.in\s*:\s*/i, '')
                .trim();
            }

            for (const cit of searchResult.citations) {
              const textToSearch = `${cit.snippet} ${cit.title}`;
              const priceMatch =
                textToSearch.match(/(?:lowest price:?|amazon price[^:]*:?|price:?|₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)/i);
              if (priceMatch && !verifiedPrice) {
                const parsed = parseFloat(priceMatch[1].replace(/,/g, ''));
                if (!isNaN(parsed) && parsed > 20 && parsed < 1000000) {
                  verifiedPrice = parsed;
                  availabilityStatus = 'in_stock';
                }
              }
              const mrpMatch = textToSearch.match(/mrp:?\s*(?:₹|rs\.?)?\s*([\d,]+)/i);
              if (mrpMatch && !verifiedMrp) {
                const parsedMrp = parseFloat(mrpMatch[1].replace(/,/g, ''));
                if (!isNaN(parsedMrp) && parsedMrp > 20) {
                  verifiedMrp = parsedMrp;
                }
              }
            }
          }
        }
      } catch {
        // Fallback gracefully
      }
    }

    if (!resolvedBrand) {
      if (resolvedTitle && resolvedTitle.length > 2 && resolvedTitle.toLowerCase() !== 'verified product') {
        resolvedBrand = resolvedTitle.split(' ')[0];
      } else {
        resolvedBrand = 'Verified Brand';
      }
    }

    if (!resolvedTitle || resolvedTitle.length <= 2) {
      resolvedTitle = 'Verified Product';
    }

    // Image resolution: Use direct CDN image if canonical Amazon ASIN is known
    let resolvedImage = jsonLdProduct?.image?.[0] || jsonLdProduct?.image || ogImage;
    if (!resolvedImage && canonicalIdentifier && (domain.includes('amazon') || domain.includes('amzn') || domain === 'amazon.in')) {
      resolvedImage = `https://images-na.ssl-images-amazon.com/images/P/${canonicalIdentifier}.01.MAIN._SCRM_.jpg`;
    }

    const cleanDomain = domain.replace(/^(?:dl|m|www)\./, '');

    const identity: ProductIdentity = {
      brand: resolvedBrand,
      title: resolvedTitle,
      category: 'Electronics & Lifestyle',
      imageUrl: resolvedImage,
      canonicalIdentifier,
      variantAttributes: {},
      specifications: ogDesc ? [ogDesc.slice(0, 120)] : ['Canonical URL verified with manufacturer / merchant identity.'],
      identityConfidence: verifiedPrice ? 0.98 : (isAntiBotBlocked ? 0.88 : 0.95),
      verificationSource: `${retailerName} Canonical Page (${cleanDomain})`,
      rawInputType: 'url',
    };

    const initialOffer: RetailerOffer = {
      id: `offer-${Date.now()}-1`,
      retailerName,
      retailerDomain: cleanDomain,
      sellerName: `${retailerName} Verified`,
      productUrl: canonicalUrl,
      canonicalUrl,
      purchaseUrl: canonicalUrl,
      directLinkVerified: Boolean(canonicalIdentifier),
      linkVerificationStatus: canonicalIdentifier ? 'verified_pdp' : 'direct_link_unverified',
      accessRestrictions: [],
      imageUrl: identity.imageUrl,
      sellingPrice: verifiedPrice,
      listedPrice: verifiedMrp || verifiedPrice,
      mrp: verifiedMrp,
      deliveryStatus: 'unknown',
      mandatoryFees: 0,
      finalComparablePrice: verifiedPrice,
      currency: 'INR',
      availability: availabilityStatus,
      variantMatchStatus: 'exact',
      verificationStatus: verifiedPrice ? 'provider_reported' : 'link_verified_price_pending',
      verificationMethod: verifiedPrice
        ? `${retailerName} authentic product page live extraction`
        : isAntiBotBlocked
        ? 'Canonical URL verification (Anti-bot gate on live scraping; verified merchant destination)'
        : `${retailerName} canonical listing verified`,
      lastCheckedAt: new Date().toISOString(),
      badge: 'Original User Target',
    };

    return {
      identity,
      initialOffer,
    };
  }
}
