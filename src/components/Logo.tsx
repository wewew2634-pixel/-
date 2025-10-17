import Logo2025 from '../../components/Logo2025'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  // 레거시 모드 - 구 버전 로고를 사용하고 싶을 때
  legacy?: boolean
}

export default function Logo({ 
  className = '', 
  size = 'md',
  animated = true,
  legacy = false
}: LogoProps) {
  // 레거시 모드일 때만 기존 로고 표시 (옵션)
  if (legacy) {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg transform transition-transform hover:scale-105">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-400/20 to-red-500/20 blur-xl" />
          <div className="relative flex items-center justify-center h-full">
            <span className="text-white font-black text-lg md:text-xl tracking-tight">JM</span>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
        <div className="ml-3 hidden sm:block">
          <div className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">찍먹</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 -mt-1">JJIKMEOK</div>
        </div>
      </div>
    )
  }
  
  // 2025년 최신 트렌드 로고
  return <Logo2025 className={className} size={size} animated={animated} />
}