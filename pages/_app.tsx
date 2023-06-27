import "../styles/globals.css";
import '../public/antd.min.css';
import { MeshProvider } from "@meshsdk/react";
import { AppPropsWithLayout } from "@/models";
import { EmptyLayout } from "components/layout";
import withTheme from '../theme';
import { GoogleAnalytics } from "nextjs-google-analytics";


export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const Layout = Component.Layout ?? EmptyLayout;

  return withTheme(
    <>
      <GoogleAnalytics/>
      <MeshProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MeshProvider>
    </>
  );
}