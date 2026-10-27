"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, ArrowRight, Mail, Github, Linkedin } from "lucide-react";
import { profile } from "@/content/profile";
type Status = "idle" | "submitting" | "success" | "error";
export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const busy = useRef(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("botcheck")) return;
    busy.current = true;
    setStatus("submitting");
    const abort = new AbortController();
    controller.current = abort;
    const timer = setTimeout(() => abort.abort(), 15000);
    data.append("access_key", "277e470e-4516-4cbb-8844-f401fcb57133");
    data.append("subject", "Portfolio enquiry for Akib");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
        signal: abort.signal,
      });
      if (!response.ok) throw new Error("Provider error");
      const result = await response.json();
      if (result.success !== true) throw new Error("Message rejected");
      form.reset();
      setStatus("success");
    } catch {
      if (controller.current === abort) setStatus("error");
    } finally {
      clearTimeout(timer);
      if (controller.current === abort) controller.current = null;
      busy.current = false;
    }
  }
  return (
    <section id="contact" className="contact-section">
      <div className="wrap">
        <div className="contact-grid">
          <div>
            <p className="eyebrow">05 / LET’S TALK</p>
            <h2>
              Good work starts
              <br />
              with a conversation<span>.</span>
            </h2>
            <p className="contact-intro">
              Have an engineering opportunity or a product idea? I’d love to
              hear about it.
            </p>
            <a className="contact-email" href={`mailto:${profile.email}`}>
              {profile.email}
              <ArrowUpRight size={21} />
            </a>
            <div className="social-links">
              <a href={profile.github} target="_blank" rel="noreferrer">
                <Github size={17} />
                GitHub
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer">
                <Linkedin size={17} />
                LinkedIn
              </a>
              <a href={profile.resume} download>
                <Mail size={17} />
                Download CV
              </a>
            </div>
            <p className="contact-location">{profile.location}</p>
          </div>
          <form
            onSubmit={submit}
            onChange={() => {
              if (status === "success") setStatus("idle");
            }}
          >
            <div className="form-row">
              <div>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  placeholder="Your name"
                  maxLength={120}
                />
              </div>
              <div>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  maxLength={254}
                />
              </div>
            </div>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tell me what you have in mind…"
              maxLength={5000}
            />
            <input
              type="checkbox"
              name="botcheck"
              className="honeypot"
              tabIndex={-1}
              aria-hidden="true"
            />
            <div className="form-submit">
              <button
                className="button button-light"
                type="submit"
                disabled={status === "submitting"}
              >
                {status === "submitting" ? "Sending…" : "Send message"}
                <ArrowRight size={17} />
              </button>
              <p>
                Sent through Web3Forms.
                <br />
                You can also email me directly.
              </p>
            </div>
            <div aria-live="polite" role="status">
              {status === "success" && (
                <p className="form-success">
                  Message sent. Thanks for reaching out!
                </p>
              )}
            </div>
            {status === "error" && (
              <p className="form-error" role="alert">
                Your message couldn’t be sent. Please try again or email me
                directly. Your text is still here.
              </p>
            )}
          </form>
        </div>
        <footer className="site-footer">
          <a href="#home" className="footer-name">
            AKIB<span>.</span>
          </a>
          <p>© {new Date().getFullYear()} Yeanul Haque Khan Akib</p>
          <a href="#home">Back to top ↑</a>
        </footer>
      </div>
    </section>
  );
}
