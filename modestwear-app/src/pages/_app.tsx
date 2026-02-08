import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from '@react-oauth/google';

import { store } from "@/store/store";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

import "@/styles/globals.css";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <div className="min-h-screen flex flex-col">
          <Header />

          <main className="flex-1">
            <Component {...pageProps} />
          </main>

          <Footer />
          <Toaster position="top-right" />
        </div>
      </Provider>
    </GoogleOAuthProvider>
  );
}