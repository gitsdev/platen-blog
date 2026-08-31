import type { Metadata } from 'next';
import './globals.css';
import './brand.css';
const siteUrl = process.env.SITE_URL ?? 'https://blog.platben.com';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default:'The Platinum Benefit Journal | Long-Term Care Guidance', template:'%s | Platinum Benefit Journal' },
  description: 'Trusted guidance on long-term care, benefits, financial preparation, and planning for your family’s future.',
  openGraph: { title:'The Platinum Benefit Journal', description:'Trusted guidance for life’s most important care decisions.', type:'website', url:siteUrl, siteName:'The Platinum Benefit Journal', images:[{url:'/og.png',width:1536,height:1024,alt:'The Platinum Benefit Journal'}] },
  twitter: { card:'summary_large_image', title:'The Platinum Benefit Journal', description:'Trusted guidance for life’s most important care decisions.', images:['/og.png'] },
};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body>{children}</body></html>; }
