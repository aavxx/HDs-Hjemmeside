import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const Kontakt = () => {
  const [formData, setFormData] = useState({
    navn: "",
    email: "",
    besked: "",
  });

  const [chatMessages, setChatMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([
    {
      role: "bot",
      text: "Hej! 👋 Jeg er Henriettes digitale assistent. Stil mig gerne spørgsmål om keramik, bestillinger, eller andet.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [activeTab, setActiveTab] = useState<"form" | "chat">("form");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Tak for din besked! Vi vender tilbage hurtigst muligt.");
    setFormData({ navn: "", email: "", besked: "" });
  };

  const handleChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatInput("");

    // Simple bot responses
    setTimeout(() => {
      let response =
        "Tak for dit spørgsmål! Henriette vender tilbage til dig snarest. Du kan også skrive en besked via kontaktformularen.";

      const lower = userMsg.toLowerCase();
      if (lower.includes("pris") || lower.includes("kost")) {
        response =
          "Priserne afhænger af størrelse og design. Udfyld gerne en bestilling, så giver Henriette et tilbud!";
      } else if (lower.includes("tid") || lower.includes("lang") || lower.includes("levering")) {
        response =
          "Leveringstiden er typisk 2-4 uger, afhængigt af ordren. Kontakt os for et præcist estimat.";
      } else if (lower.includes("hej") || lower.includes("goddag")) {
        response = "Hej! Hvad kan jeg hjælpe dig med i dag? 😊";
      }

      setChatMessages((prev) => [...prev, { role: "bot", text: response }]);
    }, 600);
  };

  const inputClass =
    "w-full bg-card border border-border px-4 py-3 text-sm font-body text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-foreground transition-colors";
  const labelClass = "block text-sm font-body font-medium text-foreground mb-1.5";

  const tabClass = (tab: string) =>
    `flex-1 py-3 text-sm font-body tracking-wide text-center transition-colors ${
      activeTab === tab
        ? "bg-primary text-primary-foreground"
        : "bg-card text-muted-foreground hover:text-foreground"
    }`;

  return (
    <section className="container py-16 md:py-24 max-w-2xl">
      <div className="animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl font-light text-foreground mb-3">
          Kontakt
        </h1>
        <p className="text-muted-foreground font-body mb-10 leading-relaxed">
          Har du spørgsmål? Skriv en besked eller chat med vores assistent.
        </p>

        {/* Tabs */}
        <div className="flex border border-border mb-8">
          <button
            onClick={() => setActiveTab("form")}
            className={tabClass("form")}
          >
            Kontaktformular
          </button>
          <button
            onClick={() => setActiveTab("chat")}
            className={tabClass("chat")}
          >
            <span className="inline-flex items-center gap-1.5">
              <MessageCircle size={14} />
              Chat
            </span>
          </button>
        </div>

        {activeTab === "form" ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Navn</label>
              <input
                type="text"
                required
                value={formData.navn}
                onChange={(e) =>
                  setFormData({ ...formData, navn: e.target.value })
                }
                placeholder="Dit navn"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>E-mail</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="din@email.dk"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Besked</label>
              <textarea
                required
                value={formData.besked}
                onChange={(e) =>
                  setFormData({ ...formData, besked: e.target.value })
                }
                placeholder="Skriv din besked her..."
                rows={5}
                className={inputClass + " resize-none"}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground py-3.5 text-sm font-body tracking-wide hover:opacity-90 transition-opacity"
            >
              Send besked
            </button>
          </form>
        ) : (
          <div className="border border-border bg-card flex flex-col h-[400px]">
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 text-sm font-body leading-relaxed ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <form
              onSubmit={handleChat}
              className="border-t border-border flex items-center"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Skriv en besked..."
                className="flex-1 px-4 py-3 text-sm font-body bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-3 text-foreground hover:text-primary transition-colors"
                aria-label="Send"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default Kontakt;
