const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

const SHOPIFY_GRAPHQL_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

export async function createShopifyCheckout(lineItems: Array<{ variantId: string; quantity: number }>) {
    const mutation = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
          lineItems(first: 250) {
            edges {
              node {
                title
                quantity
              }
            }
          }
        }
        checkoutUserErrors {
          message
          field
        }
      }
    }
  `;

    const variables = {
        input: {
            lineItems: lineItems.map(item => ({
                variantId: item.variantId,
                quantity: item.quantity,
            })),
        },
    };

    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query: mutation, variables }),
    });

    const data = await response.json();

    if (data.errors) {
        throw new Error(data.errors[0].message);
    }

    if (data.data.checkoutCreate.checkoutUserErrors.length > 0) {
        throw new Error(data.data.checkoutCreate.checkoutUserErrors[0].message);
    }

    return data.data.checkoutCreate.checkout;
}

export async function getCheckoutUrl(checkoutId: string) {
    const query = `
    query getCheckout($id: ID!) {
      node(id: $id) {
        ... on Checkout {
          webUrl
          completedAt
        }
      }
    }
  `;

    const response = await fetch(SHOPIFY_GRAPHQL_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables: { id: checkoutId } }),
    });

    const data = await response.json();
    return data.data.node;
}
