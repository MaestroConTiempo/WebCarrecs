import './globals.css';

export const metadata = {
  title: 'Càrrecs amb IA - Automatitza la gestió educativa',
  description: 'Programa d\'automatització per a seminaris de càrrecs de gestió educativa. Menys paperassa, més lideratge.',
  keywords: 'càrrecs educatius, IA, automatització, secretari, cap d\'estudis, coordinador pedagògic, director',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ca">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
