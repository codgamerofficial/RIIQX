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

export interface ShippingUpdateEmailProps {
  orderNumber: string;
  customerName: string;
  carrierName: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDeliveryDate?: string;
}

export const ShippingUpdateEmail = ({
  orderNumber = 'RIIQX-98241',
  customerName = 'VALUED OPERATIVE',
  carrierName = 'BlueDart Express',
  trackingNumber = 'BD-882710394',
  trackingUrl = 'https://www.bluedart.com',
  estimatedDeliveryDate = '08 AUG 2026',
}: ShippingUpdateEmailProps) => {
  const previewText = `SHIPMENT DISPATCHED // #${orderNumber} - Your package is on the move with ${carrierName}.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>RIIQX</Text>
            <Text style={subHeader}>LOGISTICS DISPATCH PROTOCOL</Text>
          </Section>

          <Hr style={dividerCrimson} />

          {/* Hero Statement */}
          <Section style={section}>
            <Text style={tagline}>STATUS: DISPATCHED & IN TRANSIT</Text>
            <Text style={heading}>SHIPMENT ON THE MOVE</Text>
            <Text style={paragraph}>
              OPERATIVE <span style={bold}>{customerName.toUpperCase()}</span>, YOUR PACKAGE FOR ORDER{' '}
              <span style={cyanText}>#{orderNumber}</span> HAS BEEN DISPATCHED FROM FABRICATION DIVISION.
            </Text>
          </Section>

          {/* Tracking Card */}
          <Section style={card}>
            <Text style={cardTitle}>// CARRIER DISPATCH SPECIFICATIONS</Text>

            <Text style={label}>LOGISTICS CARRIER</Text>
            <Text style={value}>{carrierName.toUpperCase()}</Text>

            <Text style={label}>WAYBILL / AWB NUMBER</Text>
            <Text style={monoValue}>{trackingNumber}</Text>

            {estimatedDeliveryDate && (
              <>
                <Text style={label}>ESTIMATED TARGET DELIVERY</Text>
                <Text style={value}>{estimatedDeliveryDate}</Text>
              </>
            )}
          </Section>

          {/* CTA */}
          <Section style={ctaSection}>
            <Button style={button} href={trackingUrl}>
              LIVE TRACK SHIPMENT
            </Button>
          </Section>

          <Hr style={dividerDim} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              RIIQX AUTOMATED SHIPMENT DISPATCHER // 256-BIT ENCRYPTED NOTIFICATION
            </Text>
            <Text style={footerText}>
              Support desk: <span style={cyanLink}>support@riiqx.com</span>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ShippingUpdateEmail;

// --- Styles ---
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

const cyanText: React.CSSProperties = {
  color: '#00F0FF',
  fontWeight: 'bold',
};

const card: React.CSSProperties = {
  backgroundColor: '#121216',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '4px',
  padding: '20px',
  marginBottom: '20px',
};

const cardTitle: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '1px',
  color: '#8E8E93',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
};

const label: React.CSSProperties = {
  fontSize: '10px',
  letterSpacing: '1px',
  color: '#636366',
  margin: '8px 0 2px 0',
};

const value: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#FFFFFF',
  margin: '0 0 8px 0',
};

const monoValue: React.CSSProperties = {
  fontSize: '14px',
  fontFamily: 'monospace',
  color: '#00F0FF',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
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

const cyanLink: React.CSSProperties = {
  color: '#00F0FF',
};
