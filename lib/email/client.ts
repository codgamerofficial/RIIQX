import { Resend } from 'resend';
import React from 'react';

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY environment variable is missing.');
}

export const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || 'RIIQX <orders@riiqx.com>';

export interface SendEmailPayload {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
}

export async function sendEmail(payload: SendEmailPayload) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: payload.to,
      subject: payload.subject,
      react: payload.react,
    });

    if (error) {
      console.error('[Resend Error]:', error);
      return { success: false, error: error.message || String(error) };
    }

    return { success: true, messageId: data?.id || `msg_${Date.now()}` };
  } catch (err: any) {
    console.error('[Resend Exception]:', err);
    return { success: false, error: err.message || 'Unknown email dispatch error' };
  }
}
