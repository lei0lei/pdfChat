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
import { upload } from '@vercel/blob/client';
import io from 'socket.io-client'
import React, { useContext, useEffect } from 'react';
// import SocketContext from './SocketContext';
import { createHash } from 'crypto';
import { BlobServiceClient } from '@azure/storage-blob';

pdfjsLib.GlobalWorkerOptions.workerSrc= "https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js";
const PdfViewer = () => {
    const [blob, setBlob] = useState(null);
    const { currentShowFile,
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
            setSocket } = useContext(PdfContext);
    useEffect(() => {
        console.log(currentShowFile)
                // 放置组件需要做的操作，例如 fetch 数据，或者更新状态
            }, [currentShowFile]);
    // creating new plugin instance
    const defaultLayoutPluginInstance = defaultLayoutPlugin();

    // pdf file onChange state
    // const [pdfFile, setPdfFile]=useState(null);

    // pdf file error state
    const [pdfError, setPdfError]=useState('');

    // handle file onChange event
    const allowedFiles = ['application/pdf'];
    let _sessionID,_conversationID,_seqID;
    const handleFile = async (e) =>{
        // 重新建立socket连接，每次点击上传都会重新建立socket连接关闭旧的。
        if (socket) {
            socket.disconnect();
            updateSeq_id(0);
          }
        
        //创建socket连接
        const io = require('socket.io-client');
        const newSocket = io('wss://pdfchat-server.azurewebsites.net/ws');
        // const newSocket = io('ws://localhost:8080/ws');
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
                                            resolve(uploadResponse);           
                                        }else{resolve()}
                                        
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
        await Promise.all(promises); 
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
                height: '7vh',
            }}>
                <div style={{
                            display: 'flexbox',
                            backgroundColor: '#357edd',
                            border: 'none',
                            borderRadius: '4px',
                            color: '#ffffff',
                            cursor: 'pointer',
                            padding: '8px',
                            width: '100%',
                            
                            
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
                                    width: '100%',
                                }}
                                onChange={handleFile}>
                        
                        </input>

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
                                        height: '100vh',
                                    }}
                                    >   
                                        {currentShowFileObj && currentShowFileObj._file&&(
                                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js">
                                            <Viewer fileUrl={currentShowFileObj._file}
                                                    plugins={[defaultLayoutPluginInstance]} 
                                            />
                                        </Worker>
                                        )}

                                        {!currentShowFileObj._file&&<p>No file is selected yet</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id = "element2">
                            
                            <MyChatbot />
                                
                        </div>
                    
                </div>
            </div>
        </>
    );


}

export default PdfViewer;
