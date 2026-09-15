import "./globals.css";

export const metadata = {
  title: "Indian Fintech Logos",
  description:
    "Logos of Indian banks, card networks and UPI apps — trimmed, centred and exported as svg and png on one square canvas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scheme-dark">
      <body className="bg-bg font-sans text-[15px] leading-normal text-fg antialiased">
        {children}
      </body>
    </html>
  );
}
