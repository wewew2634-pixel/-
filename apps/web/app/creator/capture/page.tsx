'use client'

import { useState, useRef, useCallback } from 'react'
import { 
  VideoCameraIcon,
  StopIcon,
  ArrowPathIcon,
  CheckIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline'
import { uploadQueue } from '@/lib/offline-queue'

interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  recordedBlob?: Blob
}

interface CaptureGuide {
  title: string
  instructions: string[]
  sampleImage?: string
}

export default function CreatorCapturePage() {
  const [recordingState, setRecordingState] = useState<RecordingState>({
    isRecording: false,
    isPaused: false,
    duration: 0
  })
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [captureGuide, setCaptureGuide] = useState<CaptureGuide>({
    title: "카페 메뉴 촬영 가이드",
    instructions: [
      "📱 세로 모드로 촬영해주세요",
      "☕ 메뉴의 전체적인 모습을 먼저 보여주세요",
      "🎬 맛을 표현하는 리액션을 자연스럽게 연출해주세요",
      "#️⃣ 영상 시작 부분에 '#광고'를 명시해주세요",
      "⏰ 15초 이내로 간결하게 제작해주세요"
    ]
  })
  const [isUploading, setIsUploading] = useState(false)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const previewRef = useRef<HTMLVideoElement>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout>()
  const chunks = useRef<Blob[]>([])

  const startCapture = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'user', // Start with front camera
          width: { ideal: 1080 },
          height: { ideal: 1920 }
        },
        audio: true
      })

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }

      const recorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm;codecs=vp9,opus'
      })

      chunks.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/webm' })
        setRecordingState(prev => ({ ...prev, recordedBlob: blob }))
        
        // Create preview URL
        if (previewRef.current) {
          previewRef.current.src = URL.createObjectURL(blob)
        }

        // Stop all tracks
        mediaStream.getTracks().forEach(track => track.stop())
      }

      setMediaRecorder(recorder)
      setStream(mediaStream)

    } catch (error) {
      console.error('Error accessing camera:', error)
      alert('카메라 접근 권한이 필요합니다.')
    }
  }, [])

  const startRecording = () => {
    if (!mediaRecorder) return

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate(100)
    }

    // Play audio feedback
    playRecordingSound('start')

    mediaRecorder.start(100) // Collect data every 100ms
    
    setRecordingState(prev => ({ 
      ...prev, 
      isRecording: true, 
      duration: 0,
      recordedBlob: undefined 
    }))

    // Start duration counter
    durationIntervalRef.current = setInterval(() => {
      setRecordingState(prev => {
        const newDuration = prev.duration + 0.1
        
        // Auto-stop at 15 seconds
        if (newDuration >= 15) {
          stopRecording()
          return { ...prev, duration: 15 }
        }
        
        return { ...prev, duration: newDuration }
      })
    }, 100)
  }

  const stopRecording = () => {
    if (!mediaRecorder || recordingState.isRecording === false) return

    // Clear interval
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
    }

    // Vibrate if supported
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100])
    }

    // Play audio feedback
    playRecordingSound('stop')

    mediaRecorder.stop()
    
    setRecordingState(prev => ({ 
      ...prev, 
      isRecording: false 
    }))
  }

  const playRecordingSound = (type: 'start' | 'stop') => {
    // Create audio feedback (simple beep)
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.setValueAtTime(type === 'start' ? 800 : 600, audioContext.currentTime)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.1)
    } catch (error) {
      // Audio feedback not available
    }
  }

  const retakeVideo = () => {
    setRecordingState(prev => ({ 
      ...prev, 
      recordedBlob: undefined,
      duration: 0 
    }))
    
    if (previewRef.current) {
      previewRef.current.src = ''
    }
  }

  const submitVideo = async () => {
    if (!recordingState.recordedBlob) return

    try {
      setIsUploading(true)

      // Add to offline queue
      const queueId = await uploadQueue.addToQueue(
        recordingState.recordedBlob,
        1, // Mock assignment ID
        {
          filename: `capture-${Date.now()}.webm`,
          size: recordingState.recordedBlob.size,
          type: 'video/webm'
        }
      )

      // Process queue immediately
      await uploadQueue.processQueue()

      alert('영상이 업로드되었습니다! QA 검토 후 결과를 알려드릴게요.')
      
      // Reset state
      setRecordingState({
        isRecording: false,
        isPaused: false,
        duration: 0
      })

      // Navigate to uploads page to see progress
      window.location.href = '/creator/uploads'

    } catch (error) {
      console.error('Upload error:', error)
      alert('업로드에 실패했습니다. 오프라인 큐에 저장되어 자동으로 재시도됩니다.')
    } finally {
      setIsUploading(false)
    }
  }

  const formatDuration = (seconds: number) => {
    return `${seconds.toFixed(1)}s`
  }

  const getDurationColor = (duration: number) => {
    if (duration >= 15) return 'text-red-500'
    if (duration >= 12) return 'text-orange-500'
    return 'text-green-500'
  }

  return (
    <div className="min-h-screen bg-black safe-area-inset-top">
      {/* Capture Guide Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 via-black/40 to-transparent p-4 safe-area-inset-top">
        <h2 className="text-white text-lg font-bold mb-2">{captureGuide.title}</h2>
        <div className="space-y-1">
          {captureGuide.instructions.map((instruction, index) => (
            <p key={index} className="text-white/90 text-sm">
              {instruction}
            </p>
          ))}
        </div>
      </div>

      {/* Video Preview */}
      <div className="relative w-full h-full">
        {!recordingState.recordedBlob ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            onLoadedMetadata={startCapture}
          />
        ) : (
          <video
            ref={previewRef}
            controls
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {/* Recording Indicator */}
        {recordingState.isRecording && (
          <div className="absolute top-4 right-4 flex items-center bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
            REC {formatDuration(recordingState.duration)}
          </div>
        )}

        {/* Duration Display */}
        <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
          <div className={`text-2xl font-bold ${getDurationColor(recordingState.duration)} bg-black/50 px-4 py-2 rounded-full`}>
            {formatDuration(recordingState.duration)} / 15.0s
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 safe-area-inset-bottom">
        {!recordingState.recordedBlob ? (
          <div className="flex items-center justify-center">
            {!recordingState.isRecording ? (
              <button
                onClick={stream ? startRecording : startCapture}
                disabled={!stream && recordingState.isRecording}
                className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg button-haptic hover:bg-red-600 transition-colors"
              >
                <VideoCameraIcon className="w-10 h-10 text-white" />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center shadow-lg button-haptic hover:bg-red-600 transition-colors animate-pulse"
              >
                <StopIcon className="w-10 h-10 text-white" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={retakeVideo}
              className="flex items-center px-6 py-3 bg-gray-600 text-white rounded-full button-haptic hover:bg-gray-700 transition-colors"
            >
              <ArrowPathIcon className="w-5 h-5 mr-2" />
              다시 촬영
            </button>
            
            <button
              onClick={submitVideo}
              disabled={isUploading}
              className={`flex items-center px-6 py-3 rounded-full button-haptic transition-colors ${
                isUploading
                  ? 'bg-gray-400 text-gray-200'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full loading-spinner mr-2"></div>
                  업로드 중...
                </>
              ) : (
                <>
                  <CheckIcon className="w-5 h-5 mr-2" />
                  제출하기
                </>
              )}
            </button>
          </div>
        )}

        {/* Tips */}
        <div className="mt-4 text-center">
          <p className="text-white/80 text-sm">
            {recordingState.isRecording 
              ? "촬영 중입니다. 자연스럽게 연출해주세요!"
              : recordingState.recordedBlob
              ? "미리보기를 확인하고 제출하거나 다시 촬영하세요"
              : "빨간 버튼을 눌러 촬영을 시작하세요"
            }
          </p>
        </div>
      </div>
    </div>
  )
}