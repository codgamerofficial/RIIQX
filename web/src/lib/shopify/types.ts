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
