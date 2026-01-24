export type Maybe<T> = T | null;

export type ShopifyFetchCache = 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';

export type Connection<T> = {
    edges: Array<{
        node: T;
        cursor?: string;
    }>;
    pageInfo?: {
        hasNextPage: boolean;
        endCursor?: string;
        hasPreviousPage?: boolean;
        startCursor?: string;
    };
};

export type Image = {
    url: string;
    altText?: string;
    width?: number;
    height?: number;
};

export type Money = {
    amount: string;
    currencyCode: string;
};

export type ProductVariant = {
    id: string;
    title: string;
    availableForSale: boolean;
    selectedOptions: {
        name: string;
        value: string;
    }[];
    price: Money;
    compareAtPrice?: Money;
    image?: Image;
};

export type Product = {
    id: string;
    handle: string;
    title: string;
    description: string;
    descriptionHtml: string;
    availableForSale: boolean;
    updatedAt: string;
    priceRange: {
        minVariantPrice: Money;
        maxVariantPrice: Money;
    };
    featuredImage?: Image;
    images: Connection<Image>;
    variants: Connection<ProductVariant>;
    options: {
        id: string;
        name: string;
        values: string[];
    }[];
    productType: string;
    tags: string[];
    media?: Connection<Media>;
};

export type Model3dSource = {
    url: string;
    mimeType: string;
    format: string;
    filesize: number;
};

export type Model3d = {
    id: string;
    alt: string;
    mediaContentType: 'MODEL_3D';
    sources: Model3dSource[];
};

export type MediaImage = {
    id: string;
    alt: string;
    mediaContentType: 'IMAGE';
    image: Image;
};

export type Media = Model3d | MediaImage;

export type Collection = {
    id: string;
    handle: string;
    title: string;
    description: string;
    updatedAt: string;
    products: Connection<Product>;
    image?: Image;
};

// --- Cart Types ---

export type CartLineInput = {
    merchandiseId: string;
    quantity: number;
    attributes?: { key: string; value: string }[];
};

export type Cart = {
    id: string;
    checkoutUrl: string;
    lines: Connection<CartItem>;
    cost: {
        totalAmount: Money;
    };
};

export type CartItem = {
    id: string;
    quantity: number;
    merchandise: {
        id: string;
        title: string;
        product: {
            title: string;
            handle: string;
        };
    };
};

export type Customer = {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    phone?: string;
    defaultAddress?: MailingAddress;
    addresses?: Connection<MailingAddress>;
    orders?: Connection<Order>;
};

export type MailingAddress = {
    id: string;
    address1?: string;
    address2?: string;
    city?: string;
    province?: string;
    zip?: string;
    country?: string;
};

export type Order = {
    id: string;
    orderNumber: number;
    processedAt: string;
    financialStatus: string;
    fulfillmentStatus: string;
    currentTotalPrice: Money;
    lineItems: Connection<OrderLineItem>;
};

export type OrderLineItem = {
    title: string;
    quantity: number;
    variant?: {
        image?: Image;
    };
};

export type CustomerAccessToken = {
    accessToken: string;
    expiresAt: string;
};

export type CustomerUserError = {
    code: string;
    field: string[];
    message: string;
};

