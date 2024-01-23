import { Html, Head, Main, NextScript, DocumentProps } from 'next/document';
import i18nextConfig from '../../../next-i18next.config';

type Props = DocumentProps & {
  // add custom document props
};

export default function Document(props: Props) {
  // const currentLocale =
    // props.__NEXT_DATA__.locale ?? i18nextConfig.i18n.defaultLocale;
  return (
    <Html>
      <Head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Chatbot UI"></meta>
      </Head>
      <body>
        {/* 插入主应用组件 */}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
