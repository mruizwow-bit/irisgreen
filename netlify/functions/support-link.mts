import type { Config, Context } from "@netlify/functions";

export default async (_req: Request, _context: Context) => {
  const enabled = Netlify.env.get("SUPPORT_PAYMENTS_ENABLED") === "true";
  const paymentLink = Netlify.env.get("STRIPE_SUPPORT_PAYMENT_LINK") || "";

  if (!enabled || !paymentLink) {
    return Response.json(
      { enabled: false },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  let url: URL;
  try {
    url = new URL(paymentLink);
  } catch {
    return Response.json(
      { enabled: false },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (url.protocol !== "https:" || url.hostname !== "buy.stripe.com") {
    return Response.json(
      { enabled: false },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  return Response.json(
    { enabled: true, url: url.href },
    { headers: { "Cache-Control": "no-store" } }
  );
};

export const config: Config = {
  path: "/api/support-link"
};
