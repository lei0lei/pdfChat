"use client"; 
import 'react-chatbot-kit/build/main.css'
// import Sidebar from './components/layout/Sidebar.js';
// import PdfViewerWithUploadBtn from './components/pdfviewer/PdfViewer.tsx'
// import { MathJax } from "react-mathjax2";
// import { Navigation } from './Navigation.js'
import React from 'react';
import './app.css'
import { PdfProvider } from './provider.js';
// import PdfViewer from './PdfViewerx.js'
import dynamic from 'next/dynamic';
// import { MathJaxContext } from 'better-react-mathjax';
import SocketContextComponent from './SocketContextProvider.js';
// import SocketContext from "./SocketContext";
const _PdfProvider = dynamic(() => import('./provider.js'), {
  ssr: false // This line will disable server-side render
});
// const _SocketContextComponent = dynamic(() => import('./SocketContextProvider.js'), {
//   ssr: false // This line will disable server-side render
// });
const _PdfViewer = dynamic(() => import('./PdfViewerx.js'), {
  ssr: false // This line will disable server-side render
});

const _Navigation = dynamic(() => import('./Navigation.js'), {
  ssr: false // This line will disable server-side render
});

export default function Dashboard() {
  // const config = {
  //   tex2jax: {
  //     inlineMath: [["$", "$"]],
  //     displayMath: [["$$", "$$"]]
  //   }
  // };

  return (
    <>
    {/* <SocketContext.Provider value={null}> */}
      <div>
      {/* <MathJax.Context options={mathJaxOptions}> */}
      {/* <MathJaxContext config={config} version={2}> */}
      <_PdfProvider>
        <div>
        <_Navigation />
        </div>
        <_PdfViewer />
       </_PdfProvider>
       {/* </MathJaxContext> */}
       {/* </MathJax.Context> */}
       </div>
       {/* </SocketContext.Provider> */}
    </>
  );
}


