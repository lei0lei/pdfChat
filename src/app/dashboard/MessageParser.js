"use client"; 
import arrowImage from './click-icon.svg';
import { ConversationalRetrievalQAChain } from "langchain/chains";
import React, { useContext } from 'react';
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PdfContext } from './context.js';
import { MathJaxContext,MathJax }  from 'better-react-mathjax';
const MessageParser = ({ children, actions }) => {
  
  const context = useContext(PdfContext);
  const {
    tokens, 
    seq_id,conversationID,sessionID,
    updateSeq_id,
    socket,
    currentShowFile,
    updateCurrentShowFile,
    updateCurrentShowFileObj,
    setCurrentPageNum,
    fileList,
    fileObjs,
     } = useContext(PdfContext);
    const handleLinkClick = (event) => {
      const fileName = event.target.getAttribute('data-ref-filename');
      const pagenum = event.target.getAttribute('data-ref-page');
      console.log('clicked');
      console.log('goto file:')
      console.log(fileName)
      console.log('goto page:')
      console.log(pagenum)
      updateCurrentShowFile(fileName);
      let fileObj = fileObjs.find(
          (item) => item._fileName === fileName
      );

      updateCurrentShowFileObj(fileObj );

      //页面跳转
      setCurrentPageNum(pagenum);

    };
  const parse = async (message) => {
    
    actions.setIsLoading(true);
    if (message.trim() === '') {
      actions.handleResponse('请输入有效消息')
      actions.setIsLoading(false);
      return; // 空消息，不做任何处理
    }
    actions.handleResponse('')
    socket.emit('onConversation',{message:message,
                                  seq_id:seq_id,
                                  conversationID:conversationID,
                                  sessionID:sessionID})
    socket.on('answer',(data) => {
      
      // console.log(data.result.text,data.refFilename,data.refPage,data.refText);
      console.log(data.result)
      console.log(data.ref)
      const textResponse = (<React.Fragment>
          <MathJax>{data.result.text}</MathJax>
          <a
              href="#"
              onClick={handleLinkClick}
              data-ref-filename={data.ref[0].refFilename}
              data-ref-page={data.ref[0].refPage}
              className="text-red-500 underline"
            >
              
            点此查看引用
          </a>
          </React.Fragment>)
      actions.handleResponse(textResponse);
      
      // actions.handleResponse('filename: '+data.ref[0].refFilename+'\r\n'+'pagenum: '+data.ref[0].refPage);
      socket.off('answer');
      
      updateSeq_id(seq_id+1);
      actions.setIsLoading(false);
    })}
    

  return (
    <MathJaxContext>
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {},
        });
      })}
    </div>
    </MathJaxContext>
  );
};

export default MessageParser;