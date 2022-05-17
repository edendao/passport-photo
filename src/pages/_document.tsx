import Document, { Head, Html, Main, NextScript } from "next/document"

const APP_NAME = "Adoro"
const APP_DESCRIPTION =
  "A deepfake app that lets you perform Italian opera classics using only a selfie."

export default class DocumentElement extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta name="application-name" content={APP_NAME} />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content={APP_NAME} />
          <meta name="description" content={APP_DESCRIPTION} />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#FFFFFF" />

          <meta name="twitter:card" content={APP_DESCRIPTION} />
          <meta name="twitter:site" content="@TheEdenDao" />
          <meta name="twitter:title" content={APP_NAME} />
          <meta name="twitter:description" content="ReFi Passport NFT" />
          <meta name="twitter:image" content="/icons/adoro-192x192x.png" />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="../src/assets/adoro-touch-icon.png"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;900&display=swap"
            rel="stylesheet"
          />

          <link rel="manifest" href="/manifest.json" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
