from flask import Flask, request, jsonify
from flask_cors import CORS
from email.message import EmailMessage
import smtplib

app = Flask(__name__)
CORS(app)

SMTP_HOST = "cp08.nordicway.dk"
SMTP_PORT = 465
SMTP_USER = "keramiker@henrietteduckert.dk"
SMTP_PASS = "HenrietteForNu"
CONTACT_EMAIL = "keramiker@henrietteduckert.dk"

@app.route("/")
def home():
    return "API is running"

def send_email(msg):
    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, timeout=10) as server:
        server.login(SMTP_USER, SMTP_PASS)
        server.send_message(msg)

@app.route("/send", methods=["POST"])
def send_contact():
    data = request.get_json()

    if not data:
        return jsonify({"ok": False, "error": "No JSON received"}), 400

    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    subject = data.get("subject", "").strip()
    message = data.get("message", "").strip()

    if not name or not email or not subject or not message:
        return jsonify({"ok": False, "error": "Manglende felter"}), 400

    msg_to_henriette = EmailMessage()
    msg_to_henriette["From"] = CONTACT_EMAIL
    msg_to_henriette["To"] = CONTACT_EMAIL
    msg_to_henriette["Reply-To"] = email
    msg_to_henriette["Subject"] = f"Kontaktformular – {name} – {subject}"
    msg_to_henriette.set_content(
        f"Navn: {name}\n"
        f"Email: {email}\n"
        f"Emne: {subject}\n\n"
        f"Besked:\n{message}"
    )

    auto_reply = EmailMessage()
    auto_reply["From"] = CONTACT_EMAIL
    auto_reply["To"] = email
    auto_reply["Subject"] = "Tak for din besked"
    auto_reply.set_content(
        f"Hej {name},\n\n"
        "Tak for din besked. Jeg vender tilbage hurtigst muligt.\n\n"
        "Venlig hilsen\n"
        "Henriette Duckert\n"
        "keramiker@henrietteduckert.dk"
    )

    try:
        send_email(msg_to_henriette)
        send_email(auto_reply)
        return jsonify({"ok": True})
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
