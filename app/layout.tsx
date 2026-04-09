import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "VIAH – India's AI Learning Platform",
  description: "VIAH is an e-learning platform that brings together all courses from the Indian national curriculum. Experience personalized, engaging, and interactive learning powered by AI.",
  icons: {
    icon: [{ url: "/assets/logo/logo_viah.png", type: "image/png" }],
    apple: "/assets/logo/logo_viah.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
