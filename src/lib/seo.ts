import { Metadata } from 'next';

const defaultMetadata = {
  title: 'Type100X | The Fastest Typing Practice Platform',
  description: 'Improve your typing speed and accuracy with Type100X. Practice with custom texts, take typing tests, or simulate Indian Government exams like SSC and RRB without any account required.',
  keywords: 'typing practice, typing test, wpm, ssc typing, rrb typing, type100x',
  applicationName: 'Type100X',
  themeColor: '#050505',
};

interface ConstructMetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description,
  keywords,
  image = '/og-image.png',
  canonical,
  noIndex = false,
}: ConstructMetadataProps = {}): Metadata {
  return {
    title: title ? `${title} - Type100X` : defaultMetadata.title,
    description: description || defaultMetadata.description,
    keywords: keywords ? keywords.join(', ') : defaultMetadata.keywords,
    applicationName: defaultMetadata.applicationName,
    authors: [{ name: "Type100X Team" }],
    creator: "Type100X",
    alternates: {
      canonical: canonical ? `https://type100x.com${canonical}` : undefined,
    },
    openGraph: {
      title: title ? `${title} - Type100X` : defaultMetadata.title,
      description: description || defaultMetadata.description,
      type: 'website',
      url: canonical ? `https://type100x.com${canonical}` : 'https://type100x.com',
      siteName: 'Type100X',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title || defaultMetadata.title,
        },
      ],
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: title ? `${title} - Type100X` : defaultMetadata.title,
      description: description || defaultMetadata.description,
      images: [image],
      creator: '@type100x',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    appleWebApp: {
      capable: true,
      title: defaultMetadata.applicationName,
      statusBarStyle: 'default',
    },
  };
}
