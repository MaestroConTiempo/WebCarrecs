import './globals.css';

export const metadata = {
  title: 'Càrrecs amb IA - Automatitza la gestió educativa',
  description: 'Programa d\'automatització per a seminaris de càrrecs de gestió educativa. Menys paperassa, més lideratge.',
  keywords: 'càrrecs educatius, IA, automatització, secretari, cap d\'estudis, coordinador pedagògic, director',
  icons: { icon: '/icon.png' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ca">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}
