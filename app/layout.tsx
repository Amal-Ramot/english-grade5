import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/fredoka';
import '@fontsource-variable/rubik';
import './globals.css';

export const metadata: Metadata = {
  title: 'English Quest · אנגלית לכיתה ה׳',
  description: 'תרגול אנגלית לכיתה ה׳ — קריאה, אוצר מילים ו־am / is / are במשחקים קצרים.',
};
export const viewport: Viewport = { themeColor: '#fff8ec', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
