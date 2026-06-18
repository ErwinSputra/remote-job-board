import { createClient } from "@supabase/supabase-js";

// -----------------------------------------------------------------------------
// SERVER-SIDE SUPABASE CLIENT (Storage only)
// -----------------------------------------------------------------------------
// This is separate from `lib/prisma.ts`. Prisma talks to Postgres directly for
// database queries; this client talks to Supabase's Storage REST API for file
// uploads. They are two different services under the same Supabase project.
//
// Uses the SERVICE_ROLE key, which has full access and bypasses Storage policies.
// This file must NEVER be imported into client components — it should only be
// used inside API routes (server-side code), since the service_role key is secret.
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables",
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
