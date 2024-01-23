// PromptFolder组件
import { Folder } from '../../../types/folder';
import { Prompt } from '../../../types/prompt';
import { FC } from 'react';
import { PromptFolder } from './PromptFolder';

interface Props {
  searchTerm: string;
  prompts: Prompt[];
  folders: Folder[];
  onDeleteFolder: (folder: string) => void;
  onUpdateFolder: (folder: string, name: string) => void;
  // prompt props
  onDeletePrompt: (prompt: Prompt) => void;
  onUpdatePrompt: (prompt: Prompt) => void;
}

export const PromptFolders: FC<Props> = ({
  searchTerm,
  prompts,
  folders,
  onDeleteFolder,
  onUpdateFolder,
  // prompt props
  onDeletePrompt,
  onUpdatePrompt,
}) => {
  return (
    // 组件的主体部分为一个div元素，内部通过数组的map方法来对所有的folders
    // 进行遍历并为每一个生成一个PromptFolder组件。
    <div className="flex w-full flex-col pt-2">
      {folders.map((folder, index) => (
        <PromptFolder
          key={index}
          searchTerm={searchTerm}
          prompts={prompts.filter((p) => p.folderId)}
          currentFolder={folder}
          onDeleteFolder={onDeleteFolder}
          onUpdateFolder={onUpdateFolder}
          // prompt props
          onDeletePrompt={onDeletePrompt}
          onUpdatePrompt={onUpdatePrompt}
        />
      ))}
    </div>
  );
};
