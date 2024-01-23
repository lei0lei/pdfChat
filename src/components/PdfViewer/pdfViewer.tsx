import { Conversation,FileObj } from '../../types/chat';
import { KeyValuePair } from '../../types/data';
import { FC } from 'react';
import React, { useContext,useEffect} from 'react';
import { PdfContext } from '../../app/dashboard/context.js'; 
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import * as pdfjsLib from 'pdfjs-dist';

import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';


pdfjsLib.GlobalWorkerOptions.workerSrc= "https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js";
interface Props {

}

const PdfViewerx = () => {
    const { //tokens,
        //updateTokens,
            currentShowFile,
            currentShowFileObj,
            updateFileList,
            updateFileObjs, 
            updateDocs,
            updateCurrentShowFile,
            updateCurrentShowFileObj,
            updateVectorDatabase,
            updateSeq_id,
            updateConversationID,
            updateSessionID,
            socket,
            currentPageNum,
            setSocket } = useContext(PdfContext);
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { jumpToPage } = pageNavigationPluginInstance;
    useEffect(() => {
        // 页面变化时，跳转到指定页面
        if(currentPageNum>0){
        jumpToPage(currentPageNum-1);}
    }, [currentPageNum]);
    return (
        <div
                                    className="rpv-core__viewer"
                                    style={{
                                        border: '1px solid rgba(0, 0, 0, 0.3)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '100vh',
                                        width: '100%',
                                        
                                    }}
                            >
                                <div
                                        style={{
                                            alignItems: 'center',
                                            backgroundColor: '#eeeeee',
                                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                            display: 'flex',
                                            padding: '0px',
                                        }}
                                >
                                    <div
                                    style={{
                                        flex: 1,
                                        overflow: 'hidden',
                                        height: '80vh',
                                    }}
                                    >   
                                        {currentShowFileObj && currentShowFileObj._file&&(
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js">
                                            <Viewer fileUrl={currentShowFileObj._file}
                                                    plugins={[defaultLayoutPluginInstance,pageNavigationPluginInstance]} 
                                            />
                                        </Worker>
                                        )}

                                        {!currentShowFileObj._file&&<p>请选择文件</p>}
                                    </div>
                                </div>
                            </div>
    );
};

export default PdfViewerx;