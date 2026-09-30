import { db } from '../lib/database';

export interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}

export function getSessionId(): string {
  let sessionId = sessionStorage.getItem('nextwin_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now();
    sessionStorage.setItem('nextwin_session_id', sessionId);
  }
  return sessionId;
}

export function getUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  const utm: UTMParams = {};

  const source = params.get('utm_source') || params.get('source');
  const medium = params.get('utm_medium') || params.get('medium');
  const campaign = params.get('utm_campaign') || params.get('campaign');
  const content = params.get('utm_content') || params.get('content');
  const term = params.get('utm_term') || params.get('term');

  if (source) utm.source = source;
  if (medium) utm.medium = medium;
  if (campaign) utm.campaign = campaign;
  if (content) utm.content = content;
  if (term) utm.term = term;

  // If UTMs exist, save in session for attribution across pages
  if (Object.keys(utm).length > 0) {
    sessionStorage.setItem('nextwin_utm_params', JSON.stringify(utm));
  } else {
    // Try to retrieve existing session UTMs
    const stored = sessionStorage.getItem('nextwin_utm_params');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {}
    }
  }

  return utm;
}

export const analytics = {
  trackPageView(path: string, productId?: string) {
    const sessionId = getSessionId();
    const utm = getUTMParams();

    db.recordEvent({
      event_name: 'page_view',
      session_id: sessionId,
      product_id: productId,
      source: utm.source,
      medium: utm.medium,
      campaign: utm.campaign,
      metadata: { path, referrer: document.referrer }
    });
  },

  trackProductView(productId: string, productName: string) {
    const sessionId = getSessionId();
    const utm = getUTMParams();

    db.recordEvent({
      event_name: 'product_view',
      session_id: sessionId,
      product_id: productId,
      source: utm.source,
      medium: utm.medium,
      campaign: utm.campaign,
      metadata: { productName }
    });
  },

  trackCheckoutClick(productId: string, checkoutUrl: string, price: number, currency: string) {
    const sessionId = getSessionId();
    const utm = getUTMParams();

    db.recordEvent({
      event_name: 'checkout_click',
      session_id: sessionId,
      product_id: productId,
      source: utm.source,
      medium: utm.medium,
      campaign: utm.campaign,
      metadata: { checkoutUrl, price, currency }
    });
  },

  trackLeadSubmit(email: string, campaign?: string) {
    const sessionId = getSessionId();
    const utm = getUTMParams();

    db.recordEvent({
      event_name: 'lead_submit',
      session_id: sessionId,
      source: utm.source || 'direct',
      medium: utm.medium,
      campaign: campaign || utm.campaign,
      metadata: { emailHashed: email.split('@')[0].slice(0, 3) + '***' }
    });
  }
};
