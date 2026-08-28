export const metadata = {
  title: "Construction Services & Engineering | Jagathi",
  description: "Jagathi delivers heavy civil construction, commercial structural engineering, and master-planned infrastructure projects.",
  alternates: {
    canonical: "https://jagathi.co/construction/",
  },
  openGraph: {
    title: "Construction Services & Engineering | Jagathi",
    description: "Jagathi delivers heavy civil construction, commercial structural engineering, and master-planned infrastructure projects.",
    url: "https://jagathi.co/construction/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Construction Services & Engineering | Jagathi",
    description: "Jagathi delivers heavy civil construction, commercial structural engineering, and master-planned infrastructure projects.",
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
      "name": "Construction & Engineering",
      "item": "https://jagathi.co/construction/"
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
