import config from "../../config/index.js";
import { prisma } from "../../lib/prisma.js";
import { stripe } from "../../lib/stripe.js";
import { handleCheckoutCompleted } from "./payment.utils.js";
import { ICreateCheckoutSessionPayload } from "./payment.interface.js";

const createCheckoutSession = async (
  customerId: string,
  payload: ICreateCheckoutSessionPayload,
) => {
  const { rentalOrderId } = payload;

  const order = await prisma.rentalOrder.findUniqueOrThrow({
    where: { id: rentalOrderId },
  });

  if (order.customer_id !== customerId) {
    throw new Error("You are not authorized to pay for this order");
  }

  if (order.status !== "CONFIRMED") {
    throw new Error(
      `Cannot pay for an order with status ${order.status}. Order must be CONFIRMED first.`,
    );
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `GearUp Rental Order #${order.id.slice(0, 8)}`,
          },
          unit_amount: Math.round(Number(order.total_amount) * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${config.client_url}/orders/${order.id}?success=true`,
    cancel_url: `${config.client_url}/orders/${order.id}?success=false`,
    metadata: { rentalOrderId: order.id, customerId },
  });

  return { paymentUrl: session.url };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_web_secret;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
      break;
  }
};

const getMyPayments = async (customerId: string) => {
  const result = await prisma.payment.findMany({
    where: { rentalOrder: { customer_id: customerId } },
    include: { rentalOrder: true },
    orderBy: { created_at: "desc" },
  });
  return result;
};

const getPaymentById = async (paymentId: string, customerId: string) => {
  const result = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
    include: { rentalOrder: true },
  });

  if (result.rentalOrder.customer_id !== customerId) {
    throw new Error("You are not authorized to view this payment");
  }

  return result;
};

export const paymentService = {
  createCheckoutSession,
  handleWebhook,
  getMyPayments,
  getPaymentById,
};
