import "./globals.css";

export const metadata = {
  title: "Indian Fintech Logos",
  description:
    "Clean, consistent logos for every Indian bank, card network and UPI app. Free to use, in svg and png.",
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
