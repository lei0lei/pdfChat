import { Message } from '../../types/chat';
import { OpenAIModel } from '../../types/openai';
import { Plugin } from '../../types/plugin';
import { Prompt } from '../../types/prompt';
import {
  IconBolt,
  IconBrandGoogle,
  IconPlayerStop,
  IconRepeat,
  IconSend,
} from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import {
  FC,
  KeyboardEvent,
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { PluginSelect } from './PluginSelect';
import { PromptList } from './PromptList';
import { VariableModal } from './VariableModal';

interface Props {
  messageIsStreaming: boolean;
  conversationIsEmpty: boolean;
  prompts: Prompt[];
  onSend: (message: Message, plugin: Plugin | null) => void;
  onRegenerate: () => void;
  stopConversationRef: MutableRefObject<boolean>;
  textareaRef: MutableRefObject<HTMLTextAreaElement | null>;
}

export const ChatInput: FC<Props> = ({
  messageIsStreaming,
  conversationIsEmpty,
  prompts,
  onSend,
  onRegenerate,
  stopConversationRef,
  textareaRef,
}) => {
  const { t } = useTranslation('chat');

  const [content, setContent] = useState<string>();
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [showPromptList, setShowPromptList] = useState(false);
  const [activePromptIndex, setActivePromptIndex] = useState(0);
  const [promptInputValue, setPromptInputValue] = useState('');
  const [variables, setVariables] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPluginSelect, setShowPluginSelect] = useState(false);
  const [plugin, setPlugin] = useState<Plugin | null>(null);

  // const promptListRef = useRef<HTMLUListElement | null>(null);

  const filteredPrompts = prompts.filter((prompt) =>
    prompt.name.toLowerCase().includes(promptInputValue.toLowerCase()),
  );
  // 处理文本框（textarea）内容变化的事件，更新状态和界面。




  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // HTMLTextAreaElement指的是用户在页面上输入或修改textarea的内容时触发的事件。
    // 获取用户在textarea中输入的内容。
    const value = e.target.value;
    // 检查输入的内容长度是否超过了限制（model.maxLength）
    const maxLength = 100000//model.maxLength;

    if (value.length > maxLength) {
      // 如果超过长度限制，函数会弹出警告框，提示用户字符超过限制，然后函数返回，不再执行以下代码。
      alert(
        t(
          `Message limit is {{maxLength}} characters. You have entered {{valueLength}} characters.`,
          { maxLength, valueLength: value.length },
        ),
      );
      return;
    }
    // 如果没有超过长度限制，函数将调用setContent(value)，用来更新存储文本框内容的状态
    setContent(value);
    updatePromptListVisibility(value);
  };

  // 处理聊天消息的函数。函数接受三个输入参数：消息体，删除计数器和插件

  const handleSend = () => {
    // 函数检查messageIsStreaming的值。如果为true，则函数会立即返回，不再执行接下来的代码。当消息正在被流式处理或传输时，用户不能再次发送消息。
    if (messageIsStreaming) {
      return;
    }
    // 如果content（即存储在文本框中的文本）是空的，函数会通过alert(t('Please enter a message'))显示提示信息，然后函数返回，不再执行以下代码。
    if (!content) {
      alert(t('Please enter a message'));
      return;
    }
    // 如果上述情况都未发生，则调用onSend函数，并传递一个对象，对象中包含role（在此情况下永远是'user'）和content（ 文本框中的内容）。另外，函数还传递了plugin参数，这可能是一种特殊插件或者配置，具体需要看onSend函数的实现。
    onSend({ role: 'user', content }, plugin);
    // 函数会调用setContent('')和setPlugin(null)。这两个都是React的useState更新函数，分别用来清空文本框内容和清除任何可能存在的插件。
    setContent('');
    setPlugin(null);
    // 如果屏幕宽度小于640px，并且textarea元素的ref存在，那么会调用textareaRef.current.blur()。这将移除文本框的焦点，通常是为了收起移动设备的键盘。
    if (window.innerWidth < 640 && textareaRef && textareaRef.current) {
      textareaRef.current.blur();
    }
  };
  // 这个函数是被设计为一种暂时性的打断对话的方式，例如用户点击了某个按钮来停止或暂停对话，然后在一秒钟后对话又自动恢复了。
  const handleStopConversation = () => {
    // 函数将stopConversationRef.current设置为true。
    // stopConversationRef可能是一个使用React.useRef()创建的引用变量，用于跟踪“对话应当停止”这个状态。将.current属性设置为true表示现在希望停止对话。
    stopConversationRef.current = true;
    setTimeout(() => {
      stopConversationRef.current = false;
    }, 1000);
  };
  // 函数定义了一个变量userAgent，代表用户设备的标识信息。如果window.navigator存在（即在浏览器环境中），那么userAgent就是navigator.userAgent；否则，userAgent就为空字符串。
  //   函数定义了一个正则表达式mobileRegex，这个表达式涵盖了各种移动设备的名称，如Android、iPhone、iPad等。
  // 最后，使用test方法对userAgent进行测试，如果userAgent与mobileRegex匹配，就返回true，表明当前设备是移动设备；否则返回false。
  const isMobile = () => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobileRegex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
    return mobileRegex.test(userAgent);
  };
  // 处理对话框的初始化操作
  // 基于当前的activePromptIndex选择一个提示，在此一步后更新内容和对应的状态。
  const handleInitModal = () => {
    // 从filteredPrompts列表中取出由activePromptIndex索引指定的selectedPrompt
    const selectedPrompt = filteredPrompts[activePromptIndex];
    if (selectedPrompt) {
      // 调用setContent函数来更新文本内容。这里的setContent函数是一个setState函数，它接受一个函数作为参数。
      // 这个参数函数接收的参数prevContent是更新前的内容状态。
      // 在函数体中，prevContent内容的尾部的"/"和后面的所有字符都会被selectedPrompt.content替换。并且函数会返回更新后的内容作为新的状态。
      // 这里的正则表达式/\w*$/的意思是匹配位于字符串末尾的字母、数字或下划线_的连续串。例如，字符串"hello/world"中，会匹配到"world"，然后将其替换为selectedPrompt.content。
      setContent((prevContent) => {
        const newContent = prevContent?.replace(
          /\/\w*$/,
          selectedPrompt.content,
        );
        return newContent;
      });
      handlePromptSelect(selectedPrompt);
    }
    setShowPromptList(false);
  };
  // 处理文本框中的键盘事件
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // 如果showPromptList为true，说明提示列表是展开的，函数会根据用户按下的按键来执行对应的动作：
    if (showPromptList) {
      // 如果按下的是"下箭头键"，并且当前激活的提示（activePromptIndex）不是列表的最后一个，那么当前激活的提示会下移一个，即activePromptIndex加1。
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex < prompts.length - 1 ? prevIndex + 1 : prevIndex,
        );
        // 如果按下的是"上箭头键"，并且当前激活的提示（activePromptIndex）不是列表的第一个，那么当前激活的提示会上移一个，即activePromptIndex减1。
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex,
        );
        // 如果按下的是"Tab键"，并且当前激活的提示（activePromptIndex）不是列表的最后一个，那么当前激活的提示会下移一个，即activePromptIndex加1。否则会选择列表的第一个提示作为当前激活的提示，变成循环选择的效果。
      } else if (e.key === 'Tab') {
        e.preventDefault();
        setActivePromptIndex((prevIndex) =>
          prevIndex < prompts.length - 1 ? prevIndex + 1 : 0,
        );
        // 如果按下的是"Enter键"，那么会调用handleInitModal函数。
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleInitModal();
        // 如果按下的是"Escape键"，那么提示列表会被隐藏。
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowPromptList(false);
      } else {
        setActivePromptIndex(0);
      }
      // 如果按下的是"Enter键"，并且用户没有在输入，并且设备不是移动设备，并且"Enter键"不是带shift按下的（例如在同时按下shift和Enter情况下，通常表示输入一个换行符，而不是提交内容），那么将会调用handleSend函数发送文本。
    } else if (e.key === 'Enter' && !isTyping && !isMobile() && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      // 如果按下的是"/"键，并且metaKey为true，表示同时按下了Cmd或者Ctrl键，那么会切换showPluginSelect的状态，也就是如果插件选择器是显示状态，那么会隐藏，反之则会显示。
    } else if (e.key === '/' && e.metaKey) {
      e.preventDefault();
      setShowPluginSelect(!showPluginSelect);
    }
  };
  // 解析字符串中的变量
  // 这个函数可用于模板字符串的解析，比如你有一个字符串'Hello, {{name}}'，然后你想知道这个字符串需要哪些变量来填充，你就可以使用这个函数。
  // 定义了正则表达式/{{(.*?)}}/g。这个正则表达式会匹配content字符串中所有以两个"{{"开头，并以两个"}}"结尾，中间可以是任何内容的片段。"（.*?）"是一个被小括号包围的分组，表示匹配"{{"和"}}"之间的任何内容，但尽可能少的匹配（即非贪婪模式），这样可以确保正确的匹配，不会因为贪婪匹配而导致的扩大匹配范围。"g"标识表示全局匹配，即对整个字符串进行检查，而不是找到第一个就停止。
  const parseVariables = (content: string) => {
    const regex = /{{(.*?)}}/g;
    const foundVariables = [];
    // 创建了一个名为foundVariables的空数组，用于存储找到的变量。
    // 接着，在一个循环中，使用exec方法，它会在字符串中查找满足正则表达式的匹配。每一次执行这个方法，它都会返回下一个匹配的结果，直到找不到新的匹配为止。

    // 在每一个匹配结果中，match[1]代表的是分组匹配到的内容（即每一个被"{{"和"}}"包围的变量名），然后将其添加到foundVariables数组中。
    // 最后，函数返回foundVariables，此时这个数组已经包含了content字符串中所有匹配到的变量。
    let match;

    // while ((match = regex.exec(content)) !== null) {
    //   foundVariables.push(match[1]);
    // }

    return foundVariables;
  };
  // updatePromptListVisibility是通过useCallback创建的一个回调函数，这意味着这个函数会在其依赖数组（这种情况下为空数组）发生变化时被重新创建，如果依赖数组始终不变（如空数组），那么这个函数在组件的整个生命周期内只会被创建一次。
  //   函数首先检查输入文本text的末尾是否存在"/"跟随着任何字母和数字的连续串，这是通过正则表达式/\/\w*$/匹配实现的。

  // 如果找到了与正则表达式匹配的字符串：

  // 通过setShowPromptList(true)来显示提示列表。
  // 然后通过setPromptInputValue设置提示输入值为匹配到的字符串（最初的"/"字符被省略，这是通过match[0].slice(1)实现的）。
  // 如果输入文本text的末尾没有与正则表达式匹配的字符串：

  // 通过setShowPromptList(false)来隐藏提示列表。
  // 并且清空提示输入值（通过setPromptInputValue('')实现）
  const updatePromptListVisibility = useCallback((text: string) => {
    const match = text.match(/\/\w*$/);

    if (match) {
      setShowPromptList(true);
      setPromptInputValue(match[0].slice(1));
    } else {
      setShowPromptList(false);
      setPromptInputValue('');
    }
  }, []);
  // 用于处理用户选择提示的函数
  const handlePromptSelect = (prompt: Prompt) => {
    // 函数首先调用parseVariables(prompt.content)，这会返回prompt.content文本中所有变量的数组。将这个数组保存在parsedVariables变量中。
    const parsedVariables = parseVariables(prompt.content);
    // 调用setVariables(parsedVariables)来更新状态，保存用户选择的提示中的所有变量。
    setVariables(parsedVariables);
    // 接着，函数检查parsedVariables的长度。如果长度大于0，即存在一个或多个变量，那么调用setIsModalVisible(true)来显示模态窗口（可能用于填写或编辑变量的值）。
    // 如果parsedVariables的长度为0，即提示中没有变量：

    // 那么调用setContent函数来更新内容。更新规则是把内容中最后部分的"/"和其后的任何字符替换为用户选择的提示内容。也就是说，已输入的部分内容（路径）会被用户选择的提示内容替换。
    // 然后，调用updatePromptListVisibility(prompt.content)，可能是用来更新提示列表的显示状态。
    if (parsedVariables.length > 0) {
      setIsModalVisible(true);
    } else {
      setContent((prevContent) => {
        const updatedContent = prevContent?.replace(/\/\w*$/, prompt.content);
        return updatedContent;
      });
      updatePromptListVisibility(prompt.content);
    }
  };
  // 处理提交事件。在这个上下文中，它应该会被用于在用户完成变量的输入后，用用户提供的值替换内容字符串中的变量。
  const handleSubmit = (updatedVariables: string[]) => {
    // 函数首先定义一个新的内容字符串newContent，它从已有的content中生成。content字符串中的每个变量（即形如{{variable}}的部分）都会被替换为updatedVariables中对应的值。具体的替换过程是将content字符串中的每个{{variable}}片段，找到它在variables数组中的索引位置，然后使用该索引在updatedVariables数组中获取新的值来替换。这个过程是通过content.replace()方法和一个回调函数实现的。
    const newContent = content?.replace(/{{(.*?)}}/g, (match, variable) => {
      const index = variables.indexOf(variable);
      return updatedVariables[index];
    });
    // 然后，调用setContent(newContent)来更新content状态。这样，新的content就会包含用户输入的变量值。
    setContent(newContent);
    // 最后，如果存在textareaRef并且它的current属性也存在（即，存在一个有效的textarea元素的引用），那么就调用textareaRef.current.focus()，使文本框获取焦点。
    if (textareaRef && textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  // activePromptIndex改变时触发。如果 promptListRef.current 存在（也就是提示列表的引用真实存在），
  // 那么提示列表的滚动条位置会根据 activePromptIndex 调整，计算方式是 activePromptIndex 乘以 30 （可能是每个提示项的高度）。
  // useEffect(() => {
  //   if (promptListRef.current) {
  //     promptListRef.current.scrollTop = activePromptIndex * 30;
  //   }
  // }, [activePromptIndex]);
  //  content 改变时触发。它首先检查 textareaRef 和 textareaRef.current 是否存在。
  // 如果 textarea 元素的引用存在，那么这个 textarea 元素的高度会被设置为其内容的真实高度，即（textareaRef.current.scrollHeight）。
  // 这样做可以确保 textarea 元素适应其内容的大小（所以你会看到它先被设置为 inherit 然后再设成 scrollHeight，这是为了每次都从默认继承值开始计算）。
  // 如果内容的高度超过400px，overflow属性就设置为 auto，否则就设置为 hidden，这样可以确保只有在内容超过最大高度时才出现滚动条。
  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = 'inherit';
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
      textareaRef.current.style.overflow = `${
        textareaRef?.current?.scrollHeight > 400 ? 'auto' : 'hidden'
      }`;
    }
  }, [content]);
  // 这个 useEffect 用来处理点击事件。首先，它会创建一个名为 handleOutsideClick 的函数，并将这个函数作为 click 事件的监听器添加到 window 对象上。
  // 这个函数会检查点击的元素是否位于提示列表的外部（也就是说：提示框是否包含了e.target），如果是，那么调用 setShowPromptList(false) 隐藏提示列表。
  // 返回的函数在组件卸载时运行，用来移除添加到 window 对象上click 事件监听器。

  // 这三个 useEffect 的作用是管理提示列表的滚动和可见性、管理 textarea 元素的寸和滚动，以及处理外部点击事件。

  return (
    <div className="absolute bottom-0 left-0 w-full border-transparent bg-gradient-to-b from-transparent via-white to-white pt-6 dark:border-white/20 dark:via-[#343541] dark:to-[#343541] md:pt-2">
      <div className="stretch mx-2 mt-4 flex flex-row gap-3 last:mb-2 md:mx-4 md:mt-[52px] md:last:mb-6 lg:mx-auto lg:max-w-3xl">
        {true &&  (
          <button
            className="absolute top-0 left-0 right-0 mx-auto mb-3 flex w-fit items-center gap-3 rounded border border-neutral-200 bg-white py-2 px-4 text-black hover:opacity-50 dark:border-neutral-600 dark:bg-[#343541] dark:text-white md:mb-0 md:mt-2"
            // onClick={onRegenerate}
          >
            <IconRepeat size={16} /> {('重新生成')}
          </button>
        )}

        <div className="relative mx-2 flex w-full flex-grow flex-col rounded-md border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-gray-900/50 dark:bg-[#40414F] dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] sm:mx-4">
          <button
            className="absolute left-2 top-2 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
            onClick={() => setShowPluginSelect(!showPluginSelect)}
            onKeyDown={(e) => {}}
          >
            {plugin ? <IconBrandGoogle size={20} /> : <IconBolt size={20} />}
          </button>

          {showPluginSelect && (
            <div className="absolute left-0 bottom-14 bg-white dark:bg-[#343541]">
              <PluginSelect
                plugin={plugin}
                onPluginChange={(plugin: Plugin) => {
                  setPlugin(plugin);
                  setShowPluginSelect(false);

                  if (textareaRef && textareaRef.current) {
                    textareaRef.current.focus();
                  }
                }}
              />
            </div>
          )}
          {/* 第三部分包裹着一个 textarea 以及与之相关的一些交互元素。当 showPluginSelect 为真时会显示一个插件选择器。然后定义了一个 textarea ，它用于用户在其中输入文本。这个文本框有两个按钮，一个用于显示/隐藏插件选择器，另一个用于发送信息。textarea 的高度是由其内容决定的，其最大高度是400px。在 textarea 下部有一个提示列表，它会在 showPromptList 为真且过滤后的提示列表长度大于0时显示。提示列表由 PromptList 组件负责渲染。 */}
          <textarea
            ref={textareaRef}
            className="m-0 w-full resize-none border-0 bg-transparent p-0 py-2 pr-8 pl-10 text-black dark:bg-transparent dark:text-white md:py-3 md:pl-10"
            style={{
              resize: 'none',
              bottom: `${textareaRef?.current?.scrollHeight}px`,
              maxHeight: '400px',
              overflow: `${
                textareaRef.current && textareaRef.current.scrollHeight > 400
                  ? 'auto'
                  : 'hidden'
              }`,
            }}
            placeholder={
              t('请输入消息...') || ''
            }
            value={content}
            rows={1}
            onCompositionStart={() => setIsTyping(true)}
            onCompositionEnd={() => setIsTyping(false)}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
          />

          <button
            className="absolute right-2 top-2 rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200"
            onClick={handleSend}
          >
            {/* {messageIsStreaming ? ( */}
            {false?(
              <div className="h-4 w-4 animate-spin rounded-full border-t-2 border-neutral-800 opacity-60 dark:border-neutral-100"></div>
            ) : (
              <IconSend size={18} />
            )}
          </button>

          {/* {showPromptList && filteredPrompts.length > 0 && (
            <div className="absolute bottom-12 w-full">
              <PromptList
                activePromptIndex={activePromptIndex}
                prompts={filteredPrompts}
                onSelect={handleInitModal}
                onMouseOver={setActivePromptIndex}
                promptListRef={promptListRef}
              />
            </div>
          )} */}
          {/* 接着，如果 isModalVisible 为真，则渲染一个 VariableModal 组件。这个组件可能用于展示或修改一些变量或配置的信息。 */}
          {/* {isModalVisible && (
            <VariableModal
              prompt={prompts[activePromptIndex]}
              variables={variables}
              onSubmit={handleSubmit}
              onClose={() => setIsModalVisible(false)}
            />
          )} */}
        </div>
      </div>
    </div>
  );
};
