import "@/styles/globals.css";
import AuthProvider from "@/components/AuthProvider";
import Layout from "@/components/Layout";

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}



