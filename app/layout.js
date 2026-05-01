
import "./globals.css";
import NavbarComponent from "./components/NavbarComponent";


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavbarComponent />
        {children}
        </body>
    </html>
  );
}
