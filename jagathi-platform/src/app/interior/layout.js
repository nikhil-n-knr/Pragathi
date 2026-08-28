export const metadata = {
  title: "Architectural Interior Design & Fit-Outs | Jagathi",
  description: "Bespoke interior design, spatial planning, turnkey fit-outs, and luxury architectural interior solutions by Jagathi.",
  alternates: {
    canonical: "https://jagathi.co/interior/",
  },
  openGraph: {
    title: "Architectural Interior Design & Fit-Outs | Jagathi",
    description: "Bespoke interior design, spatial planning, turnkey fit-outs, and luxury architectural interior solutions by Jagathi.",
    url: "https://jagathi.co/interior/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Architectural Interior Design & Fit-Outs | Jagathi",
    description: "Bespoke interior design, spatial planning, turnkey fit-outs, and luxury architectural interior solutions by Jagathi.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://jagathi.co/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Architectural Interior Solutions",
      "item": "https://jagathi.co/interior/"
    }
  ]
};

export default function Layout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
