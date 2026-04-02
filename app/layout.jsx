import './globals.css';

export const metadata = {
  title: 'Centre IA en Marxa - Implementació de sistemes IA per a centres educatius',
  description: 'Programa d\'implementació per a escoles. Diagnòstic gratuït. Fluxos automatitzats, assistents personalitzats, manual operatiu i criteris RGPD.',
  keywords: 'educació, IA, automatització, centre educatiu, Cataluña',
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
