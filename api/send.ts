import { Resend } from "resend";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const resend = new Resend(process.env.RESEND_API_KEY);

const HENRIETTE = "keramiker@henrietteduckert.dk";
const FROM = "Henriette Duckert Keramik <keramiker@henrietteduckert.dk>";

function autoReplyHtml(firstName: string): string {
  return `<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:'Bricolage Grotesque',Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Logo bar -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <div style="background:#07113c;width:200px;height:44px;border-radius:4px;display:inline-block;"></div>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:40px;padding:50px;">
                <tr>
                  <td style="font-family:'Bricolage Grotesque',Georgia,serif;font-size:24px;font-weight:700;color:#000000;padding-bottom:24px;">
                    Hej ${firstName},
                  </td>
                </tr>
                <tr>
                  <td style="font-family:'Bricolage Grotesque',Georgia,serif;font-size:18px;font-weight:400;color:#000000;line-height:1.6;padding-bottom:32px;">
                    Tak fordi du har skrevet til mig<br /><br />
                    Jeg har modtaget din besked, og den er landet sikkert i min indbakke. Jeg behandler alle henvendelser med omhu og vender tilbage til dig hurtigst muligt med et gennemtænkt svar.<br /><br />
                    Jeg ser frem til vores dialog og takker for din interesse.
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #e0e0e0;padding-bottom:20px;"></td>
                </tr>
                <tr>
                  <td style="font-family:'Bricolage Grotesque',Georgia,serif;font-size:20px;font-weight:600;color:#000000;padding-top:20px;padding-bottom:4px;">
                    Henriette Duckert
                  </td>
                </tr>
                <tr>
                  <td style="font-family:'Bricolage Grotesque',Georgia,serif;font-size:16px;font-weight:400;color:#000000;">
                    henrietteduckert.dk
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function notificationHtml(name: string, email: string, subject: string, message: string): string {
  return `<!DOCTYPE html>
<html lang="da">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;600;700&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:'Bricolage Grotesque',Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f9f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Logo bar -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <div style="background:#07113c;width:200px;height:44px;border-radius:4px;display:inline-block;"></div>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:40px;padding:50px;">
                <tr>
                  <td style="font-family:'Bricolage Grotesque',Georgia,serif;font-size:24px;font-weight:700;color:#000000;padding-bottom:24px;">
                    Ny henvendelse
                  </td>
                </tr>
                <tr>
                  <td style="font-family:'Bricolage Grotesque',Georgia,serif;font-size:16px;color:#000000;padding-bottom:8px;">
                    <strong>Navn:</strong> ${name}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:'Bricolage Grotesque',Georgia,serif;font-size:16px;color:#000000;padding-bottom:8px;">
                    <strong>Email:</strong> ${email}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:'Bricolage Grotesque',Georgia,serif;font-size:16px;color:#000000;padding-bottom:24px;">
                    <strong>Emne:</strong> ${subject}
                  </td>
                </tr>
                <tr>
                  <td style="border-top:1px solid #e0e0e0;padding-bottom:20px;"></td>
                </tr>
                <tr>
                  <td style="font-family:'Bricolage Grotesque',Georgia,serif;font-size:18px;font-weight:400;color:#000000;line-height:1.6;padding-top:20px;padding-bottom:32px;white-space:pre-wrap;">
                    ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                  </td>
                </tr>
                <tr>
                  <td style="font-family:'Bricolage Grotesque',Georgia,serif;font-size:14px;color:#666666;">
                    Svar direkte på denne mail for at svare ${name}.
                  </td>
                </tr>
              </table>
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

  const { name, email, subject, message } = req.body ?? {};

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ ok: false, error: "Manglende felter" });
  }

  const firstName = (name as string).split(" ")[0];

  try {
    await resend.emails.send({
      from: FROM,
      to: HENRIETTE,
      replyTo: email as string,
      subject: `${subject} – ${name}`,
      html: notificationHtml(name as string, email as string, subject as string, message as string),
      text: `Navn: ${name}\nEmail: ${email}\nEmne: ${subject}\n\nBesked:\n${message}`,
    });

    await resend.emails.send({
      from: FROM,
      to: email as string,
      subject: "Tak for din besked",
      html: autoReplyHtml(firstName),
      text: `Hej ${firstName},\n\nTak fordi du har skrevet til mig.\n\nJeg har modtaget din besked, og den er landet sikkert i min indbakke. Jeg behandler alle henvendelser med omhu og vender tilbage til dig hurtigst muligt med et gennemtænkt svar.\n\nJeg ser frem til vores dialog og takker for din interesse.\n\nHenriette Duckert\nhenrietteduckert.dk`,
    });

    return res.status(200).json({ ok: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Ukendt fejl";
    return res.status(500).json({ ok: false, error: msg });
  }
}
