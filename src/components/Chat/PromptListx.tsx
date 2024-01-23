import { Prompt } from '../../types/prompt';
import { FC, MutableRefObject } from 'react';

interface Props {
  prompts: Prompt[];
  activePromptIndex: number;
  onSelect: () => void;
  onMouseOver: (index: number) => void;
  promptListRef: MutableRefObject<HTMLUListElement | null>;
}
// prompts: 一个Prompt对象的数组，其中Prompt是一个我们还不知道具体定义的类型，可能是在其他部分定义的。
// activePromptIndex: 当前活动的prompt的索引，在渲染prompt列表时，它被用来确定哪个项是活动的。
// onSelect: 一个点击每个项目所执行的函数。但注意此函数并无任何入参，它需要的所有数据应当已被封装在上下文或闭包中。
// onMouseOver: 当鼠标滑过prompt列表项时需要执行的函数，它接收当前悬浮项目的索引作为参数。
// promptListRef: 使用React的MutableRefObject建立对<ul>元素的引用，这允许你在其他地方直接访问和修改这个元素，它是React Hook useRef的返回值。
export const PromptList: FC<Props> = ({
  prompts,
  activePromptIndex,
  onSelect,
  onMouseOver,
  promptListRef,
}) => {
//   在PromptList组件函数本体中，我们首先创建了一个<ul>元素，并给它添加了一些CSS类以设置样式。这个<ul>元素使用了promptListRef作为它的ref。

// 在<ul>内部，我们遍历prompt数组生成一个由<li>元素构成的列表。每个<li>元素接收唯一的键（在这里即是每个prompt的id），并有一个处理点击事件的函数和鼠标悬浮事件的函数。如果一个prompt的索引等于activePromptIndex，那么给此<li>元素添加特殊的背景颜色。
  return (
    <ul
      ref={promptListRef}
      className="z-10 max-h-52 w-full overflow-scroll rounded border border-black/10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:border-neutral-500 dark:bg-[#343541] dark:text-white dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]"
    >
      {prompts.map((prompt, index) => (
        <li
          key={prompt.id}
          className={`${
            index === activePromptIndex
              ? 'bg-gray-200 dark:bg-[#202123] dark:text-black'
              : ''
          } cursor-pointer px-3 py-2 text-sm text-black dark:text-white`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect();
          }}
          onMouseEnter={() => onMouseOver(index)}
        >
          {prompt.name}
        </li>
      ))}
    </ul>
  );
};
