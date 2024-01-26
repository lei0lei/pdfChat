import { Conversation, Message } from '../../types/chat';
import { KeyValuePair } from '../../types/data';
import { ErrorMessage } from '../../types/error';
import { OpenAIModel, OpenAIModelID } from '../../types/openai';
import { Plugin } from '../../types/plugin';
import { Prompt } from '../../types/prompt';
import { throttle } from '../../utils';
import { IconArrowDown, IconClearAll, IconSettings } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { ChatBody, FileObj } from '../../types/chat';
import '../../styles/globals.css'
import {
  FC,
  MutableRefObject,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Spinner } from '../Global/Spinner';
import { ChatInput } from './ChatInputx';
import { ChatLoader } from './ChatLoader';
import { ChatMessage } from './ChatMessage';
import { ErrorMessageDiv } from './ErrorMessageDiv';
import { ModelSelect } from './ModelSelect';
import { SystemPrompt } from './SystemPrompt';
import React, { useContext} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PdfContext } from '../../app/dashboard/context.js'; 
interface Props {
  conversation: Conversation;
  conversations;
  messageIsStreaming: boolean;
  loading: boolean;
  prompts: Prompt[];
  setLoading;
    setSelectedConversation;
                setMessageIsStreaming;
                saveConversation;
                setConversations;
                saveConversations;
  // onSend: (
  //   message: Message,
  //   deleteCount: number,
  // ) => void;
  onUpdateConversation: (
    conversation: Conversation,
    data: KeyValuePair,
  ) => void;
  onEditMessage: (message: Message, messageIndex: number) => void;
  stopConversationRef: MutableRefObject<boolean>;
}

export const Chat: FC<Props> = memo(
  ({
    conversation,
    conversations,
    messageIsStreaming,
    loading,
    prompts,
    onUpdateConversation,
    onEditMessage,
    stopConversationRef,
    setLoading,
    setSelectedConversation,
                setMessageIsStreaming,
                saveConversation,
                setConversations,
                saveConversations,
  }) => {
    const { 
      fileObjs,
      updateCurrentShowFile,
      updateCurrentShowFileObj,
      updateVectorDatabase,
      updateSeq_id,
      updateConversationID,
      updateSessionID,
      setCurrentPageNum,
      socket,
      currentPageNum,
      updateInitConversation,
      tokens, 
    seq_id,conversationID,sessionID,
      setSocket } = useContext(PdfContext);
    const { t } = useTranslation('chat');
    
    const [currentMessage, setCurrentMessage] = useState<Message>();
    // const [conversation, setConversation] = useState<Message>();
    const [autoScrollEnabled, setAutoScrollEnabled] = useState<boolean>(true);
    const [showSettings, setShowSettings] = useState<boolean>(false);
    const [showScrollDownButton, setShowScrollDownButton] =
      useState<boolean>(false);
      
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    // const newConversation: Conversation = {
    //   id: uuidv4(),
    //   name: `${t('New Conversation')}`,
    //   messages: [],
    // };
    // 如果 autoScrollEnabled 是 true，就将聊天窗口滚动到底部且让输入框获取焦点。
    const scrollToBottom = useCallback(() => {
      if (autoScrollEnabled) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        textareaRef.current?.focus();
      }
    }, [autoScrollEnabled]);
    const handleSend = async (
      message: Message,
      deleteCount = 0,
      plugin: Plugin | null = null,
    ) => {
      console.log('handle send')
      console.log(message)
      if (conversation) {
        let updatedConversation: Conversation;
        // 会话更新: 如果 deleteCount 大于0，则会从 selectedConversation对象中删除指定数量的消息。然后将 message 插入到消息列表中。
        if (deleteCount) {
          // 删除消息
          const updatedMessages = [...conversation.messages];
          for (let i = 0; i < deleteCount; i++) {
            updatedMessages.pop();
          }
          // 将message插入到消息列表的末尾
          updatedConversation = {
            ...conversation,
            messages: [...updatedMessages, message],
          };
        } else {
          updatedConversation = {
            ...conversation,
            messages: [...conversation.messages, message],
          };
        }
        // setSelectedConversation用于更新选定的会话对象。
        setSelectedConversation(updatedConversation);
        setLoading(true);
        setMessageIsStreaming(true);
  
        // 根据updatedConversation.messages创建一个ChatBody对象，并将其转化为JSON字符串赋值给body变量。
        const chatBody: ChatBody = {
          messages: updatedConversation.messages,
        };
  
        // const endpoint = getEndpoint(plugin);
        let body;
        
        if (!plugin) {
          body = JSON.stringify(chatBody);
        } else {
         
        }
  
        const controller = new AbortController();
  
        const data = 'hh';
  
        if (!data) {
          setLoading(false);
          setMessageIsStreaming(false);
          return;
        }
        
        if (!plugin) {
          if (updatedConversation.messages.length === 1) {
            const { content } = message;
            const customName =
              content.length > 30 ? content.substring(0, 30) + '...' : content;
  
            updatedConversation = {
              ...updatedConversation,
              name: customName,
            };
          }
  
          setLoading(false);
  
          // const reader = data.getReader();
          // const decoder = new TextDecoder();
          let done = false;
          let isFirst = true;
          let text = '';
          // 消息处理逻辑
          setLoading(true)
          console.log('1')
          console.log(message)
          console.log(socket)
          if (socket !== null) {
          socket.emit('onConversation',{message:message['content'],
            seq_id:seq_id,
            conversationID:conversationID,
            sessionID:sessionID})
          }
          console.log('sss')
          if (socket !== null) {
          socket.on('answer',(data) => {
          console.log('2')
          // console.log(data.result.text,data.refFilename,data.refPage,data.refText);
          console.log(data.result)
          console.log(data.ref)
          const textResponse = data.result.text

          console.log('3')
          const updatedMessages: Message[] = [
            ...updatedConversation.messages,
            { role: 'assistant', content: textResponse ,data_ref_filename:data.ref[0].refFilename,
            data_ref_page:data.ref[0].refPage},
          ];
          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages,
          };
          setSelectedConversation(updatedConversation);
  
          saveConversation(updatedConversation);
  
          const updatedConversations: Conversation[] = conversations.map(
            (conversation) => {
              if (conversation.id === conversation.id) {
                return updatedConversation;
              }
  
              return conversation;
            },
          );
  
          if (updatedConversations.length === 0) {
            updatedConversations.push(updatedConversation);
          }
  
          setConversations(updatedConversations);
          saveConversations(updatedConversations);
  
          setMessageIsStreaming(false);
          // actions.handleResponse('filename: '+data.ref[0].refFilename+'\r\n'+'pagenum: '+data.ref[0].refPage);
          socket.off('answer');
          // @ts-ignore
          updateSeq_id(seq_id+1);
          setLoading(false);
          })}
          // setLoading(false);
          // // 消息渲染
          // setSelectedConversation(updatedConversation);
  
          // saveConversation(updatedConversation);
  
          // const updatedConversations: Conversation[] = conversations.map(
          //   (conversation) => {
          //     if (conversation.id === conversation.id) {
          //       return updatedConversation;
          //     }
  
          //     return conversation;
          //   },
          // );
  
          // if (updatedConversations.length === 0) {
          //   updatedConversations.push(updatedConversation);
          // }
  
          // setConversations(updatedConversations);
          // saveConversations(updatedConversations);
  
          // setMessageIsStreaming(false);
        } else {
          const  answer = 'xx';
          const updatedMessages: Message[] = [
            ...updatedConversation.messages,
            { role: 'assistant', content: answer ,data_ref_filename:'',data_ref_page:''},
          ];
  
          updatedConversation = {
            ...updatedConversation,
            messages: updatedMessages,
          };
  
          setSelectedConversation(updatedConversation);
          saveConversation(updatedConversation);
  
          const updatedConversations: Conversation[] = conversations.map(
            (conversation) => {
              if (conversation.id === conversation.id) {
                return updatedConversation;
              }
  
              return conversation;
            },
          );
  
          if (updatedConversations.length === 0) {
            updatedConversations.push(updatedConversation);
          }
  
          setConversations(updatedConversations);
          saveConversations(updatedConversations);
  
          setLoading(false);
          setMessageIsStreaming(false);
        }
      }
    };
    // 在用户手动滚动聊天窗口时调用。它检查用户是否已滚动到接近底部。如果是，则启用自动滚动并隐藏"向下滚动"按钮。否则，禁用自动滚动并显示"向下滚动"按钮。
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatContainerRef.current;
        const bottomTolerance = 30;

        if (scrollTop + clientHeight < scrollHeight - bottomTolerance) {
          setAutoScrollEnabled(false);
          setShowScrollDownButton(true);
        } else {
          setAutoScrollEnabled(true);
          setShowScrollDownButton(false);
        }
      }
    };
    const handleLinkClick = (event) => {
      const fileName = event.target.getAttribute('data-ref-filename');
      const pagenum = event.target.getAttribute('data-ref-page');
      console.log('clicked');
      console.log('goto file:')
      console.log(fileName)
      console.log('goto page:')
      console.log(pagenum)
      // @ts-ignore
      updateCurrentShowFile(fileName);
      let fileObj = fileObjs.find(
          (item) => item._fileName === fileName
      );
        // @ts-ignore
      updateCurrentShowFileObj(fileObj );

      //页面跳转
      // @ts-ignore
      setCurrentPageNum(pagenum);

    };
    // 用于将聊天窗口滚动到底部。
    const handleScrollDown = () => {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    };
// 用于切换设置的显示和隐藏。
    const handleSettings = () => {
      setShowSettings(!showSettings);
    };

    const onClearAll = () => {
      if (confirm(t<string>('Are you sure you want to clear all messages?'))) {
        onUpdateConversation(conversation, { key: 'messages', value: [] });
      }
    };

    const scrollDown = () => {
      if (autoScrollEnabled) {
        messagesEndRef.current?.scrollIntoView(true);
      }
    };
    const throttledScrollDown = throttle(scrollDown, 250);

    // useEffect(() => {
    //   throttledScrollDown();
    //   setCurrentMessage(
    //     conversation.messages[conversation.messages.length - 2],
    //   );
    // }, [conversation.messages, throttledScrollDown]);

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setAutoScrollEnabled(entry.isIntersecting);
          if (entry.isIntersecting) {
            textareaRef.current?.focus();
          }
        },
        {
          root: null,
          threshold: 0.5,
        },
      );
      const messagesEndElement = messagesEndRef.current;
      if (messagesEndElement) {
        observer.observe(messagesEndElement);
      }
      return () => {
        if (messagesEndElement) {
          observer.unobserve(messagesEndElement);
        }
      };
    }, [messagesEndRef]);


    const handleEditMessage = () =>{


      
    }
    return (
      <div className="relative flex-1 overflow-hidden bg-white dark:bg-[#343541]">
          {/* {conversation ? ( */}
          {/* <div className="mx-auto flex h-full w-[300px] flex-col justify-center space-y-6 sm:w-[600px]">
            <div className="text-center text-4xl font-bold text-black dark:text-white">
              Welcome to pdf chatbot
            </div></div>
        ) :  ( */}
          <>
            <div
              className="max-h-full overflow-x-hidden"
              ref={chatContainerRef}
              onScroll={handleScroll}
            >
              
                <>
                  <div className="flex justify-center border border-b-neutral-300 bg-neutral-100 py-2 text-sm text-neutral-500 dark:border-none dark:bg-[#444654] dark:text-neutral-200">
                    {t('Model')}: {'GPT-4'}
                    <button
                      className="ml-2 cursor-pointer hover:opacity-50"
                      onClick={handleSettings}
                    >
                      <IconSettings size={18} />
                    </button>
                    <button
                      className="ml-2 cursor-pointer hover:opacity-50"
                      onClick={onClearAll}
                    >
                      <IconClearAll size={18} />
                    </button>
                  </div>
                  {showSettings && (
                    <div className="flex flex-col space-y-10 md:mx-auto md:max-w-xl md:gap-6 md:py-3 md:pt-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
                      <div className="flex h-full flex-col space-y-4 border-b border-neutral-200 p-4 dark:border-neutral-600 md:rounded-lg md:border">
                        
                      </div>
                    </div>
                  )}

                  {conversation.messages.map((message, index) => (
                    <ChatMessage
                      key={index}
                      message={message}
                      messageIndex={index}
                      onEditMessage={handleEditMessage}
                    />
                  ))}

                  {false && <ChatLoader />}

                  <div
                    className="h-[162px] bg-white dark:bg-[#343541]"
                    ref={messagesEndRef}
                  />
                </>
               {/* )} */}
            </div>

            <ChatInput
            
              stopConversationRef={stopConversationRef}
              textareaRef={textareaRef}
              messageIsStreaming={messageIsStreaming}
              conversationIsEmpty={conversation.messages.length === 0}
              prompts={prompts}
              onSend={async (message, ) => {
                setCurrentMessage(message);
                await handleSend(message, 0, );
              }}
              onRegenerate={async () => {
                if (currentMessage) {
                  await handleSend(currentMessage, 2);
                }
              }}
            />
          </>
          {/* )} */}
        {showScrollDownButton && (
          <div className="absolute bottom-0 right-0 mb-4 mr-4 pb-20">
            <button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-300 text-gray-800 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-neutral-200"
              onClick={handleScrollDown}
            >
              <IconArrowDown size={18} />
            </button>
          </div>
        )}
      </div>
    );
  },
);

Chat.displayName = 'Chat';
