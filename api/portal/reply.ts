import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Henriette Duckert Keramik <keramiker@henrietteduckert.dk>";

const LOGO_SRC =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU1IiBoZWlnaHQ9IjUwIiB2aWV3Qm94PSIwIDAgMjU1IDUwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTkuMDAxMyAwLjA4MTM4MjlDMjYuMjI1MiAtMC4zNDc2NjcgMzMuNjAzMiAwLjkzOTQ5MiAzOC40MDk0IDMuNDc1N0M0My41NDMyIDYuMTgzNTMgNDYuNTA5OSAxMC4wMTY1IDQ3LjQyNDkgMTUuMDg4OEM0Ny42NTYxIDE2LjM4NTUgNDcuNjU2MSAxOC41NjkxIDQ3LjQyNDkgMTkuOTUxNkM0Ni41Mzg3IDI1LjMwMDYgNDMuMTA5OSAzMS4wMDIzIDM3LjM1OTYgMzYuNjg0OUMzNC4xMzMgMzkuODY5NCAzMC43OTA2IDQyLjM4NjQgMjYuODYwOSA0NC42MDgxQzIxLjE0OTEgNDcuODQwMyAxNS4xOTY3IDQ5Ljc1NjggMTAuMTQgNDkuOTc2MkM4Ljg3ODIyIDUwLjAzMzMgOC45MTY3NCA1MC4wMTQzIDEwLjgxNDIgNDkuNjE0QzE0Ljc2MzMgNDguNzc0OCAxOS44NTg2IDQ2LjYwMSAyMy45NjE4IDQzLjk4ODRDMzAuNjg0OCAzOS43MTY5IDM2LjE2NTIgMzQuMzc3MyAzOS45MDI1IDI4LjQ1NjRDNDIuNTIyMiAyNC4yOTk0IDQzLjc5MzggMjAuNzkwNyA0My45NjcyIDE3LjIzNDJDNDQuMjk0NyAxMC4zNzg4IDM5LjUwNzYgNS4xOTE5MiAzMC40NzI4IDIuNTk4NDlDMjYuNjIwMSAxLjUwMjAyIDIzLjI4NzUgMS4wODI1NSAxOC4zMjcxIDEuMDgyNTVDMTUuMDA0MiAxLjA4MjU1IDEzLjE3NDEgMS4yMTU5NyAxMC42MjE3IDEuNjQ1MDJDOS44ODAwNiAxLjc2ODk2IDkuMTE5MSAxLjkwMjU2IDguOTM2MDUgMS45MzExN0M4LjI0MjU0IDIuMDM2MDUgMTAuMTk3OSAxLjQ3MzM3IDExLjcyOTMgMS4xMjA1OUMxNC4xNDY5IDAuNTY3NTk1IDE2LjQ4NzUgMC4yMjQ0MDEgMTkuMDAxMyAwLjA4MTM4MjlaIiBmaWxsPSIjMDcxMTNDIi8+PHBhdGggZD0iTTEyLjgyNTEgNi4wNTIwOEMxMy4zNzM0IDUuODE0NDggMTQuNjA0OSA2LjI3MDc1IDE1LjA3NjQgNi44NzkwNkMxNS4yMTExIDcuMDUwMTcgMTUuMzM2MSA3LjM1NDQ3IDE1LjM2NSA3LjU2MzU5QzE1LjQzMjMgOC4wMzg5MiAxNS4xNzI1IDkuODkyNDMgMTQuODE2NiAxMS41MjczQzE0LjUyNzkgMTIuODI5NiAxNC4zNzQgMTMuNDE5IDEzLjA5NDQgMTguMDI5MkMxMi42NjE1IDE5LjU2OSAxMi4zMTUyIDIwLjg2MTcgMTIuMzE1MiAyMC44OTAzQzEyLjMxNTUgMjAuOTI4MiAxMi44NDQ0IDIwLjc4NTYgMTMuNDk4NSAyMC41NzY1QzE1LjUzODIgMTkuOTM5NyAxOS40MDU5IDE4Ljc5OTEgMjEuMzk3NiAxOC4yNTczQzIyLjQ1NTggMTcuOTcyMSAyMy4zMjE4IDE3LjczNDQgMjMuMzMxNCAxNy43MTU0QzIzLjM2MDggMTcuNjg1MiAyMy43MTY0IDE2LjA5ODkgMjMuOTQ3MiAxNC45ODczQzI0LjY2ODggMTEuNTg0NCAyNS4wNzI4IDguNzA0MTUgMjQuOTU3MyA3LjgwMTE0QzI0LjkxODkgNy40ODc0OSAyNC45MzgxIDcuMjMwODEgMjUuMDE1IDcuMDk3NzNDMjUuMTIwOSA2LjkwNzY0IDI1LjE4ODMgNi44ODg1OSAyNS42MjEzIDYuOTI2NjFDMjYuMjM2OSA2Ljk3NDE0IDI2Ljc1NjYgNy4yMjEzNSAyNy4yNDcyIDcuNjY4MTJMMJC2MTI4IDguMDE5OFY4LjgyNzcyQzI3LjYxMjggOS45Mzk4NiAyNy40MjA0IDEwLjk2NjUgMjYuNTkzMiAxNC4yNjQ5QzI2LjE5OTEgMTUuODIxOSAyNS45MDEgMTcuMTIyOSAyNS45MTk0IDE3LjE0NUMyOS4yOTY1IDE2LjUzNjcgMzMuMjc5OCAxNS45MzggMzUuMjYxOCAxNS43NDc5QzM3Ljk1NTcgMTUuNDkxMiA0MC43MzYxIDE1LjU1NzcgMzguNzI1NCAxNS44MzMzQzM3LjA0MTcgMTYuMDYxNSAzNC4xNzQ0IDE2LjYxMjggMzIuMDM4NSAxNy4xMTY1QzMwLjEyMzkgMTcuNTcyOCAyNS41ODMxIDE4Ljc3MDYgMjUuNTE1NiAxOC44Mjc3QzI1LjQ1NzYgMTguODk0OCAyNC4zMDMzIDIzLjkzMTkgMjQuMDA1IDI1LjQ2MjNDMjMuNTA0NiAyOC4wNjY4IDIzLjM2MDQgMjkuMjkzMiAyMy4zOTg3IDMwLjgxNEwyMy40Mjc3IDMyLjE0NDhMMjMuMTQ4NiAzMi4xMjU2QzIyLjM5ODEgMzIuMDY4NiAyMS43NjMxIDMxLjEyNzcgMjEuNjM4IDI5Ljg4MjVDMjEuNDY0NyAyOC4yMDAxIDIyLjE1NzcgMjMuNDg1MyAyMi45NjU3IDE5LjU4ODFMMTEC2Ljg1MSAyMy40NjYzTDExLjIyNzkgMjUuMzM4N0MxMC4zMDQzIDI5LjE0MSA5LjkwOTgxIDMxLjQ4ODggOS43MDc3OCAzNC4yNTVDOS40NzY4NyAzNy40Njc4IDEwLjA1NDEgMzkuNzU4NiAxMS4yMjc5IDQwLjIzMzlDMTEuOTMwMiA0MC41Mjg2IDExLjQxMDggNDAuODUxOCAxMC41MzUzIDQwLjY2MTdDOS4yMTcyMSA0MC4zNjcgOC4xOTcyMyAzOS4xODgzIDcuNjY4MDggMzcuMzM0N0M3LjQ4NTI5IDM2LjY3ODkgNy40NjYwMSAzNi4zODQxIDcuNDY2MDEgMzQuMDQ1OUM3LjQ2NjAxIDMxLjE3NTMgNy41NTI2MSAzMC40MDUzIDguMjgzODEgMjYuNzkzM0M4LjQ5NTQ0IDI1LjcyOSA4LjY1ODk5IDI0LjgzNTQgOC42MzAxOSAyNC44MTYxQzguNTgyMDYgMjQuNzU5MSA2Ljg0MDYzIDI1LjU0NzkgNS40ODQwNCAyNi4yMzIzQzMuNTc5MDcgMjcuMTkyNSAyLjA2ODUzIDI4LjMxNDEgMS41MjAxMiAyOS4xNTA2TDEuMzY2MjMgMjkuMzg4MUwwLjk5MDk4MyAyOS4xODg1QzAuNDUyMjAzIDI4Ljg5MzkgMCAyOC4xOTA0IDAgMjcuNjM5MkMyLjM5ODMyZS0wNSAyNi45MzU3IDAuMzg0OTczIDI2LjQzMTggMS40NDMyNyAyNS43MzhDMi41Njg5OCAyNS4wMDYyIDQuODk3MjUgMjMuODY1NSA3LjQwODI4IDIyLjc5MTRMOS4zODA3IDIxLjk1NDlMOS43OTQzNyAyMC4zOTU5QzEwLjkzOTMgMTYuMDIzNCAxMS43NDc1IDEyLjgyIDExLjk2ODggMTEuNzM2NEMxMi4zMDU2IDEwLjA4MjQgMTIuNjAzNyA3LjgwMTEyIDEyLjYwMzcgNi44OTgxMUMxMi42MDM3IDYuMjA0MjUgMTIuNjIzIDYuMTM3NjMgMTIuODI1MSA2LjA1MjA4WiIgZmlsbD0iIzA3MTEzQyIvPjwvc3ZnPgo=";

const LOGO_IMG = `<img src="${LOGO_SRC}" width="255" height="50" alt="Henriette Duckert Keramik" style="display:block;" />`;

function emailShell(cardContent: string): string {
  return `<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:'Bricolage Grotesque',Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              ${LOGO_IMG}
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;border-radius:40px;padding:48px;">
              ${cardContent}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL ?? "";
  const supabaseKey =
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    "";

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { to, subject, bodyHtml, bodyText, inReplyToId } = req.body ?? {};

  if (!to || !subject) {
    return res.status(400).json({ ok: false, error: "Manglende felter" });
  }

  const messageText = bodyText ?? bodyHtml ?? "";

  const safeBody = String(messageText)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");

  const cardContent = `
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="font-family:'Bricolage Grotesque',Georgia,serif;font-size:16px;color:#000000;line-height:1.7;padding-bottom:32px;">
          ${bodyHtml ?? safeBody}
        </td>
      </tr>
      <tr>
        <td style="border-top:1px solid #e0e0e0;padding-top:24px;">
          <p style="margin:0 0 4px;font-family:'Bricolage Grotesque',Georgia,serif;font-size:20px;font-weight:600;color:#000000;">Henriette Duckert</p>
          <p style="margin:0;font-family:'Bricolage Grotesque',Georgia,serif;font-size:16px;font-weight:400;color:#000000;">henrietteduckert.dk</p>
        </td>
      </tr>
    </table>`;

  try {
    const sendResult = await resend.emails.send({
      from: FROM,
      to: to as string,
      subject: subject as string,
      html: emailShell(cardContent),
      text: messageText as string,
    });

    // Store in Supabase as outbound
    const { error } = await supabase.from("portal_emails").insert({
      resend_id: sendResult.data?.id ?? null,
      from_email: "keramiker@henrietteduckert.dk",
      from_name: "Henriette Duckert",
      subject: subject as string,
      body_html: bodyHtml ?? null,
      body_text: bodyText ?? null,
      is_read: true,
      in_reply_to: inReplyToId ?? null,
      direction: "outbound",
    });

    if (error) {
      console.error("Supabase insert error:", error);
    }

    return res.status(200).json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Ukendt fejl";
    return res.status(500).json({ ok: false, error: msg });
  }
}
