// Import the Layout component with the correct path
import { AppProps } from "next/app";
import Layout from "../components/layout";

import '../styles/global.css';

export default function MyApp({ Component, pageProps } : AppProps) {
  // Ensure Layout is a valid React component
  // and that it properly renders its children
  return (
    <Layout>
      {/* Pass the Component and pageProps to the Layout */}
      <Component {...pageProps} />
    </Layout>
  )
}
