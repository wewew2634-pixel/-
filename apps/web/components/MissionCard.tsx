'use client'

import { useState } from 'react'
import { 
  MapPinIcon, 
  ClockIcon, 
  BanknotesIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

export interface Mission {
  id: number
  merchant_name: string
  category: string
  budget_krw: number
  description?: string
  address?: string
  expires_at: string
  distance_km?: number
  geofence?: {
    lat: number
    lng: number
    radius_km: number
  }
}

interface MissionCardProps {
  mission: Mission
  onAccept?: (missionId: number) => void
  onViewDetails?: (missionId: number) => void
  isLoading?: boolean
}

export function MissionCard({ 
  mission, 
  onAccept, 
  onViewDetails,
  isLoading = false 
}: MissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleAccept = () => {
    if (onAccept && !isLoading) {
      onAccept(mission.id)
    }
  }

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(mission.id)
    } else {
      setIsExpanded(!isExpanded)
    }
  }

  const formatBudget = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      '음식': 'bg-orange-100 text-orange-800',
      '카페': 'bg-amber-100 text-amber-800',
      '뷰티': 'bg-pink-100 text-pink-800',
      '패션': 'bg-purple-100 text-purple-800',
      '라이프스타일': 'bg-green-100 text-green-800',
      '헬스': 'bg-blue-100 text-blue-800',
      '기타': 'bg-gray-100 text-gray-800',
    }
    return colors[category as keyof typeof colors] || colors['기타']
  }

  const getUrgencyColor = () => {
    const expiresAt = new Date(mission.expires_at)
    const hoursLeft = (expiresAt.getTime() - Date.now()) / (1000 * 60 * 60)
    
    if (hoursLeft <= 2) return 'text-red-600 bg-red-50'
    if (hoursLeft <= 6) return 'text-orange-600 bg-orange-50'
    return 'text-green-600 bg-green-50'
  }

  return (
    <div className="mission-card bg-white rounded-2xl p-4 mb-4 border border-gray-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {mission.merchant_name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(mission.category)}`}>
              {mission.category}
            </span>
            {mission.distance_km && (
              <span className="text-xs text-gray-500 flex items-center">
                <MapPinIcon className="w-3 h-3 mr-1" />
                {mission.distance_km.toFixed(1)}km
              </span>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-primary-600">
            {formatBudget(mission.budget_krw)}
          </div>
          <div className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor()}`}>
            <ClockIcon className="w-3 h-3 inline mr-1" />
            {formatDistanceToNow(new Date(mission.expires_at), { 
              locale: ko, 
              addSuffix: true 
            })}
          </div>
        </div>
      </div>

      {/* Address */}
      {mission.address && (
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{mission.address}</span>
        </div>
      )}

      {/* Description (Expandable) */}
      {mission.description && (
        <div className="mb-4">
          <p className={`text-sm text-gray-700 ${!isExpanded ? 'line-clamp-2' : ''}`}>
            {mission.description}
          </p>
          {mission.description.length > 100 && (
            <button
              onClick={handleViewDetails}
              className="text-xs text-primary-600 mt-1 hover:text-primary-700 transition-colors"
            >
              {isExpanded ? '접기' : '더 보기'}
            </button>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={handleViewDetails}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors button-haptic"
          disabled={isLoading}
        >
          상세보기
        </button>
        <button
          onClick={handleAccept}
          disabled={isLoading}
          className={`
            flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-colors button-haptic
            ${isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700'
            }
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full loading-spinner mr-2"></div>
              처리중...
            </div>
          ) : (
            '미션 수락'
          )}
        </button>
      </div>

      {/* Mission Info Pills */}
      <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
          <BanknotesIcon className="w-3 h-3 mr-1" />
          즉시 정산 가능
        </div>
        <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
          <CalendarIcon className="w-3 h-3 mr-1" />
          당일 마감
        </div>
        {mission.geofence && (
          <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
            <MapPinIcon className="w-3 h-3 mr-1" />
            {mission.geofence.radius_km}km 반경
          </div>
        )}
      </div>
    </div>
  )
}