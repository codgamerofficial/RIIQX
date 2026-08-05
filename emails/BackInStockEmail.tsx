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

export interface BackInStockEmailProps {
  customerName?: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  price: number;
}

export const BackInStockEmail = ({
  customerName = 'OPERATIVE',
  productName = 'BATCH 004 // HEAVYWEIGHT TACTICAL HOODIE',
  productSlug = 'heavyweight-tactical-hoodie',
  price = 12999,
}: BackInStockEmailProps) => {
  const previewText = `RESTOCK ALERT // ${productName} is back in stock.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>RIIQX</Text>
            <Text style={subHeader}>INVENTORY RESTOCK ALERT</Text>
          </Section>

          <Hr style={dividerCyan} />

          <Section style={section}>
            <Text style={tagline}>LIMITED QUANTITY RESTOCK</Text>
            <Text style={heading}>ITEM RESTOCKED // DROPPING NOW</Text>
            <Text style={paragraph}>
              HELLO <span style={bold}>{customerName.toUpperCase()}</span>, THE PIECE YOU WAITED FOR HAS BEEN RE-SUPPLIED TO DIVISION STORES.
            </Text>
          </Section>

          <Section style={card}>
            <Text style={itemName}>{productName}</Text>
            <Text style={itemPrice}>₹{price.toLocaleString('en-IN')}</Text>
          </Section>

          <Section style={ctaSection}>
            <Button style={button} href={`https://riiqx.com/products/${productSlug}`}>
              ACQUIRE PIECE NOW
            </Button>
          </Section>

          <Hr style={dividerDim} />

          <Section style={footer}>
            <Text style={footerText}>RIIQX RESTOCK AUTOMATION // DIVISION 01</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default BackInStockEmail;

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

const dividerCyan: React.CSSProperties = {
  borderColor: '#00F0FF',
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
  color: '#00F0FF',
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
  marginBottom: '20px',
};

const itemName: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#FFFFFF',
  margin: '0 0 4px 0',
};

const itemPrice: React.CSSProperties = {
  fontSize: '14px',
  color: '#00F0FF',
  fontWeight: 'bold',
  margin: '0',
};

const ctaSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '28px 0',
};

const button: React.CSSProperties = {
  backgroundColor: '#00F0FF',
  color: '#000000',
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
