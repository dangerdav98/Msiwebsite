"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "./book.css";
import BookingWidget from "@/components/BookingWidget";

function splitName(full: string): [string, string] {
  const trimmed = full.trim();
  if (!trimmed) return ["", ""];
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return [parts[0], ""];
  return [parts.slice(0, -1).join(" "), parts[parts.length - 1]];
}

function BookPageContent() {
  const params = useSearchParams();
  const lang = params.get("lang") === "es" ? "es" : "en";
  const [firstName, lastName] = splitName(params.get("name") || "");

  const heading =
    lang === "es" ? "Reserve Su Llamada Estratégica Gratuita de 30 Minutos" : "Book Your Free 30-Min Strategy Call";
  const sub =
    lang === "es"
      ? "Elija una fecha y hora que le funcione. Le enviaremos la confirmación por correo."
      : "Pick a date and time that works for you. We'll send confirmation to your email.";

  return (
    <main>
      <h1>{heading}</h1>
      <p className="book-sub">{sub}</p>
      <BookingWidget
        lang={lang}
        prefill={{
          firstName,
          lastName,
          phone: params.get("phone") || "",
          email: params.get("email") || "",
          businessName: params.get("business") || "",
        }}
      />
    </main>
  );
}

export default function BookPage() {
  return (
    <div className="book-page">
      <div className="book-nav">
        <Link href="/">
          Surface <b>Growth</b> Advisor
        </Link>
      </div>
      <Suspense fallback={null}>
        <BookPageContent />
      </Suspense>
    </div>
  );
}
