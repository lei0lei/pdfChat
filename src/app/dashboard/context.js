import React from 'react';
export const PdfContext = React.createContext({
  initConversation:'',
  updateInitConversation: ()=>{},
  vectordb: '',
  docs: '--------',
  updateDocs: () => {},
  updateVectorDatabase: () =>{},

  fileList: [],
  fileObjs:[],
  updateFileList:()=>{},
  updateFileObjs:()=>{},

  
  currentShowFile:'',
  currentShowFileObj:'',
  updateCurrentShowFile:()=>{},
  updateCurrentShowFileObj:()=>{},

  currentPageNum:'',
  setCurrentPageNum:()=>{},

  seq_id:'',
  conversationID:'',
  updateSeq_id:()=>{},
  updateConversationID:()=>{},
  sessionID:'',
  updateSessionID:()=>{},
    // 添加 socket 和 setSocket
  socket: null, 
  setSocket: () => {},

  tokens:null,
  updateTokens:()=>{},

});