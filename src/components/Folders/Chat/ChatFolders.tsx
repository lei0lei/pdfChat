// ChatFolders组件
import { Conversation } from '../../../types/chat';
import { KeyValuePair } from '../../../types/data';
import { Folder } from '../../../types/folder';
import { FC } from 'react';
import { ChatFolder } from './ChatFolder';

interface Props {
  searchTerm: string;
  conversations: Conversation[];
  folders: Folder[];
  onDeleteFolder: (folder: string) => void;
  onUpdateFolder: (folder: string, name: string) => void;
  // conversation props
  selectedConversation: Conversation;
  loading: boolean;
  onSelectConversation: (conversation: Conversation) => void;
  onDeleteConversation: (conversation: Conversation) => void;
  onUpdateConversation: (
    conversation: Conversation,
    data: KeyValuePair,
  ) => void;
}

export const ChatFolders: FC<Props> = ({
  searchTerm,
  conversations,
  folders,
  onDeleteFolder,
  onUpdateFolder,
  // conversation props
  selectedConversation,
  loading,
  onSelectConversation,
  onDeleteConversation,
  onUpdateConversation,
}) => {
  // 遍历所有的 file 并为每一个文件夹生成一个 ChatFolder 组件。
  return (
    <div className="flex w-full flex-col pt-2">
      {folders.map((folder, index) => (
        <ChatFolder
          key={index}
          searchTerm={searchTerm}
          conversations={conversations.filter((c) => c.folderId)}
          currentFolder={folder}
          onDeleteFolder={onDeleteFolder}
          onUpdateFolder={onUpdateFolder}
          // conversation props
          selectedConversation={selectedConversation}
          loading={loading}
          onSelectConversation={onSelectConversation}
          onDeleteConversation={onDeleteConversation}
          onUpdateConversation={onUpdateConversation}
        />
      ))}
    </div>
  );
};
