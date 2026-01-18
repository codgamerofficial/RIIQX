import { getCustomer, formatPrice } from '@/lib/shopify';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { signOut } from '../actions/auth';
import Link from 'next/link';

export default async function AccountPage() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('customerAccessToken')?.value;

    if (!accessToken) {
        redirect('/login');
    }

    const customer = await getCustomer(accessToken);

    if (!customer) {
        // Token invalid or expired
        redirect('/login');
    }

    return (
        <div className="min-h-screen pt-32 pb-12 px-4 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
                        Operator <span className="text-primary">Profile</span>
                    </h1>
                    <p className="text-white/50 text-lg">Welcome back, {customer.firstName || 'User'}.</p>
                </div>

                <form action={signOut}>
                    <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-colors">
                        Terminate Session
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Details */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4">Credentials</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-white/50 text-xs uppercase tracking-widest">Full Name</p>
                                <p className="text-white font-medium">{customer.firstName} {customer.lastName}</p>
                            </div>
                            <div>
                                <p className="text-white/50 text-xs uppercase tracking-widest">Email</p>
                                <p className="text-white font-medium">{customer.email}</p>
                            </div>
                            <div>
                                <p className="text-white/50 text-xs uppercase tracking-widest">Phone</p>
                                <p className="text-white font-medium">{customer.phone || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/10">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tight mb-4">Default Drop Zone</h2>
                        {customer.defaultAddress ? (
                            <div className="text-white/80 leading-relaxed">
                                <p>{customer.defaultAddress.address1}</p>
                                <p>{customer.defaultAddress.city}, {customer.defaultAddress.province}</p>
                                <p>{customer.defaultAddress.zip}</p>
                                <p>{customer.defaultAddress.country}</p>
                            </div>
                        ) : (
                            <p className="text-white/50 italic">No address on file.</p>
                        )}
                    </div>
                </div>

                {/* Orders */}
                <div className="lg:col-span-2">
                    <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/10 min-h-[500px]">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-6">Mission History</h2>

                        {!customer.orders?.edges.length ? (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <p className="text-white/50 mb-4">No recent operations found.</p>
                                <Link href="/shop" className="bg-primary text-black px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs">
                                    Initiate Order
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {customer.orders.edges.map(({ node: order }) => (
                                    <div key={order.id} className="bg-black/40 p-4 rounded-xl border border-white/5 hover:border-white/20 transition-colors">
                                        <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                            <div>
                                                <p className="text-white font-bold text-lg">Order #{order.orderNumber}</p>
                                                <p className="text-white/50 text-xs">{new Date(order.processedAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[#D9F99D] font-bold">
                                                    {formatPrice(order.currentTotalPrice.amount, order.currentTotalPrice.currencyCode)}
                                                </p>
                                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-sm ${order.fulfillmentStatus === 'FULFILLED' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                                                    }`}>
                                                    {order.fulfillmentStatus}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                            {order.lineItems.edges.map(({ node: item }, i) => (
                                                <div key={i} className="flex-shrink-0 w-16 h-20 bg-zinc-800 rounded-md overflow-hidden relative group">
                                                    {item.variant?.image && (
                                                        <img src={item.variant.image.url} alt={item.title} className="w-full h-full object-cover" />
                                                    )}
                                                    <div className="absolute bottom-0 right-0 bg-black/80 text-white text-[10px] px-1 font-bold">
                                                        x{item.quantity}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
