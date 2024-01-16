import {useState} from 'react'
import './PdfViewer.css'
import { Worker } from '@react-pdf-viewer/core';
import { Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import {MyChatbot} from './Chatbot.js'
import { PdfContext } from './context.js'; 
import * as pdfjsLib from 'pdfjs-dist';
// import {  type PutBlobResult } from '@vercel/blob';
// import { upload } from '@vercel/blob/client';
// import io from 'socket.io-client'
import React, { useContext, useEffect } from 'react';
// import SocketContext from './SocketContext';
// import { createHash } from 'crypto';
// import { BlobServiceClient } from '@azure/storage-blob';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

// 一个函数用于上传文件


pdfjsLib.GlobalWorkerOptions.workerSrc= "https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js";
const PdfViewer = () => {
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const pageNavigationPluginInstance = pageNavigationPlugin();
    const { jumpToPage } = pageNavigationPluginInstance;
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [blob, setBlob] = useState(null);
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
            // console.log(tokens)
            // updateTokens(localStorage.getItem("token"))
            useEffect(() => {
                // 页面变化时，跳转到指定页面
                if(currentPageNum>0){
                jumpToPage(currentPageNum-1);}
            }, [currentPageNum]);
    // creating new plugin instance
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    // pdf file onChange state
    // const [pdfFile, setPdfFile]=useState(null);

    // pdf file error state
    const [pdfError, setPdfError]=useState('');

    // handle file onChange event
    const allowedFiles = ['application/pdf'];
    let _sessionID,_conversationID,_seqID;
    const handleOpenDialog = () => {
        setShowConfirmationDialog(true);
      }
    
      const handleCloseDialog = () => {
        setShowConfirmationDialog(false);
      }
    
      const handleConfirmation = (confirmed) => {
        if (confirmed) {
          setDisabledInput(false);
          handleFile();
        }
        setShowConfirmationDialog(false);
      }
      const handleChange = (e) => {
        const file = e.target.files[0];
        console.log('file')
        console.log(file)
        setSelectedFile(e);
        setShowConfirmationDialog(true);
      };
      
      
      
    const handleFile = async (e) =>{
        
        // 重新建立socket连接，每次点击上传都会重新建立socket连接关闭旧的。
        if(localStorage.getItem('token')===null){alert('Please signin.')}
        if (socket) {
            socket.disconnect();
            updateSeq_id(0);
          }
        //创建socket连接
        const io = require('socket.io-client');
        const newSocket = io('wss://pdfchat-server.azurewebsites.net/ws',{
            extraHeaders: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              },
            
        });
        console.log('connect')
        // console.log(tokens)
        console.log(localStorage.getItem("token"))
        // const newSocket = io('ws://localhost:8080/ws',{
        //     extraHeaders: {
        //         Authorization: `Bearer ${localStorage.getItem("token")}`
        //       },
        //     //   reconnection: true
        // });
        // console.log(tokens)
        newSocket.on('connect', () => {
            setSocket(newSocket);
            console.log('WebSocket连接已打开!');
            
            newSocket.on('error', (error) => {
                console.log('Socket.io 错误: ', error);
            });
        
            newSocket.on('disconnect', () => {
                console.log('Socket.io 连接已关闭');})

            if (newSocket.connected){console.log('socket state ok');newSocket.emit('getSession',null)};
        });
        
        newSocket.on('IDs', (data) => {
            _sessionID = data.sessionID
            _conversationID = data.conversationID
            _seqID = data.seqenceID
            console.log('You have got session id from server:')
            console.log(_sessionID);
            console.log(_conversationID);
            updateSessionID(_sessionID)
            updateConversationID(_conversationID)
            updateSeq_id(_seqID)
        });

        // 多文件上传
        // 文件上传后后台服务器会进行如下一系列操作
        // 将文件存放到后端blobs
        // 提取文件的文本-附带文件链接及sha256传送给后端-构建vectordb-存放到后端数据库中
        
        //更新文件名和文件列表
        function FileContent(fileName, fileUrl, fileText, fileSha256, fileType) {
            this.fileName = fileName;
            this.fileUrl = fileUrl;
            this.fileText = fileText;
            this.fileSha256 = fileSha256;
            this.fileType = fileType;
        }

        let filesName = []
        let files = []

        
        let promises = [];
        let files_url = []
        let files_contents = [];
        let files_sha256 = [];
        let fileContents = [];
        console.log('xxxxxx')
        console.log(e.target.file)
        for (let selectedFile of e.target.files){
            let finalText = "";
            filesName.push(selectedFile.name)
            finalText += 'FILENAME:'+ selectedFile.name+'[*]';
            //上传文件到vercel
            // const newBlob = await upload(selectedFile.name, selectedFile, {
            //     access: 'public',
            //     handleUploadUrl: '/api/pdf/upload2blob',
            // });
            // const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000'; 
            
            
            if(selectedFile){
                if(selectedFile&&allowedFiles.includes(selectedFile.type)){
                    
                    let reader = new FileReader();
                    let tosha256 = new FileReader();
                    reader.readAsDataURL(selectedFile);

                    // const loadPromise = reader.onloadend=async (e)=>{
                    let promise = new Promise((resolve, reject) => {
                        reader.onloadend=async (e)=>{
                            let CryptoJS = require("crypto-js");
                            let base64 = e.target.result;
                            let base64Content = base64.split(",")[1]; 
                            let wordArray = CryptoJS.enc.Base64.parse(base64Content);
                            let hash = CryptoJS.SHA256(wordArray);
                            let _fileUrl = null;
                            //检测文件存在性
                            // await new Promise((r) => {
                            new Promise((resolve, reject) => {
                                    newSocket.emit('findFile',hash.toString(CryptoJS.enc.Hex),async (response) => {
                                        if(!response){
                                            let blob = null;
                                            console.log('on upload file')
                                            const uploadResponse = await fetch('/api/pdf/upload2blob', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ file: e.target.result, name: selectedFile.name })
                                            });
                                            const uploadResponseData = await uploadResponse.json();
                                            console.log(uploadResponseData)
                                            _fileUrl = uploadResponseData.url
                                            console.log(_fileUrl)
                                            let progress = 0;
                                            const interval = setInterval(() => {
                                            if (progress >= 100) {
                                                clearInterval(interval);
                                            }
                                            setUploadProgress(progress);
                                            progress += 10;
                                            }, 500);

                                            setTimeout(() => {
                                            clearInterval(interval);
                                            setUploadProgress(100);
                                            }, 3000);
                                            resolve(uploadResponse);           
                                        }else{
                                        resolve()
                                        setUploadProgress(100)}
                                        
                                    });
                            }).then(async () => {

                                files.push({_file:e.target.result,_fileName:selectedFile.name})
                                const res = await fetch(e.target.result);
                                const buffer = await res.arrayBuffer();
                                // console.log(uploadResponse.url)
                                // 加载PDF文档
                                let loadingTask = pdfjsLib.getDocument({data: buffer});
                                const pdf = await loadingTask.promise;

                                for (let i = 1; i <= pdf.numPages; i++) {
                                    finalText += 'PAGENUM:'+ i.toString()+'[*]';
                                    const page = await pdf.getPage(i);

                                    const textContent = await page.getTextContent();
                                    const strings = textContent.items.map(item => item.str);

                                    finalText += strings.join(" ") + "\n";
                                }
                                console.log(_fileUrl)
                                fileContents.push({fileName: selectedFile.name,
                                                    fileUrl: _fileUrl||null,
                                                    fileText: finalText,
                                                    fileSha256: hash.toString(CryptoJS.enc.Hex),
                                                    fileType:selectedFile.type});
                                // Here finalText is the variable which holds the text content of the PDF
                                resolve();
                            })
                            .catch((error) => {
                            // 在这里处理任何错误
                            console.error("Error: ", error);
                            });
                        }
                    });
                    promises.push(promise);
                    
                } else {
                setPdfError('Not a valid pdf: Please select only PDF');
                
                }
            } else {
            console.log('please select PDF');
            }
        }
        
        // await Promise.all(loadPromises);
        setShowProgressBar(true);
        setUploading(true);
        await Promise.all(promises);
        setUploading(false); 
        setShowProgressBar(false);
        // 文件上传服务器
        console.log(fileContents)
        newSocket.emit('onUpload',fileContents)
        //设置当前文件名
        // updateDocs(finalText)
        // updateVectorDatabase(finalText)
        updateFileList(filesName);
        updateFileObjs(files);
        
        updateCurrentShowFile(filesName[0]);
        //设置当前文件
        updateCurrentShowFileObj(files[0]);
    }

    return (
        <>
            
            <div style={{
                
                border: '1px solid black',
                margin: '1rem',
                padding: '0rem 0rem',
                height: '5vh',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#357edd',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    padding: '8px',
                    width: '93%',
                    margin: '0 auto',
                    height: '5vh'
                }}>
                    <div
                             style={{
                                backgroundColor: '#357edd',
                                border: 'none',
                                borderRadius: '4px',
                                color: '#ffffff',
                                cursor: 'pointer',
                                padding: '8px',
                                position: 'relative',
                                textAlign: 'center',
                            }}
                        >
                            
                        <input type='file' 
                                multiple accept='application/pdf'
                                style={{
                                    bottom: 0,
                                    cursor: 'pointer',
                                    height: '100%',
                                    left: 0,
                                    opacity: 0,
                                    position: 'absolute',
                                    right: 0,
                                    top: 0,
                                    width: '80%',
                                }}
                                onChange={handleChange}>
                        
                        </input>
                        {showConfirmationDialog && (
                            <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-black p-10 rounded shadow-md w-1/3">
                                <h2 className="text-2xl font-bold mb-2 text-blue-500">上传文件</h2>
                                <p className="mt-2 text-lg text-black">确认上传文件吗？</p>
                                <div className="flex mt-4">
                                {/* 确认按钮 */}
                                <button
                                    className="btn btn-primary mr-2"
                                    onClick={async () => {
                                    setShowConfirmationDialog(false);
                                    await handleFile(selectedFile);
                                    }}
                                >
                                    确认
                                </button>
                                {/* 取消按钮 */}
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                    setShowConfirmationDialog(false);
                                    }}
                                >
                                    取消
                                </button>
                                </div>
                            </div>
                            </div>
                        )}
                        {/* we will display error message in case user select some file
                        other than pdf */}
                        {pdfError&&<span className='text-danger'>{pdfError}</span>}
                        加载PDF文件
                        </div>
                </div>
                <div className= 'parent'>
                        <div id = "element1">
                            <div
                                    className="rpv-core__viewer"
                                    style={{
                                        border: '1px solid rgba(0, 0, 0, 0.3)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: '80vh',
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
                        </div>
                        <div id = "element2">
                            
                            <MyChatbot />
                                
                        </div>
                    
                </div>
            </div>
            {uploading && showProgressBar && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-10 rounded shadow-md w-1/3">
                    <h2 className="text-2xl font-bold mb-2 text-blue-500">上传进度</h2>
                    <div className="h-4 w-full bg-gray-200 rounded relative">
                        <div
                        style={{
                            width: `${uploadProgress}%`,
                            transition: 'width 0.2s ease-in-out',
                            position: 'absolute',
                            left: '0',
                            top: '0',
                            height: '100%',
                            backgroundColor: '#1f81e7',
                            borderRadius: 'inherit',
                        }}
                        className="rounded progress-bar"
                        ></div>
                    </div>
                    <p className="mt-2 text-lg text-black">
                        {uploadProgress === 100 ? '上传完成' : `${uploadProgress}%`}
                    </p>
                    </div>
                </div>
                )}
        </>
    );


}

export default PdfViewer;
