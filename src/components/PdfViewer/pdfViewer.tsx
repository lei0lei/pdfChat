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
import { DocumentAddIcon, DocumentIcon } from '@heroicons/react/solid' 
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { HiDocumentChartBar } from 'react-icons/hi2';


pdfjsLib.GlobalWorkerOptions.workerSrc= "https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js";
interface Props {
    lightMode,
}

const PdfViewerx = (
    lightMode,
) => {
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
        // @ts-ignore
        if(currentPageNum>0){
            // @ts-ignore
        jumpToPage(currentPageNum-1);}
    }, [currentPageNum]);

    return (
        <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
        <div
                                    className="rpv-core__viewer"
                                    style={{
                                        // border: '1px solid rgba(0, 0, 0, 0.3)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '90%',
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
                                        height: '100vh',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    >   
                                        {// @ts-ignore
                                        currentShowFileObj && currentShowFileObj._file&&(
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js">
                                            <Viewer theme={lightMode['lightMode']} 
                                            fileUrl={
                                                // @ts-ignore
                                            currentShowFileObj._file}
                                                    plugins={[defaultLayoutPluginInstance,pageNavigationPluginInstance]} 
                                            />
                                        </Worker>
                                        )}

                                        {// @ts-ignore
                                        !currentShowFileObj._file&&(<div className="flex flex-col items-center justify-center space-y-4 bg-white shadow-md rounded-md p-6">
                                        <DocumentIcon className="w-24 h-24 text-blue-500" />
                                        <p className="text-lg font-medium text-gray-700">未选择文件</p>
                                      </div>)}
                                    </div>
                                </div>
                            </div>
                            </div>
    );
};

export default PdfViewerx;
