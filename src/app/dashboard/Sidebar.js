import { useRef, useState, useContext } from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AnimatePresence, motion } from 'framer-motion';
import { useClickAway } from 'react-use';
import { AiOutlineRollback } from 'react-icons/ai';
import { BiHomeSmile, BiUser } from 'react-icons/bi';
import { HiOutlineChatBubbleBottomCenterText } from 'react-icons/hi2';
import { FiSettings } from 'react-icons/fi';
import { PdfContext } from './context.js';
import { BiLogOut } from 'react-icons/bi';
import Link from 'next/link';




const handleLogout = () => {
    // 执行注销操作
    // 删除保存的JWT
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }
export const Sidebar = () => {
  const {
    currentShowFile,
    updateCurrentShowFile,
    updateCurrentShowFileObj,
    fileList,
    fileObjs,
  } = useContext(PdfContext);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickAway(ref, () => setOpen(false));

  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="p-3 border-2 border-zinc-800 rounded-xl"
        aria-label="toggle sidebar"
      >
        <GiHamburgerMenu />
      </button>
      <AnimatePresence mode="wait" initial={false}>
        {open && (
          <>
            <motion.div
              {...framerSidebarBackground}
              aria-hidden="true"
              className="fixed bottom-0 left-0 right-0 top-0 z-40 bg-[rgba(0,0,0,0.1)] backdrop-blur-sm"
            ></motion.div>
            <motion.div
              {...framerSidebarPanel}
              className="fixed top-0 bottom-0 left-0 z-50 w-full h-screen max-w-xs border-r-2 border-zinc-800 bg-zinc-900 flex flex-col justify-between"
              ref={ref}
              aria-label="Sidebar"
            >
              <div className="border-b-2 border-zinc-800">
                <div className="flex items-center justify-between p-5">
                  <span>欢迎</span>
                  <button
                    onClick={toggleSidebar}
                    className="p-3 border-2 border-zinc-800 rounded-xl"
                    aria-label="close sidebar"
                  >
                    <AiOutlineRollback />
                  </button>
                </div>
                {Array.isArray(fileList) &&
                  fileList.map((fileName, index) => (
                    <li key={fileName} className="border-b-2 border-zinc-800 list-none">
                      <a
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          updateCurrentShowFile(fileName);
                          let fileObj = fileObjs.find(
                            (item) => item._fileName === fileName
                          );

                          updateCurrentShowFileObj(fileObj);
                        }}
                        className={`flex items-center justify-between gap-5 p-5 transition-all w-full ${
                          currentShowFile === fileName
                            ? 'bg-blue-400 text-white'
                            : 'hover:bg-blue-500 hover:text-white'
                        }`}
                      >
                        <motion.span {...framerText(index)}>
                          {fileName}
                        </motion.span>
                      </a>
                    </li>
                  ))}
              </div>
              <ul className="border-t-2 border-zinc-800">
                {items.map((item, idx) => {
                  const { title, href, Icon,onClick } = item;
                  return (
                    <li key={title} className="border-b-2 border-zinc-800">
                      <a
                        onClick={onClick||toggleSidebar}
                        href={href}
                        className="flex items-center justify-between gap-5 p-5 transition-all hover:bg-zinc-900"
                      >
                        <motion.span {...framerText(idx)}>{title}</motion.span>
                        <motion.div {...framerIcon}>
                          <Icon className="text-2xl" />
                        </motion.div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const items = [
    { title: '主页', Icon: BiHomeSmile, href: '/' },
    { title: '关于', Icon: BiUser, href: '#' },
    { title: '联系我们', Icon: HiOutlineChatBubbleBottomCenterText, href: '#' },
    { title: '设置', Icon: FiSettings, href: '#' },
    { title: '新页面', Icon: FiSettings, href: '/test' },
    { title: '登出', Icon: BiLogOut, href: '/auth/signin', onClick: handleLogout },
  ];
  
  const framerSidebarBackground = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { delay: 0.2 } },
    transition: { duration: 0.3 },
  };
  
  const framerSidebarPanel = {
    initial: { x: '-100%' },
    animate: { x: 0 },
    exit: { x: '-100%' },
    transition: { duration: 0.3 },
  };
  
  const framerText = (delay) => {
    return {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: {
        delay: 0.5 + delay / 10,
      },
    };
  };
  
  const framerIcon = {
    initial: { scale: 0 },
    animate: { scale: 1 },
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
      delay: 1.5,
    },
  };
  
  export default Sidebar;