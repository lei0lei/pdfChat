// i18支持
"use client";
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import '../../styles/globals.css';
// 显示toast通知
import { Toaster } from 'react-hot-toast';

function App({ Component, pageProps }: AppProps<{}>) {
  
  return (
    <div>
      
      <Toaster />
      <Component {...pageProps} />
      
    </div>
  );
}

export default App;