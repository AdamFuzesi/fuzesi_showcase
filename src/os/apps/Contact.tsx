import emailjs from "@emailjs/browser";
import { useState, type FormEvent } from "react";
import { contact } from "../../content";
import { PixelIcon } from "../icons/PixelIcon";
import { Button, Field, StatusBar } from "../ui";
import a from "./apps.module.css";

type Status = { kind: "idle" | "sending" | "sent" | "error"; message: string };

/** Mail composer wired to the existing EmailJS template. */
export function ContactApp() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<Status>({ kind: "idle", message: "Ready" });
  const set = (key: keyof typeof form) => (value: string) => setForm((f) => ({ ...f, [key]: value }));

  const send = async (e: FormEvent) => {
    e.preventDefault();
    setStatus({ kind: "sending", message: "Sending…" });
    try {
      await emailjs.send(
        contact.YOUR_SERVICE_ID,
        contact.YOUR_TEMPLATE_ID,
        { from_name: form.email, user_name: form.name, to_name: contact.MY_EMAIL, message: form.message },
        { publicKey: contact.YOUR_USER_ID },
      );
      setForm({ name: "", email: "", message: "" });
      setStatus({ kind: "sent", message: "Message sent — thanks! I'll get back to you shortly." });
    } catch (err) {
      const text = err && typeof err === "object" && "text" in err ? String(err.text) : "unknown error";
      setStatus({ kind: "error", message: `Couldn't send (${text}). Try emailing ${contact.MY_EMAIL}.` });
    }
  };

  return (
    <form className={a.column} onSubmit={send}>
      <div className={`${a.grow} ${a.scroll} ${a.pad}`}>
        <div className={a.contactHeader}>
          <PixelIcon name="mail" size={32} />
          <p>{contact.description}</p>
        </div>
        <Field label="To:" name="to" value={contact.MY_EMAIL} readOnly />
        <Field label="Name:" name="name" value={form.name} required onChange={set("name")} />
        <Field label="From:" name="email" type="email" value={form.email} required onChange={set("email")} />
        <Field label="Message:" name="message" multiline value={form.message} required onChange={set("message")} />
        <div className={`${a.buttonRow}`}>
          <Button type="submit" isDefault disabled={status.kind === "sending"}>
            Send
          </Button>
        </div>
      </div>
      <StatusBar fields={[status.message]} />
    </form>
  );
}
