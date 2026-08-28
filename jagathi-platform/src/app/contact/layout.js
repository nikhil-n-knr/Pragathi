export const metadata = {
  title: "Contact Jagathi | Infrastructure & Fit-Out Enquiries",
  description: "Get in touch with Jagathi for commercial construction, civil engineering, and luxury interior design projects.",
  alternates: {
    canonical: "https://jagathi.co/contact/",
  },
  openGraph: {
    title: "Contact Jagathi | Infrastructure & Fit-Out Enquiries",
    description: "Get in touch with Jagathi for commercial construction, civil engineering, and luxury interior design projects.",
    url: "https://jagathi.co/contact/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Jagathi | Infrastructure & Fit-Out Enquiries",
    description: "Get in touch with Jagathi for commercial construction, civil engineering, and luxury interior design projects.",
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
      "name": "Contact Us",
      "item": "https://jagathi.co/contact/"
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
