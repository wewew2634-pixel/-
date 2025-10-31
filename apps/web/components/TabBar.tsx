'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  HomeIcon, 
  MapIcon, 
  VideoCameraIcon, 
  WalletIcon, 
  UserIcon 
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid,
  MapIcon as MapIconSolid,
  VideoCameraIcon as VideoCameraIconSolid,
  WalletIcon as WalletIconSolid,
  UserIcon as UserIconSolid
} from '@heroicons/react/24/solid'

const tabs = [
  {
    name: '미션',
    href: '/creator/home',
    icon: HomeIcon,
    iconSolid: HomeIconSolid,
  },
  {
    name: '지도',
    href: '/creator/map',
    icon: MapIcon,
    iconSolid: MapIconSolid,
  },
  {
    name: '캡처',
    href: '/creator/capture',
    icon: VideoCameraIcon,
    iconSolid: VideoCameraIconSolid,
    primary: true,
  },
  {
    name: '지갑',
    href: '/creator/wallet',
    icon: WalletIcon,
    iconSolid: WalletIconSolid,
  },
  {
    name: '프로필',
    href: '/creator/me',
    icon: UserIcon,
    iconSolid: UserIconSolid,
  },
]

export function TabBar() {
  const pathname = usePathname()

  return (
    <div className="tab-bar fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom">
      <div className="flex h-16 items-center justify-around px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const Icon = isActive ? tab.iconSolid : tab.icon

          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                flex flex-col items-center justify-center px-3 py-1 rounded-xl min-w-0 flex-1
                transition-all duration-200 button-haptic
                ${isActive 
                  ? 'text-primary-600 bg-primary-50' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }
                ${tab.primary && isActive ? 'bg-primary-500 text-white scale-110' : ''}
                ${tab.primary && !isActive ? 'bg-gray-200 text-gray-600' : ''}
              `}
            >
              <Icon className={`
                w-6 h-6 mb-1 transition-all duration-200
                ${tab.primary && isActive ? 'w-7 h-7' : ''}
              `} />
              <span className={`
                text-xs font-medium truncate
                ${tab.primary && isActive ? 'font-bold' : ''}
              `}>
                {tab.name}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}