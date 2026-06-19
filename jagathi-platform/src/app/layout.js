import "./globals.css";
import MainLayout from "../layouts/MainLayout";

export const metadata = {
  title: "Jagathi Company | Architectural Shaping & Legacy Building",
  description: "WebGL fluid systems, melting typography, and spatial structures built with React, Next.js, and React Three Fiber.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
