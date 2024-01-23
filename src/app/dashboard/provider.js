import React from 'react';
import { Document } from "langchain/document";
import { PdfContext } from './context.js';  // 导入上面创建的 Context
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export class PdfProvider extends React.Component {
    constructor(props) {
      super(props);
      
      // 初始化并绑定 updateMyString 函数
      this.updateTokens = this.updateTokens.bind(this); 
      this.updateDocs = this.updateDocs.bind(this);
      this.updateVectorDatabase = this.updateVectorDatabase.bind(this)
      this.updateFileList = this.updateFileList.bind(this);
      this.updateFileObjs = this.updateFileObjs.bind(this);
      this.updateCurrentShowFile = this.updateCurrentShowFile.bind(this);
      this.updateCurrentShowFileObj = this.updateCurrentShowFileObj.bind(this);
      this.setCurrentPageNum = this.setCurrentPageNum.bind(this);
      this.updateSeq_id = this.updateSeq_id.bind(this);
      this.updateConversationID = this.updateConversationID.bind(this);
      this.updateSessionID = this.updateSessionID.bind(this);
      this.updateInitConversation = this.updateInitConversation.bind(this);
      this.setSocket = this.setSocket.bind(this);
      // 将 updateMyString 方法和 myString 存在状态中
      this.state = {
        initConversation:'',
        updateInitConversation: this.updateInitConversation,
        vectordb:'',
        docs: '',
        updateDocs: this.updateDocs,
        updateVectorDatabase: this.updateVectorDatabase,

        fileList: '',
        fileObjs:'',
        updateFileList:this.updateFileList,
        updateFileObjs:this.updateFileObjs,

        currentShowFile:'',
        currentShowFileObj:'',
        updateCurrentShowFile:this.updateCurrentShowFile,
        updateCurrentShowFileObj:this.updateCurrentShowFileObj,
        currentPageNum:1,
        setCurrentPageNum:this.setCurrentPageNum,

        seq_id:'',
        conversationID:'',
        sessionID:'',
        updateSeq_id:this.updateSeq_id,
        updateConversationID: this.updateConversationID,
        updateSessionID:this.updateSessionID,

        socket: null, // 在状态中添加socket
        setSocket: this.setSocket, //在状态中添加setSocket方法，用于更新socket

        tokens: null,
        updateTokens: this.updateTokens,
      };
    }
  
    updateFileList(files){this.setState({fileList:files})}
    updateFileObjs(files){this.setState({fileObjs:files})}
    updateCurrentShowFile(file){this.setState({currentShowFile:file})}
    updateCurrentShowFileObj(file){this.setState({currentShowFileObj:file})}
    updateTokens(token){this.setState({tokens:token})}
    setCurrentPageNum(num){this.setState({currentPageNum:num})}
    updateInitConversation(conv){this.setState({initConversation:conv})}
    setSocket(newSocket) {
      this.setState({ socket: newSocket });
  }

    // componentDidMount() {
    //     // 在组件加载后创建并设置socket连接
    //     const socket = io('http://localhost:8000/app');
    //     this.setSocket(socket);
    // }

    updateSeq_id(id){this.setState({ seq_id: id })}
    updateConversationID(id){this.setState({ conversationID: id })}
    updateSessionID(id){this.setState({ sessionID: id })}
    updateDocs(newString) {
        this.setState({ docs: newString });
    }

    async updateVectorDatabase(newString) {
    }
    
    render() {
      return (
        <PdfContext.Provider value={this.state}>
          {this.props.children}
        </PdfContext.Provider>
      );
    }
  }

  export default PdfProvider;