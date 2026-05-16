import type { Metadata } from "next";
// @ts-expect-error -- Next.js supports global CSS side-effect imports in app layout.
import "./globals.css";

export const metadata: Metadata = {
  title: "Crime Detection System",
  description: "AI-powered crime detection using video analysis",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container">
            <h1>Crime Detection System</h1>
            <nav>
              <a href="/">Home</a>
              <a href="/analyze">Analyze Video</a>
              <a href="/stream">Live Stream</a>
              <a href="/analytics">Analytics</a>
              <a href="/alerts">Alerts</a>
            </nav>
          </div>
        </header>
        <main className="main-content">{children}</main>
        <footer className="footer">
          <p>&copy; Crime Detection System.</p>
        </footer>
      </body>
    </html>
  );
}
