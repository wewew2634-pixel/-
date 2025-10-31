'use client'

import { useState, useEffect } from 'react'
import { MissionCard, Mission } from '@/components/MissionCard'
import { 
  FunnelIcon,
  MapPinIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline'

export default function CreatorHomePage() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState({
    sort: 'near', // near, urgent, pay
    category: '',
    radius: 5
  })

  useEffect(() => {
    loadMissions()
  }, [filter])

  const loadMissions = async () => {
    try {
      setIsLoading(true)
      
      // Get user location (mock for now)
      const userLocation = { lat: 37.5665, lng: 126.9780 } // Seoul City Hall
      
      const params = new URLSearchParams({
        status: 'open',
        lat: userLocation.lat.toString(),
        lng: userLocation.lng.toString(),
        radius_km: filter.radius.toString(),
        sort: filter.sort,
        limit: '20'
      })

      if (filter.category) {
        params.append('category', filter.category)
      }

      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
      const response = await fetch(`${apiBase}/v1/missions/list?${params}`)
      
      if (response.ok) {
        const data = await response.json()
        setMissions(data)
      } else {
        console.error('Failed to load missions')
        // Mock data for development
        setMissions(getMockMissions())
      }
    } catch (error) {
      console.error('Error loading missions:', error)
      // Mock data for development
      setMissions(getMockMissions())
    } finally {
      setIsLoading(false)
    }
  }

  const handleAcceptMission = async (missionId: number) => {
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
      
      // First create assignment
      const createResponse = await fetch(`${apiBase}/v1/assignments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mission_id: missionId,
          creator_id: 1 // Mock creator ID
        })
      })

      if (createResponse.ok) {
        const assignmentData = await createResponse.json()
        
        // Then accept it
        const acceptResponse = await fetch(`${apiBase}/v1/assignments/accept`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            assignment_id: assignmentData.id
          })
        })

        if (acceptResponse.ok) {
          alert('미션을 수락했습니다! 캡처 탭으로 이동하여 촬영을 시작하세요.')
          loadMissions() // Refresh missions
        } else {
          alert('미션 수락에 실패했습니다.')
        }
      }
    } catch (error) {
      console.error('Error accepting mission:', error)
      alert('미션 수락 중 오류가 발생했습니다.')
    }
  }

  const getMockMissions = (): Mission[] => [
    {
      id: 1,
      merchant_name: "성수동 로컬 카페",
      category: "카페",
      budget_krw: 15000,
      description: "신메뉴 아이스크림 라떼 리뷰 영상을 촬영해주세요. 맛과 비주얼을 강조해서 15초 이내로 제작해주세요.",
      address: "서울시 성동구 성수동 123-45",
      expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
      distance_km: 0.8,
      geofence: { lat: 37.5445, lng: 127.0557, radius_km: 0.5 }
    },
    {
      id: 2,
      merchant_name: "홍대 핫플레이스",
      category: "음식",
      budget_krw: 25000,
      description: "새로 오픈한 떡볶이 맛집을 소개해주세요. 매운맛 도전 콘텐츠로 제작하면 더욱 좋습니다!",
      address: "서울시 마포구 홍익로 456",
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      distance_km: 1.2,
      geofence: { lat: 37.5563, lng: 126.9236, radius_km: 0.3 }
    },
    {
      id: 3,
      merchant_name: "강남 뷰티샵",
      category: "뷰티",
      budget_krw: 35000,
      description: "헤어 컬러링 과정을 비포&애프터 형태로 촬영해주세요. 자연스러운 일상 브이로그 스타일로 부탁드립니다.",
      address: "서울시 강남구 테헤란로 789",
      expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
      distance_km: 2.5,
      geofence: { lat: 37.5012, lng: 127.0396, radius_km: 1.0 }
    }
  ]

  const filterOptions = {
    sort: [
      { value: 'near', label: '가까운 순' },
      { value: 'urgent', label: '급한 순' },
      { value: 'pay', label: '수익 높은 순' }
    ],
    category: [
      { value: '', label: '전체' },
      { value: '음식', label: '음식' },
      { value: '카페', label: '카페' },
      { value: '뷰티', label: '뷰티' },
      { value: '패션', label: '패션' },
      { value: '라이프스타일', label: '라이프스타일' }
    ]
  }

  return (
    <div className="safe-area-inset-top">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              근처 미션
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <MapPinIcon className="w-4 h-4 mr-1" />
              성수동 기준
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="상호명 또는 카테고리 검색"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 button-haptic">
              <FunnelIcon className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-4">
            {filterOptions.sort.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(prev => ({ ...prev, sort: option.value }))}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors button-haptic ${
                  filter.sort === option.value
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {filterOptions.category.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(prev => ({ ...prev, category: option.value }))}
                className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors button-haptic ${
                  filter.category === option.value
                    ? 'bg-secondary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mission List */}
      <div className="p-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-gray-200 rounded flex-1"></div>
                  <div className="h-10 bg-gray-200 rounded flex-1"></div>
                </div>
              </div>
            ))}
          </div>
        ) : missions.length > 0 ? (
          <div className="space-y-4">
            {missions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onAccept={handleAcceptMission}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MapPinIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              근처에 미션이 없어요
            </h3>
            <p className="text-gray-500 mb-4">
              검색 반경을 늘리거나 다른 지역을 확인해보세요
            </p>
            <button 
              onClick={loadMissions}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors button-haptic"
            >
              새로고침
            </button>
          </div>
        )}
      </div>
    </div>
  )
}