import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata = {
  title: "FinAssets",
  description:
    "Clean, consistent logos for every Indian bank, card network and UPI app. Free to use, in svg and png.",
};

export default function RootLayout({ children }) {
  return (
    // suppressHydrationWarning: next-themes sets the class on <html> before hydration
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg font-sans text-[15px] leading-normal text-fg antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
