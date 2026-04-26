import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SavedProvider } from "@/context/SavedContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BraineX | Empower Your Future",
  description: "Your gateway to scholarships, mentorship, projects, and global opportunities.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body className={inter.className}>
        <ThemeProvider>
          <SavedProvider>
            <div className="bg-mesh"></div>
            {children}
          </SavedProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
