import "../styles/globals.css";
import { MeshProvider } from "@meshsdk/react";
import { AppPropsWithLayout } from "@/models";
import { EmptyLayout } from "components/layout";
import { createEmotionCache, theme } from "@/utils";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
const clientSideEmotionCache = createEmotionCache()

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const Layout = Component.Layout ?? EmptyLayout;

  return (
    <>
      <MeshProvider>
        <CacheProvider value={clientSideEmotionCache}>
          <ThemeProvider theme={theme}>
          <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </CacheProvider>
      </MeshProvider>
    </>
  );
}