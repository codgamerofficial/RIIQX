import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shipping & Returns | RIIQX',
    description: 'Shipping and Return Policy for RIIQX orders.',
};

export default function ShippingReturnsPage() {
    return (
        <>
            <h1>Shipping & Returns</h1>

            <h2>Shipping Policy</h2>
            <p>
                <strong>Processing Time:</strong> All orders are processed within 1-3 business days. Orders are not shipped or delivered on weekends or holidays.
            </p>
            <p>
                <strong>Shipping Rates:</strong> Shipping charges for your order will be calculated and displayed at checkout. Standard delivery typically takes 5-7 business days across India.
            </p>
            <p>
                <strong>Shipment Confirmation & Order Tracking:</strong> You will receive a Shipment Confirmation email containing your tracking number(s) once your order has shipped. The tracking number will be active within 24 hours.
            </p>

            <hr className="my-8 border-white/10" />

            <h2>Return & Refund Policy</h2>
            <p>
                We want you to be completely satisfied with your purchase.
            </p>

            <h3>Returns</h3>
            <p>
                You have 7 calendar days to return an item from the date you received it. To be eligible for a return, your item must be unused and in the same condition that you received it. Your item must be in the original packaging.
            </p>

            <h3>Refunds</h3>
            <p>
                Once we receive your item, we will inspect it and notify you that we have received your returned item. We will immediately notify you on the status of your refund after inspecting the item. If your return is approved, we will initiate a refund to your original method of payment (or verify bank account for COD orders).
            </p>

            <h3>Shipping for Returns</h3>
            <p>
                You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.
            </p>

            <h3>Contact Us</h3>
            <p>
                If you have any questions on how to return your item to us, contact us at support@riiqx.com.
            </p>
        </>
    );
}
