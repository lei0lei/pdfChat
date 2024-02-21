"use client";
import { SupportedExportFormats } from '../../types/export';
import { PluginKey } from '../../types/plugin';
import { IconFileExport, IconMoon, IconSun,IconHome,IconLogout } from '@tabler/icons-react';
import { useTranslation } from 'next-i18next';
import { FC } from 'react';
import { Import } from '../Settings/Import';
import { Key } from '../Settings/Key';
import { SidebarButton } from '../Sidebar/SidebarButton';
import { BiLogOut } from 'react-icons/bi';
import { AiOutlineRollback } from 'react-icons/ai';
import { BiHomeSmile, BiUser } from 'react-icons/bi';
import { HiOutlineChatBubbleBottomCenterText } from 'react-icons/hi2';
import { FiSettings } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router'
interface Props {
  lightMode: 'light' | 'dark';
  onToggleLightMode: (mode: 'light' | 'dark') => void;
}

export const SidebarSettings: FC<Props> = ({
  lightMode,
  onToggleLightMode,
}) => {
    const router = useRouter();
    const { t } = useTranslation('sidebar');
    const gotoMain = (e) => {
    // 在这里进行条件验证
    // if(some condition is met) {
    router.push('/');
    // }
    }
  const handleLogout = () => {
    // 执行注销操作
    // 删除保存的JWT
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    router.push('/auth/signin');
  }
  return (
    <div className="flex flex-col items-center space-y-1 border-t border-white/20 pt-1 text-sm">

    <SidebarButton
        text={t('主页')}
        icon={
          <IconHome size={18} />
        }
        // @ts-ignore
        onClick={gotoMain}
      />
    {/* <SidebarButton
        text={lightMode === 'light' ? t('Dark mode') : t('Light mode')}
        icon={
          lightMode === 'light' ? <IconMoon size={18} /> : <IconSun size={18} />
        }
        onClick={() =>
          onToggleLightMode(lightMode === 'light' ? 'dark' : 'light')
        }
      /> */}
    <SidebarButton
        text={t('登出')}
        icon={
          <IconLogout size={18} />
        }
        onClick={handleLogout}
      />
    </div>
    
  );
};
