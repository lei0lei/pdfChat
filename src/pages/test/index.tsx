"use client";
import { Chat } from '../../components/Chat/Chatx';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import { Navbar } from '../../components/Mobile/Navbar_v1';
import { Promptbar } from '../../components/Promptbar/Promptbar';
import { ChatBody, Conversation, Message, FileObj } from '../../types/chat';
import { ErrorMessage } from '../../types/error';
import { IconArrowBarLeft, IconArrowBarRight } from '@tabler/icons-react';
import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useEffect, useRef, useState,useContext } from 'react';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';
import { PdfContext } from '../../app/dashboard/context.js'; 
import { Prompt } from '../../types/prompt';
import  PdfViewerx  from '../../components/PdfViewer/pdfViewer';
import {PdfProvider} from '../../app/dashboard/provider.js';
import { KeyValuePair } from '../../types/data';
import {
  saveConversation,
  saveConversations,
  updateConversation,
} from '../../utils/app/conversation';

interface HomeProps {
  }

const Home: React.FC<HomeProps> = ({
  }) => {
  const { t } = useTranslation('chat');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedConversation, setSelectedConversation] =
                                  useState<Conversation>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentMessage, setCurrentMessage] = useState<Message>();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const stopConversationRef = useRef<boolean>(false);
  const [modelError, setModelError] = useState<ErrorMessage | null>(null);
  const [selectedFile, setSelectedFile] = useState<FileObj>();
  const [lightMode, setLightMode] = useState<'dark' | 'light'>('dark');
  const [showSidebar, setShowSidebar] = useState<boolean>(true);
  const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false);
  const handleNewFile = () => {
    console.log('new file')
  };

  // const handleSend = async (
  //   message: Message,
  //   deleteCount = 0,
  //   plugin: Plugin | null = null,
  // ) => {
  //   console.log('handle send')
  //   console.log(message)
  //   // message: Message 对象，表示一个消息，它应有一些内容（content）和角色（role）负责发送消息。
  //   // deleteCount（可选，默认为0）: 表示需要从会话中删除的消息数量。
  //   // plugin（可选，默认为null）: 插件对象，可能包含某些使用Google搜索的插件信息。
  //   if (selectedConversation) {
  //     let updatedConversation: Conversation;
  //     // 会话更新: 如果 deleteCount 大于0，则会从 selectedConversation对象中删除指定数量的消息。然后将 message 插入到消息列表中。
  //     if (deleteCount) {
  //       // 删除消息
  //       const updatedMessages = [...selectedConversation.messages];
  //       for (let i = 0; i < deleteCount; i++) {
  //         updatedMessages.pop();
  //       }
  //       // 将message插入到消息列表的末尾
  //       updatedConversation = {
  //         ...selectedConversation,
  //         messages: [...updatedMessages, message],
  //       };
  //     } else {
  //       updatedConversation = {
  //         ...selectedConversation,
  //         messages: [...selectedConversation.messages, message],
  //       };
  //     }
  //     // setSelectedConversation用于更新选定的会话对象。
  //     setSelectedConversation(updatedConversation);
  //     setLoading(true);
  //     setMessageIsStreaming(true);

  //     // 根据updatedConversation.messages创建一个ChatBody对象，并将其转化为JSON字符串赋值给body变量。
  //     const chatBody: ChatBody = {
  //       messages: updatedConversation.messages,
  //     };

  //     // const endpoint = getEndpoint(plugin);
  //     let body;
      
  //     if (!plugin) {
  //       body = JSON.stringify(chatBody);
  //     } else {
  //       // body = JSON.stringify({
  //       //   ...chatBody,
  //       //   googleAPIKey: pluginKeys
  //       //     .find((key) => key.pluginId === 'google-search')
  //       //     ?.requiredKeys.find((key) => key.key === 'GOOGLE_API_KEY')?.value,
  //       //   googleCSEId: pluginKeys
  //       //     .find((key) => key.pluginId === 'google-search')
  //       //     ?.requiredKeys.find((key) => key.key === 'GOOGLE_CSE_ID')?.value,
  //       // });
  //     }

  //     const controller = new AbortController();

  //     const data = 'hh';

  //     if (!data) {
  //       setLoading(false);
  //       setMessageIsStreaming(false);
  //       return;
  //     }
      
  //     if (!plugin) {
  //       if (updatedConversation.messages.length === 1) {
  //         const { content } = message;
  //         const customName =
  //           content.length > 30 ? content.substring(0, 30) + '...' : content;

  //         updatedConversation = {
  //           ...updatedConversation,
  //           name: customName,
  //         };
  //       }

  //       setLoading(false);

  //       // const reader = data.getReader();
  //       // const decoder = new TextDecoder();
  //       let done = false;
  //       let isFirst = true;
  //       let text = '';
  //       // 消息处理逻辑


  //       // 消息渲染
  //       const updatedMessages: Message[] = [
  //               ...updatedConversation.messages,
  //               { role: 'assistant', content: 'pp' },
  //             ];
  
  //       updatedConversation = {
  //               ...updatedConversation,
  //               messages: updatedMessages,
  //             };
  
  //       setSelectedConversation(updatedConversation);

  //       saveConversation(updatedConversation);

  //       const updatedConversations: Conversation[] = conversations.map(
  //         (conversation) => {
  //           if (conversation.id === selectedConversation.id) {
  //             return updatedConversation;
  //           }

  //           return conversation;
  //         },
  //       );

  //       if (updatedConversations.length === 0) {
  //         updatedConversations.push(updatedConversation);
  //       }

  //       setConversations(updatedConversations);
  //       saveConversations(updatedConversations);

  //       setMessageIsStreaming(false);
  //     } else {
  //       const  answer = 'xx';
  //       const updatedMessages: Message[] = [
  //         ...updatedConversation.messages,
  //         { role: 'assistant', content: answer },
  //       ];

  //       updatedConversation = {
  //         ...updatedConversation,
  //         messages: updatedMessages,
  //       };

  //       setSelectedConversation(updatedConversation);
  //       saveConversation(updatedConversation);

  //       const updatedConversations: Conversation[] = conversations.map(
  //         (conversation) => {
  //           if (conversation.id === selectedConversation.id) {
  //             return updatedConversation;
  //           }

  //           return conversation;
  //         },
  //       );

  //       if (updatedConversations.length === 0) {
  //         updatedConversations.push(updatedConversation);
  //       }

  //       setConversations(updatedConversations);
  //       saveConversations(updatedConversations);

  //       setLoading(false);
  //       setMessageIsStreaming(false);
  //     }
  //   }
  // };

const handleDeleteConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.filter(
      (c) => c.id !== conversation.id,
    );
    setConversations(updatedConversations);
    saveConversations(updatedConversations);

    if (updatedConversations.length > 0) {
      setSelectedConversation(
        updatedConversations[updatedConversations.length - 1],
      );
      saveConversation(updatedConversations[updatedConversations.length - 1]);
    } else {
      setSelectedConversation({
        id: uuidv4(),
        name: 'New conversation',
        messages: [],
      });
      localStorage.removeItem('selectedConversation');
    }
  };
  const handleNewConversation = () => {
    const lastConversation = conversations[conversations.length - 1];

    const newConversation: Conversation = {
      id: uuidv4(),
      name: `${t('New Conversation')}`,
      messages: [],
    };

    const updatedConversations = [...conversations, newConversation];

    setSelectedConversation(newConversation);
    setConversations(updatedConversations);

    saveConversation(newConversation);
    saveConversations(updatedConversations);

    setLoading(false);
  };
const handleUpdateConversation = (
    conversation: Conversation,
    data: KeyValuePair,
  ) => {
    const updatedConversation = {
      ...conversation,
      [data.key]: data.value,
    };

    const { single, all } = updateConversation(
      updatedConversation,
      conversations,
    );

    setSelectedConversation(single);
    setConversations(all);
  };
  const handleClearConversations = () => {
    setConversations([]);
    localStorage.removeItem('conversationHistory');

    setSelectedConversation({
      id: uuidv4(),
      name: 'New conversation',
      messages: [],
    });
    localStorage.removeItem('selectedConversation');
  };
const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    saveConversation(conversation);
  };

const handleEditMessage = (message: Message, messageIndex: number) => {
    if (selectedConversation) {
      const updatedMessages = selectedConversation.messages
        .map((m, i) => {
          if (i < messageIndex) {
            return m;
          }
        })
        .filter((m) => m) as Message[];

      const updatedConversation = {
        ...selectedConversation,
        messages: updatedMessages,
      };

      const { single, all } = updateConversation(
        updatedConversation,
        conversations,
      );

      setSelectedConversation(single);
      setConversations(all);

      setCurrentMessage(message);
    }
  };
  // sidebar状态
  const handleToggleChatbar = () => {
    setShowSidebar(!showSidebar);
    localStorage.setItem('showChatbar', JSON.stringify(!showSidebar));
  };
  const handleLightMode = (mode: 'dark' | 'light') => {
    setLightMode(mode);
    localStorage.setItem('theme', mode);
  };


  // EFFECTS ---------------------------------------------
  useEffect(() => {
    if (currentMessage) {
      handleSend(currentMessage);
      setCurrentMessage(undefined);
    }
  }, [currentMessage]);

  useEffect(() => {
    if (window.innerWidth < 640) {
      setShowSidebar(false);
    }
  }, [selectedConversation]);

  useEffect(() => {
      setSelectedConversation({
        id: uuidv4(),
        name: 'New conversation',
        messages: [],
      });
    
  }, []);
  return (
    <>
      <Head>
          <title>Chatbot Pdf</title>
          <meta name="description" content="ChatGPT specific for pdf." />
          <meta
            name="viewport"
            content="height=device-height ,width=device-width, initial-scale=1, user-scalable=no"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <main
          className={`flex h-screen w-screen flex-col text-sm text-white dark:text-white ${lightMode}`}
        >
          
            <div className="fixed top-0 w-full sm:hidden">
              <Navbar
                selectedFile={selectedFile}
                allFile={[]}
              />
            </div>
            <div className="flex h-full w-full pt-[48px] sm:pt-0">
            {/* chatbar */}
            <PdfProvider>
            {showSidebar ? (
              <div>
                <Sidebar
                  loading={messageIsStreaming}
                  lightMode={lightMode}
                  selectedConversation={selectedConversation}
                  selectedFile={selectedFile}
                  onToggleLightMode={handleLightMode}
                  onNewConversation={handleNewConversation}
                />

                <button
                  className="fixed top-5 left-[270px] z-50 h-7 w-7 hover:text-gray-400 dark:text-white dark:hover:text-gray-300 sm:top-0.5 sm:left-[270px] sm:h-8 sm:w-8 sm:text-neutral-700"
                  onClick={handleToggleChatbar}
                >
                  <IconArrowBarLeft />
                </button>
                <div
                  onClick={handleToggleChatbar}
                  className="absolute top-0 left-0 z-10 h-full w-full bg-black opacity-70 sm:hidden"
                ></div>
              </div>
            ) : (
              <button
                className="fixed top-2.5 left-4 z-50 h-7 w-7 text-white hover:text-gray-400 dark:text-white dark:hover:text-gray-300 sm:top-0.5 sm:left-4 sm:h-8 sm:w-8 sm:text-neutral-700"
                onClick={handleToggleChatbar}
              >
                <IconArrowBarRight />
              </button>
            )}
            {selectedConversation && (
            <div className="flex flex-grow justify-center items-center">
              <div className="w-1/2">
                <div
                  className="rpv-core__viewer"
                  style={{
                    border: '1px solid rgba(0, 0, 0, 0.3)',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '90vh',
                    width: '100%',
                  }}
                >
                  {/* PDF Viewer Code */}
                  <PdfViewerx />
                </div>
              </div>

            {/* <div className="flex flex-1"> */}
            {/* {selectedConversation ? ( */}
              <div className="relative h-full overflow-hidden bg-white dark:bg-[#343541]">
              {/* <div className="h-full"> */}
                {/* Chat Component Code */}
                <Chat
                conversation={selectedConversation}
                conversations={conversations}
                messageIsStreaming={messageIsStreaming}
                loading={loading}
                prompts={prompts}
                setLoading={setLoading}
                setSelectedConversation={setSelectedConversation}
                setMessageIsStreaming={setMessageIsStreaming}
                saveConversation={saveConversation}
                setConversations={setConversations}
                saveConversations={saveConversations}
                //onSend={handleSend}
                onUpdateConversation={handleUpdateConversation}
                onEditMessage={handleEditMessage}
                stopConversationRef={stopConversationRef}
              />
              
            </div>
            
            {/* ):( */}
            {/* )} */}
          </div>
            )}
            </PdfProvider>
            {/* promptbar */}

            
            </div>
        </main>
        
    </>
  )};

export default Home;