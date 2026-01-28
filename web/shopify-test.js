require('dotenv').config({ path: '.env.local' });

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

console.log('Testing Shopify Connection...');
console.log('Domain:', domain);
console.log('Token:', token ? token.substring(0, 5) + '...' : 'MISSING');

if (!domain || !token) {
    console.error('Missing credentials');
    process.exit(1);
}

const endpoint = `https://${domain}/api/2024-01/graphql.json`;

const query = `
{
  products(first: 1) {
    edges {
      node {
        id
        title
      }
    }
  }
}
`;

async function testConnection() {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token,
            },
            body: JSON.stringify({ query }),
        });

        console.log('Response Status:', response.status);
        const text = await response.text();
        console.log('Response Body:', text);

        if (!response.ok) {
            console.error('Request failed');
        } else {
            console.log('Success!');
        }
    } catch (error) {
        console.error('Network Error:', error);
    }
}

testConnection();
