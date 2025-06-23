'use client';
import './globals.css';
import { ReactNode, useEffect, useState } from 'react';

// export const metadata = {
//   title: 'Mini Podcast Generator',
// };

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    document.body.classList.toggle('dark', dark);
  }, [dark]);
  return (
    <button
      className="fixed top-4 right-4 px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border"
      onClick={() => setDark(d => !d)}
      aria-label="Toggle dark mode"
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  );
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
