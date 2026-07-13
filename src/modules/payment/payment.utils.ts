import Stripe from "stripe";
import { prisma } from "../../lib/prisma.js";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const rentalOrderId = session.metadata?.rentalOrderId;

  if (!rentalOrderId) {
    throw new Error("Webhook Failed: rentalOrderId missing in metadata");
  }

  const amountPaid = (session.amount_total ?? 0) / 100;

  await prisma.$transaction(async (tx) => {
    await tx.payment.upsert({
      where: { rental_order_id: rentalOrderId },
      create: {
        rental_order_id: rentalOrderId,
        transaction_id: session.payment_intent as string,
        amount: amountPaid,
        method: "stripe",
        status: "COMPLETED",
        paid_at: new Date(),
      },
      update: {
        transaction_id: session.payment_intent as string,
        status: "COMPLETED",
        paid_at: new Date(),
      },
    });

    await tx.rentalOrder.update({
      where: { id: rentalOrderId },
      data: { status: "PAID" },
    });
  });
};
