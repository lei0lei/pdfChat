"use client"; 
import 'react-chatbot-kit/build/main.css'
// import Sidebar from './components/layout/Sidebar.js';
// import PdfViewerWithUploadBtn from './components/pdfviewer/PdfViewer.tsx'

// import { Navigation } from './Navigation.js'
import React from 'react';
import './app.css'
import { PdfProvider } from './provider.js';
// import PdfViewer from './PdfViewerx.js'
import dynamic from 'next/dynamic';

const _PdfProvider = dynamic(() => import('./provider'), {
  ssr: false // This line will disable server-side render
});

const _PdfViewer = dynamic(() => import('./PdfViewerx'), {
  ssr: false // This line will disable server-side render
});

const _Navigation = dynamic(() => import('./Navigation'), {
  ssr: false // This line will disable server-side render
});

export default function Home() {
  return (
    <>
      <_PdfProvider>
        <div>
        <_Navigation />
        </div>
        <_PdfViewer />
       </_PdfProvider>
       
    </>
  );
}


