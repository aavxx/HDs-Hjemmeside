import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { name, email, subject, message } = await req.json();

    // Server-side validation
    const errors: Record<string, string> = {};
    if (!name || typeof name !== "string" || name.trim().length === 0) errors.name = "Name is required";
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Valid email is required";
    if (!subject || typeof subject !== "string" || subject.trim().length === 0) errors.subject = "Subject is required";
    if (!message || typeof message !== "string" || message.trim().length === 0) errors.message = "Message is required";

    if (Object.keys(errors).length > 0) {
      return new Response(JSON.stringify({ success: false, errors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Log the contact form submission (you can extend this to send an actual email)
    console.log("Contact form submission:", { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send error:", e);
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
