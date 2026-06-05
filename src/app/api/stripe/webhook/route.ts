import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const subscriptionId = session.subscription as string;

      if (!userId) break;

      // Get subscription details from Stripe
      //   const stripeSubscription =
      //     await stripe.subscriptions.retrieve(subscriptionId);

      await prisma.subscription.update({
        where: { userId },
        data: {
          plan: "PREMIUM_POSTER",
          status: "ACTIVE",
          stripeSubscriptionId: subscriptionId,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const stripeSubscriptionId = subscription.id;

      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId },
        data: {
          plan: "FREE",
          status: "CANCELED",
        },
      });

      break;
    }
  }

  return NextResponse.json({ received: true });
}
