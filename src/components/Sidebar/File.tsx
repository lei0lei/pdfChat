import { Conversation } from '../../types/chat';
import { KeyValuePair } from '../../types/data';
import {
  IconCheck,
  IconMessage,
  IconFile,
  IconPencil,
  IconTrash,
  IconX,
  IconFileTypePdf,
} from '@tabler/icons-react';
import { DragEvent, FC, KeyboardEvent, useEffect, useState } from 'react';
import React, { useContext} from 'react';
import { PdfContext } from '../../app/dashboard/context.js';
interface Props {
  file: string;
  loading: boolean;

}

export const FileComponent: FC<Props> = ({
  file,
  loading,

}) => {
  const { 
    currentShowFile,
    fileObjs,
    updateCurrentShowFile,
    updateCurrentShowFileObj,
     } = useContext(PdfContext);
  const handleSelectFile = (file) => {
    console.log('update current file')
    console.log(file)
    updateCurrentShowFile(file)
    let fileObj = fileObjs.find(
      (item) => item._fileName === file
    );
    console.log(fileObj)
    updateCurrentShowFileObj(fileObj);
  }
  return (
    <div className="relative flex items-center">
      <button
          className={`flex w-full cursor-pointer items-center gap-3 rounded-lg p-3 text-sm transition-colors duration-200 hover:bg-[#343541]/90 ${
            loading ? 'disabled:cursor-not-allowed' : ''
          } ${
            file === currentShowFile ? 'bg-[#343541]/90' : ''
          }`}
          onClick={() => handleSelectFile(file)}
          disabled={loading}
          draggable="false"
        >
          <IconFileTypePdf size={18} />
          <div
            className={`relative max-h-5 flex-1 overflow-hidden text-ellipsis whitespace-nowrap break-all text-left text-[12.5px] leading-3 ${
              file === currentShowFile ? 'pr-12' : 'pr-1'
            }`}
          >
            {file}
          </div>
        </button>
    </div>
  );
};
