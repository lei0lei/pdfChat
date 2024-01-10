"use client"; 
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
     } = useContext(PdfContext);
  const parse = async (message) => {
    socket.emit('onConversation',{message:message,
                                  seq_id:seq_id,
                                  conversationID:conversationID,
                                  sessionID:sessionID})
    socket.on('answer',(data) => {
      // console.log(data.result.text,data.refFilename,data.refPage,data.refText);
      console.log(data.result)
      console.log(data.ref)
      actions.handleResponse(<MathJax>{data.result.text} </MathJax>);
      // actions.handleResponse(<Tex texContent={'\\(E = mc^2\\)'} />);
      // actions.handleResponse(data.result.text);
      actions.handleResponse('filename: '+data.ref[0].refFilename+'\r\n'+'pagenum: '+data.ref[0].refPage);
      socket.off('answer');
      updateSeq_id(seq_id+1)})}
    

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