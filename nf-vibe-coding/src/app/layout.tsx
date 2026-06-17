import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NF Vibe Coding — User Manager",
  description: "Next.js + MySQL user management demo app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <header className="header">
          <div className="container">
            <a href="/" className="logo">NF Vibe Coding</a>
            <nav>
              <a href="/" className="nav-link">Users</a>
              <a href="/users/new" className="nav-link nav-link--primary">+ New User</a>
            </nav>
          </div>
        </header>
        <main className="main">
          <div className="container">
            {children}
          </div>
        </main>
        <footer className="footer">
          <div className="container">
            <p>NF Vibe Coding &copy; {new Date().getFullYear()}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
