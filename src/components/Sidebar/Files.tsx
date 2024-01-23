import { Conversation,FileObj } from '../../types/chat';
import { KeyValuePair } from '../../types/data';
import { FC } from 'react';
import { FileComponent } from './File';

interface Props {
  loading: boolean;
  files: string[];
  selectedFile: string;
}

export const Files: FC<Props> = ({
  loading,
  files,
  selectedFile,
}) => {
  return (
    <div className="flex w-full flex-col gap-1">
      {files
        .slice()
        .reverse()
        .map((file, index) => (
          <FileComponent
            key={index}
            selectedFile={selectedFile}
            file={file}
            loading={loading}
          />
        ))}
    </div>
  );
};
