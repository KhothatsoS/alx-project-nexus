import type { AppProps } from "next/app";
import { Provider } from "react-redux";

import { store } from "@/store/store";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";

import "@/styles/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
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
  );
}
