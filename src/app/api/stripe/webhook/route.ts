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
      const customerId = session.customer as string;

      if (!userId) break;
      if (!subscriptionId) break;

      const stripeSubscription: Stripe.Subscription =
        await stripe.subscriptions.retrieve(subscriptionId);
      const item = stripeSubscription.items.data[0];

      await prisma.subscription.upsert({
        where: { userId },
        update: {
          plan: "PREMIUM_POSTER",
          status: "ACTIVE",
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: customerId,
          currentPeriodStart: new Date(item.current_period_start * 1000),
          currentPeriodEnd: new Date(item.current_period_end * 1000),
        },
        create: {
          userId,
          plan: "PREMIUM_POSTER",
          status: "ACTIVE",
          stripeSubscriptionId: subscriptionId,
          stripeCustomerId: customerId,
          currentPeriodStart: new Date(item.current_period_start * 1000),
          currentPeriodEnd: new Date(item.current_period_end * 1000),
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
          stripeSubscriptionId: null,
          stripeCustomerId: null,
        },
      });

      break;
    }
  }

  return NextResponse.json({ received: true });
}
