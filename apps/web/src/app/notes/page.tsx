import type { Metadata } from "next";
import NotesClientPage from "./page-client";

export const metadata: Metadata = {
  title: "AI Note Sharer - Write and Share Notes Online - GenAI Academy & Hub",
  description: "Create notes with gorgeous visual themes, copy a unique global link, and share them instantly with friends. Completely database-less, private, and features a built-in text-to-speech reader.",
  keywords: [
    "AI note sharer",
    "share notes online",
    "private note sharing",
    "database-less sharing",
    "text to speech reader",
    "visual note themes"
  ],
  alternates: {
    canonical: "https://genaia-academy.com/notes",
  },
  openGraph: {
    title: "AI Note Sharer - Write and Share Notes Online - GenAI Academy & Hub",
    description: "Create notes with gorgeous visual themes, copy a unique global link, and share them instantly with friends. Completely database-less, private, and features a built-in text-to-speech reader.",
    url: "https://genaia-academy.com/notes",
    type: "website",
    siteName: "GenAI Academy & Hub",
  },
};

export default function NotesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "AI Note Sharer",
    "url": "https://genaia-academy.com/notes",
    "description": "An interactive database-less note editor and viewer that serializes document state into URL-safe sharing links.",
    "applicationCategory": "UtilityApplication",
    "operatingSystem": "All",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NotesClientPage />
    </>
  );
}
