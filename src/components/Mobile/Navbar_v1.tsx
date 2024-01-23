import { FileObj } from '../../types/chat';
import { IconPlus } from '@tabler/icons-react';
import { FC } from 'react';
import { useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import React, { useContext, useEffect, useState} from 'react';
import { PdfContext } from '../../app/dashboard/context.js'; 
interface Props {
  selectedFile: FileObj;
  allFile: FileObj[];
}
pdfjsLib.GlobalWorkerOptions.workerSrc= "https://unpkg.com/pdfjs-dist@3.4.120/legacy/build/pdf.worker.js";
export const Navbar: FC<Props> = ({
  selectedFile,
  allFile,
}) => {
    const { 
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
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [pdfError, setPdfError] = useState('');
    const [nowSelectedFile, setNowSelectedFile] = useState(null);
    const [nowSocket, setNowSocket] = useState(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showProgressBar, setShowProgressBar] = useState(false);
    const [uploading, setUploading] = useState(false);
    const allowedFiles = ['application/pdf'];
    const handleFile = async (e) =>{
        console.log(socket)
        console.log(e.target.files[0])
        if(localStorage.getItem('token')===null){alert('Please signin.')}
        console.log('handle file')
        console.log('current show file')
        
        console.log('token')
        console.log(localStorage.getItem("token"))
        // @ts-ignore
        updateCurrentShowFileObj(e.target.files[0])
        console.log(currentShowFile)
        if (socket) {
            socket.disconnect();
            // @ts-ignore
            updateSeq_id(0);
          }
          const io = require('socket.io-client');
          const newSocket = io('wss://pdfchat-server.azurewebsites.net/ws',{
              extraHeaders: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              },    
          });
      
          console.log('connect')
          console.log(localStorage.getItem("token"))
          newSocket.on('connect', () => {
            // @ts-ignore
            setSocket(newSocket);
            console.log('WebSocket连接已打开!');
            console.log(newSocket)
            
            newSocket.on('error', (error) => {
                console.log('Socket.io 错误: ', error);
            });
        
            newSocket.on('disconnect', () => {
                console.log('Socket.io 连接已关闭');})
      
            if (newSocket.connected){console.log('socket state ok');newSocket.emit('getSession',null)};
        });
        newSocket.on('IDs', (data) => {
          const _sessionID = data.sessionID
          const _conversationID = data.conversationID
          const _seqID = data.seqenceID
          console.log('You have got session id from server:')
          console.log(_sessionID);
          console.log(_conversationID);
          // @ts-ignore
          updateSessionID(_sessionID)
          // @ts-ignore
          updateConversationID(_conversationID)
          // @ts-ignore
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
        console.log(e.target.files[0])

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
                            // @ts-ignore
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
                                            // @ts-ignore
                                        resolve()
                                        setUploadProgress(100)}
                                        
                                    });
                            }).then(async () => {

                                files.push({_file:e.target.result,_fileName:selectedFile.name})
                                // @ts-ignore
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
                                    // @ts-ignore
                                    const strings = textContent.items.map(item => item.str);

                                    finalText += strings.join(" ") + "\n";
                                }

                                fileContents.push({fileName: selectedFile.name,
                                                    fileUrl: _fileUrl||null,
                                                    fileText: finalText,
                                                    fileSha256: hash.toString(CryptoJS.enc.Hex),
                                                    fileType:selectedFile.type});
                                // Here finalText is the variable which holds the text content of the PDF
                                // @ts-ignore
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
        // @ts-ignore
        updateFileList(filesName);
        // @ts-ignore
        updateFileObjs(files);
        // @ts-ignore
        updateCurrentShowFile(filesName[0]);
        //设置当前文件
        // @ts-ignore
        updateCurrentShowFileObj(files[0]);

    }
    const handleChange = async (e) => {
        const file = e.target.files[0];
        console.log(file)
        setNowSelectedFile(e);
        
        if (currentShowFile === '') {
          setShowConfirmationDialog(false);
          await handleFile(e);
        } else {
          setShowConfirmationDialog(true);
        }
    }

    const onNewFile = () => {
        // Simulate a click to the hidden file input
        if(inputRef.current){
            inputRef.current.click();
          };
      };
    return (
        <nav className="flex w-full justify-between bg-[#202123] py-3 px-4">
        <div className="mr-4"></div>

        <div className="max-w-[240px] overflow-hidden text-ellipsis whitespace-nowrap">
            {/* {selectedConversation.name} */}
        </div>


        <IconPlus
            className="cursor-pointer hover:text-neutral-400 mr-8"
            onClick={onNewFile}
        />
        <input
            type="file"
            ref={inputRef}
            multiple
            accept="application/pdf"
            onChange={handleChange}
            style={{ display: 'none' }} // Hide this input
            />
        {pdfError&&<span className='text-danger'>{pdfError}</span>}
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
        </nav>
    );
};
