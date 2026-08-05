import * as React from 'react';
import {
  Body,
  Button,
  Container,
  Column,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
} from '@react-email/components';

export interface OrderItemProps {
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  orderDate: string;
  items: OrderItemProps[];
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  totalAmount: number;
  shippingAddress: {
    address_line1: string;
    address_line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export const OrderConfirmationEmail = ({
  orderNumber = 'RIIQX-98241',
  customerName = 'VALUED OPERATIVE',
  orderDate = '05 AUG 2026',
  items = [
    {
      name: 'BATCH 004 // HEAVYWEIGHT TACTICAL HOODIE',
      color: 'OBSIDIAN BLACK',
      size: 'XL',
      quantity: 1,
      price: 12999,
      image: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=800',
    },
  ],
  subtotal = 14999,
  discountAmount = 2000,
  shippingFee = 0,
  taxAmount = 0,
  totalAmount = 12999,
  shippingAddress = {
    address_line1: '42 Cyber Way, Sector 5',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700091',
  },
}: OrderConfirmationEmailProps) => {
  const previewText = `ORDER CONFIRMED // #${orderNumber} - Thank you for your RIIQX order.`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Brand Header */}
          <Section style={header}>
            <Text style={logo}>RIIQX</Text>
            <Text style={subHeader}>CYBERNETIC LUXURY STREETWEAR // DIVISION 01</Text>
          </Section>

          <Hr style={dividerCyan} />

          {/* Hero Banner */}
          <Section style={section}>
            <Text style={tagline}>SYSTEM STATUS: ORDER CONFIRMED</Text>
            <Text style={heading}>ORDER #{orderNumber}</Text>
            <Text style={paragraph}>
              INITIATED BY OPERATIVE: <span style={bold}>{customerName.toUpperCase()}</span> ON {orderDate}.
            </Text>
          </Section>

          {/* Line Items Table */}
          <Section style={card}>
            <Text style={cardTitle}>// MANIFEST ITEMS</Text>
            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                {item.image && (
                  <Column style={{ width: '64px' }}>
                    <Img
                      src={item.image}
                      width="54"
                      height="54"
                      alt={item.name}
                      style={itemImage}
                    />
                  </Column>
                )}
                <Column>
                  <Text style={itemName}>{item.name}</Text>
                  <Text style={itemMeta}>
                    SIZE: {item.size} | COLOR: {item.color} | QTY: {item.quantity}
                  </Text>
                </Column>
                <Column align="right">
                  <Text style={itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
                </Column>
              </Row>
            ))}
          </Section>

          {/* Financial Summary */}
          <Section style={card}>
            <Text style={cardTitle}>// FINANCIAL LEDGER</Text>
            <Row style={summaryRow}>
              <Column><Text style={summaryLabel}>SUBTOTAL</Text></Column>
              <Column align="right"><Text style={summaryValue}>₹{subtotal.toLocaleString('en-IN')}</Text></Column>
            </Row>
            {discountAmount > 0 && (
              <Row style={summaryRow}>
                <Column><Text style={summaryLabel}>CYBER DISCOUNT</Text></Column>
                <Column align="right"><Text style={discountValue}>-₹{discountAmount.toLocaleString('en-IN')}</Text></Column>
              </Row>
            )}
            <Row style={summaryRow}>
              <Column><Text style={summaryLabel}>EXPRESS SHIPPING</Text></Column>
              <Column align="right">
                <Text style={summaryValue}>
                  {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toLocaleString('en-IN')}`}
                </Text>
              </Column>
            </Row>
            <Hr style={dividerDim} />
            <Row style={summaryRow}>
              <Column><Text style={totalLabel}>TOTAL AMOUNT PAID</Text></Column>
              <Column align="right"><Text style={totalValue}>₹{totalAmount.toLocaleString('en-IN')}</Text></Column>
            </Row>
          </Section>

          {/* Shipping Address Target */}
          <Section style={card}>
            <Text style={cardTitle}>// DISPATCH TARGET</Text>
            <Text style={addressText}>{shippingAddress.address_line1}</Text>
            {shippingAddress.address_line2 && (
              <Text style={addressText}>{shippingAddress.address_line2}</Text>
            )}
            <Text style={addressText}>
              {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.pincode}
            </Text>
          </Section>

          {/* Call To Action */}
          <Section style={ctaSection}>
            <Button
              style={button}
              href={`https://riiqx.com/account/orders?id=${orderNumber}`}
            >
              TRACK ORDER IN DASHBOARD
            </Button>
          </Section>

          <Hr style={dividerDim} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              RIIQX AUTOMATED SYSTEM // 256-BIT ENCRYPTED RECEIPT
            </Text>
            <Text style={footerText}>
              If you have any questions, reach out to <span style={cyanLink}>support@riiqx.com</span>
            </Text>
            <Text style={copyright}>
              © 2026 RIIQX. ALL RIGHTS RESERVED.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

// --- Inline Styles (Dark Mode Optimized) ---
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
  padding: '16px',
  marginBottom: '16px',
};

const cardTitle: React.CSSProperties = {
  fontSize: '11px',
  letterSpacing: '1px',
  color: '#8E8E93',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const itemRow: React.CSSProperties = {
  marginBottom: '12px',
};

const itemImage: React.CSSProperties = {
  borderRadius: '2px',
  objectFit: 'cover',
  border: '1px solid rgba(255, 255, 255, 0.1)',
};

const itemName: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#FFFFFF',
  margin: '0 0 2px 0',
};

const itemMeta: React.CSSProperties = {
  fontSize: '11px',
  color: '#8E8E93',
  margin: '0',
};

const itemPrice: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 'bold',
  color: '#FFFFFF',
  margin: '0',
};

const summaryRow: React.CSSProperties = {
  margin: '6px 0',
};

const summaryLabel: React.CSSProperties = {
  fontSize: '12px',
  color: '#8E8E93',
  margin: '0',
};

const summaryValue: React.CSSProperties = {
  fontSize: '12px',
  color: '#FFFFFF',
  margin: '0',
};

const discountValue: React.CSSProperties = {
  fontSize: '12px',
  color: '#00F0FF',
  fontWeight: 'bold',
  margin: '0',
};

const totalLabel: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 'bold',
  color: '#FFFFFF',
  margin: '0',
};

const totalValue: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#00F0FF',
  margin: '0',
};

const addressText: React.CSSProperties = {
  fontSize: '13px',
  color: '#A1A1A6',
  margin: '2px 0',
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

const cyanLink: React.CSSProperties = {
  color: '#00F0FF',
};

const copyright: React.CSSProperties = {
  fontSize: '10px',
  color: '#48484A',
  marginTop: '12px',
};
