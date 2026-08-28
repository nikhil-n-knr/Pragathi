export const metadata = {
  title: "Civil Engineering & Infrastructure | Jagathi",
  description: "Master planning, civil infrastructure development, and industrial structural engineering solutions by Jagathi.",
  alternates: {
    canonical: "https://jagathi.co/civil-market/",
  },
  openGraph: {
    title: "Civil Engineering & Infrastructure | Jagathi",
    description: "Master planning, civil infrastructure development, and industrial structural engineering solutions by Jagathi.",
    url: "https://jagathi.co/civil-market/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Civil Engineering & Infrastructure | Jagathi",
    description: "Master planning, civil infrastructure development, and industrial structural engineering solutions by Jagathi.",
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
      "name": "Civil Land Infrastructure",
      "item": "https://jagathi.co/civil-market/"
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
