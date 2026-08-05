import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

export interface WelcomeEmailProps {
  customerName?: string;
  promoCode?: string;
}

export const WelcomeEmail = ({
  customerName = 'OPERATIVE',
  promoCode = 'CYBER10',
}: WelcomeEmailProps) => {
  const previewText = `WELCOME TO RIIQX // Cyber Club Onboarding Initialized.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>RIIQX</Text>
            <Text style={subHeader}>CYBERNETIC LUXURY DIVISION</Text>
          </Section>

          <Hr style={dividerCrimson} />

          <Section style={section}>
            <Text style={tagline}>IDENTITY ACCESS GRANTED</Text>
            <Text style={heading}>WELCOME TO THE RIIQX CLUB</Text>
            <Text style={paragraph}>
              OPERATIVE <span style={bold}>{customerName.toUpperCase()}</span>, YOUR CLEARANCE LEVEL 01 ACCESS IS LIVE. ENJOY AN EXCLUSIVE 10% DISCOUNT ON YOUR FIRST FABRICATION ORDER.
            </Text>
          </Section>

          <Section style={card}>
            <Text style={cardTitle}>// EXCLUSIVE PROMO CODE</Text>
            <Text style={promoCodeText}>{promoCode}</Text>
            <Text style={cardSub}>APPLY CODE AT CHECKOUT FOR 10% DISCOUNT SAVINGS</Text>
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href="https://riiqx.com/collections">
              EXPLORE CAPSULE DROPS
            </Button>
          </Section>

          <Hr style={dividerDim} />

          <Section style={footer}>
            <Text style={footerText}>RIIQX BLACK LABEL CLUB // AUTOMATED ONBOARDING</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

const main: React.CSSProperties = {
  backgroundColor: '#08080A',
  fontFamily: "'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  color: '#FFFFFF',
  padding: '20px 0',
};

const container: React.CSSProperties = {
  backgroundColor: '#000000',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  margin: '0 auto',
  padding: '32px',
  maxWidth: '600px',
};

const header: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '16px',
};

const logo: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: '900',
  letterSpacing: '4px',
  color: '#FFFFFF',
  margin: '0',
};

const subHeader: React.CSSProperties = {
  fontSize: '10px',
  letterSpacing: '2px',
  color: '#8E8E93',
  margin: '4px 0 0 0',
};

const dividerCrimson: React.CSSProperties = {
  borderColor: '#FF003C',
  borderWidth: '1px',
  margin: '16px 0 24px 0',
};

const dividerDim: React.CSSProperties = {
  borderColor: 'rgba(255, 255, 255, 0.1)',
  borderWidth: '1px',
  margin: '16px 0',
};

const section: React.CSSProperties = {
  marginBottom: '24px',
};

const tagline: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '2px',
  color: '#FF003C',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
};

const heading: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 'bold',
  letterSpacing: '1px',
  color: '#FFFFFF',
  margin: '0 0 8px 0',
};

const paragraph: React.CSSProperties = {
  fontSize: '13px',
  color: '#A1A1A6',
  lineHeight: '1.5',
  margin: '0',
};

const bold: React.CSSProperties = {
  color: '#FFFFFF',
  fontWeight: 'bold',
};

const card: React.CSSProperties = {
  backgroundColor: '#121216',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  marginBottom: '20px',
};

const cardTitle: React.CSSProperties = {
  fontSize: '10px',
  letterSpacing: '1px',
  color: '#8E8E93',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
};

const promoCodeText: React.CSSProperties = {
  fontSize: '24px',
  fontFamily: 'monospace',
  color: '#00F0FF',
  fontWeight: 'bold',
  letterSpacing: '3px',
  margin: '0 0 8px 0',
};

const cardSub: React.CSSProperties = {
  fontSize: '11px',
  color: '#A1A1A6',
  margin: '0',
};

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '28px 0',
};

const button: React.CSSProperties = {
  backgroundColor: '#FF003C',
  color: '#FFFFFF',
  fontSize: '12px',
  fontWeight: 'bold',
  letterSpacing: '1.5px',
  padding: '14px 28px',
  borderRadius: '2px',
  textDecoration: 'none',
  display: 'inline-block',
};

const footer: React.CSSProperties = {
  textAlign: 'center',
  paddingTop: '8px',
};

const footerText: React.CSSProperties = {
  fontSize: '10px',
  color: '#636366',
  margin: '4px 0',
};
