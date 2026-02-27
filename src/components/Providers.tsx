"use client";

import { Provider } from "react-redux";
import { ThemeProvider } from "next-themes";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { store } from "@/store/store";
import SocketProvider from "./SocketProvider";
import AuthInitializer from "./AuthInitializer";

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <GoogleOAuthProvider clientId={googleClientId}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthInitializer />
          <SocketProvider>{children}</SocketProvider>
        </ThemeProvider>
      </GoogleOAuthProvider>
    </Provider>
  );
}
