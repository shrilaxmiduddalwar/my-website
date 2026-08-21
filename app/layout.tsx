import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ignito Corporation | Enterprise Digital Solutions & Software",
  description:
    "Ignito Corporation delivers enterprise-grade digital solutions for LPG distribution, mobile apps, websites, data analytics, and cloud automation.",
  keywords: [
    "Ignito Corporation",
    "digital solutions",
    "enterprise website",
    "IT services",
    "LPG distribution app",
    "Indore",
    "software engineering",
  ],
  authors: [{ name: "Ignito Corporation" }],
  icons: {
    icon: "/ignito.png",
    shortcut: "/ignito.png",
    apple: "/ignito.png",
  },
  openGraph: {
    title: "Ignito Corporation | Enterprise Digital Solutions & Software",
    description:
      "Ignito Corporation delivers enterprise-grade digital solutions for LPG distribution, mobile apps, websites, data analytics, and cloud automation.",
    url: "https://ignitocorporation.com/",
    siteName: "Ignito Corporation",
    images: [
      {
        url: "https://ignitocorporation.com/ignito.png",
        width: 800,
        height: 800,
        alt: "Ignito Corporation Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ignito Corporation | Enterprise Digital Solutions & Software",
    description:
      "Enterprise digital solutions for LPG distribution, mobile apps, websites, data analytics, and cloud automation.",
    images: ["https://ignitocorporation.com/ignito.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://ignitocorporation.com/#organization",
        name: "Ignito Corporation",
        url: "https://ignitocorporation.com/",
        logo: {
          "@type": "ImageObject",
          url: "https://ignitocorporation.com/ignito.png",
          caption: "Ignito Corporation Logo",
        },
        image: "https://ignitocorporation.com/ignito.png",
        description:
          "Ignito Corporation delivers enterprise-grade digital solutions for LPG distribution, mobile apps, websites, data analytics, and cloud automation.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Indore",
          addressRegion: "Madhya Pradesh",
          addressCountry: "IN",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@ignitocorporation.live",
          availableLanguage: ["English", "Hindi"],
        },
        sameAs: [
          "https://x.com/Ignito485001",
          "https://www.linkedin.com/company/ignito-corporation/about/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://ignitocorporation.com/#website",
        url: "https://ignitocorporation.com/",
        name: "Ignito Corporation",
        description: "Enterprise Digital Solutions & Software Engineering",
        publisher: {
          "@id": "https://ignitocorporation.com/#organization",
        },
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;600;700&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        {/* Schema.org Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning>
        {/* Google Analytics Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17300844145"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17300844145');

            window.gtag_report_conversion = function(url) {
              var opened = false;
              var callback = function () {
                if (!opened && typeof(url) !== 'undefined' && url) {
                  opened = true;
                  if (url.startsWith('tel:') || url.startsWith('mailto:')) {
                    window.location.href = url;
                  } else {
                    window.open(url, '_blank', 'noopener,noreferrer');
                  }
                }
              };
              setTimeout(callback, 400);
              try {
                if (typeof gtag === 'function') {
                  gtag('event', 'conversion', {
                    'send_to': 'AW-17300844145/e5HbCMW4heMcEPHc17lA',
                    'event_callback': callback,
                    'event_timeout': 2000
                  });
                } else {
                  callback();
                }
              } catch (err) {
                callback();
              }
              return false;
            };
          `}
        </Script>
        {children}
      </body>
    </html>
  );
}
