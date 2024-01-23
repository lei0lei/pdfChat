// PromptFolder组件
import { PromptComponent } from '../../../components/Promptbar/Prompt';
import { Folder } from '../../../types/folder';
import { Prompt } from '../../../types/prompt';
import {
  IconCaretDown,
  IconCaretRight,
  IconCheck,
  IconPencil,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { FC, KeyboardEvent, useEffect, useState } from 'react';

interface Props {
  searchTerm: string;
  prompts: Prompt[];
  currentFolder: Folder;
  onDeleteFolder: (folder: string) => void;
  onUpdateFolder: (folder: string, name: string) => void;
  // prompt props
  onDeletePrompt: (prompt: Prompt) => void;
  onUpdatePrompt: (prompt: Prompt) => void;
}

export const PromptFolder: FC<Props> = ({
  // 
  searchTerm,
  prompts,
  currentFolder,
  onDeleteFolder,
  onUpdateFolder,
  // prompt props
  onDeletePrompt,
  onUpdatePrompt,
}) => {
  // isDeleting：用于跟踪当前是否正在尝试删除文件夹
  // isRenaming：用于跟踪当前是否正在尝试重命名文件夹
  // renameValue：用于存储新的文件夹名称
  // isOpen：用于跟踪文件夹是否已经打开，即显示其内容
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  // 监视键盘按键，如果按下Enter键，则调用 handleRename 函数。
  const handleEnterDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleRename();
    }
  };
  // 调用传入的 onUpdateFolder 属性函数，用新的名称更新文件夹名称，并重置编辑状态
  const handleRename = () => {
    onUpdateFolder(currentFolder.id, renameValue);
    setRenameValue('');
    setIsRenaming(false);
  };
  // handleDrop、allowDrop 、highlightDrop 和 removeHighlight：实现拖放异步更新接口
  const handleDrop = (e: any, folder: Folder) => {
    if (e.dataTransfer) {
      setIsOpen(true);

      const prompt = JSON.parse(e.dataTransfer.getData('prompt'));

      const updatedPrompt = {
        ...prompt,
        folderId: folder.id,
      };

      onUpdatePrompt(updatedPrompt);

      e.target.style.background = 'none';
    }
  };

  const allowDrop = (e: any) => {
    e.preventDefault();
  };

  const highlightDrop = (e: any) => {
    e.target.style.background = '#343541';
  };

  const removeHighlight = (e: any) => {
    e.target.style.background = 'none';
  };
  // useEffect：监视 isRenaming 和 isDeleting 状态并相应的调整，以及根据 searchTerm 来自动打开或关闭文件夹。
  useEffect(() => {
    if (isRenaming) {
      setIsDeleting(false);
    } else if (isDeleting) {
      setIsRenaming(false);
    }
  }, [isRenaming, isDeleting]);

  useEffect(() => {
    if (searchTerm) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm]);
  // 组件的渲染部分主要涉及以下内容：

  // 如果处在重命名状态，就显示一个编辑框，可以输入新的文件夹名称
  // 如果不是在重命名状态，就显示一个按钮，该按钮显示当前的文件夹名称，并且可以通过点击以开启或关闭文件夹，并且可以通过拖放操作来添加提示（prompt）到文件夹中。按钮的右边还有一些操作图标，例如编辑和删除等
  // 所有的提示（prompt）元素若属于当前文件夹则展示出来。在 isOpen 状态为 true（即文件夹是打开的）的情况下，每个提示（ prompt）都会被渲染出来，否则不显示。
  return (
    <>
      <div className="relative flex items-center">
        {isRenaming ? (
          <div className="flex w-full items-center gap-3 bg-[#343541]/90 p-3">
            {isOpen ? (
              <IconCaretDown size={18} />
            ) : (
              <IconCaretRight size={18} />
            )}
            <input
              className="mr-12 flex-1 overflow-hidden overflow-ellipsis border-neutral-400 bg-transparent text-left text-[12.5px] leading-3 text-white outline-none focus:border-neutral-100"
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={handleEnterDown}
              autoFocus
            />
          </div>
        ) : (
          <button
            className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90`}
            onClick={() => setIsOpen(!isOpen)}
            onDrop={(e) => handleDrop(e, currentFolder)}
            onDragOver={allowDrop}
            onDragEnter={highlightDrop}
            onDragLeave={removeHighlight}
          >
            {isOpen ? (
              <IconCaretDown size={18} />
            ) : (
              <IconCaretRight size={18} />
            )}

            <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3">
              {currentFolder.name}
            </div>
          </button>
        )}

        {(isDeleting || isRenaming) && (
          <div className="absolute right-1 z-10 flex text-gray-300">
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();

                if (isDeleting) {
                  onDeleteFolder(currentFolder.id);
                } else if (isRenaming) {
                  handleRename();
                }

                setIsDeleting(false);
                setIsRenaming(false);
              }}
            >
              <IconCheck size={18} />
            </button>
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleting(false);
                setIsRenaming(false);
              }}
            >
              <IconX size={18} />
            </button>
          </div>
        )}

        {!isDeleting && !isRenaming && (
          <div className="absolute right-1 z-10 flex text-gray-300">
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
                setRenameValue(currentFolder.name);
              }}
            >
              <IconPencil size={18} />
            </button>
            <button
              className="min-w-[20px] p-1 text-neutral-400 hover:text-neutral-100"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleting(true);
              }}
            >
              <IconTrash size={18} />
            </button>
          </div>
        )}
      </div>

      {isOpen
        ? prompts.map((prompt, index) => {
            if (prompt.folderId === currentFolder.id) {
              return (
                <div key={index} className="ml-5 gap-2 border-l pl-2">
                  <PromptComponent
                    prompt={prompt}
                    onDeletePrompt={onDeletePrompt}
                    onUpdatePrompt={onUpdatePrompt}
                  />
                </div>
              );
            }
          })
        : null}
    </>
  );
};
