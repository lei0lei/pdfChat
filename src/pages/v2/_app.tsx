// i18支持
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
// 显示toast通知
import { Toaster } from 'react-hot-toast';

function App({ Component, pageProps }: AppProps<{}>) {
  return (
    <div>
      <Toaster />
      {/* 当前页面组件 */}
      <Component {...pageProps} />
    </div>
  );
}

export default appWithTranslation(App);