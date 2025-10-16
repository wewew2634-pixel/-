/**
 * JJIKMEOK Offline Queue
 * IndexedDB-based upload queue with exponential backoff retry logic
 */

export interface QueueItem {
  id: string
  file: File | Blob
  assignmentId?: number
  metadata: {
    filename: string
    size: number
    type: string
    createdAt: number
  }
  status: 'pending' | 'uploading' | 'completed' | 'failed' | 'retrying'
  uploadUrl?: string
  retryCount: number
  maxRetries: number
  lastRetryAt?: number
  error?: string
}

export interface QueueStats {
  pending: number
  uploading: number
  completed: number
  failed: number
  totalSize: number
}

class OfflineUploadQueue {
  private dbName = 'jjikmeok-upload-queue'
  private dbVersion = 1
  private storeName = 'uploads'
  private db: IDBDatabase | null = null
  private maxItems = 5
  private maxTotalSize = 250 * 1024 * 1024 // 250MB
  private maxItemSize = 25 * 1024 * 1024 // 25MB per item

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('IndexedDB not available'))
        return
      }

      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id' })
          store.createIndex('status', 'status', { unique: false })
          store.createIndex('createdAt', 'metadata.createdAt', { unique: false })
        }
      }
    })
  }

  async addToQueue(
    file: File | Blob, 
    assignmentId?: number,
    metadata?: Partial<QueueItem['metadata']>
  ): Promise<string> {
    if (!this.db) await this.init()

    // Validate file size
    if (file.size > this.maxItemSize) {
      throw new Error(`File size ${this.formatSize(file.size)} exceeds maximum ${this.formatSize(this.maxItemSize)}`)
    }

    // Check queue capacity
    const stats = await this.getStats()
    if (stats.pending + stats.uploading >= this.maxItems) {
      throw new Error(`Queue full: maximum ${this.maxItems} items`)
    }

    if (stats.totalSize + file.size > this.maxTotalSize) {
      throw new Error(`Queue size limit exceeded: ${this.formatSize(stats.totalSize + file.size)} > ${this.formatSize(this.maxTotalSize)}`)
    }

    const id = this.generateId()
    const item: QueueItem = {
      id,
      file,
      assignmentId,
      metadata: {
        filename: metadata?.filename || `upload-${Date.now()}.webm`,
        size: file.size,
        type: file.type || 'video/webm',
        createdAt: Date.now(),
        ...metadata
      },
      status: 'pending',
      retryCount: 0,
      maxRetries: 5
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.add(item)

      request.onsuccess = () => resolve(id)
      request.onerror = () => reject(request.error)
    })
  }

  async getQueueItems(): Promise<QueueItem[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly')
      const store = transaction.objectStore(this.storeName)
      const request = store.getAll()

      request.onsuccess = () => {
        const items = request.result.sort((a, b) => a.metadata.createdAt - b.metadata.createdAt)
        resolve(items)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async updateQueueItem(id: string, updates: Partial<QueueItem>): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      
      const getRequest = store.get(id)
      getRequest.onsuccess = () => {
        const item = getRequest.result
        if (!item) {
          reject(new Error('Item not found'))
          return
        }

        const updatedItem = { ...item, ...updates }
        const putRequest = store.put(updatedItem)
        putRequest.onsuccess = () => resolve()
        putRequest.onerror = () => reject(putRequest.error)
      }
      getRequest.onerror = () => reject(getRequest.error)
    })
  }

  async removeQueueItem(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite')
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async processQueue(): Promise<void> {
    const items = await this.getQueueItems()
    const pendingItems = items.filter(item => 
      item.status === 'pending' || 
      (item.status === 'failed' && this.shouldRetry(item))
    )

    for (const item of pendingItems) {
      try {
        await this.uploadItem(item)
      } catch (error) {
        console.error(`Upload failed for item ${item.id}:`, error)
      }
    }
  }

  private async uploadItem(item: QueueItem): Promise<void> {
    try {
      // Update status to uploading
      await this.updateQueueItem(item.id, { 
        status: 'uploading',
        lastRetryAt: Date.now()
      })

      // Create form data
      const formData = new FormData()
      formData.append('file', item.file, item.metadata.filename)
      if (item.assignmentId) {
        formData.append('assignment_id', item.assignmentId.toString())
      }

      // Upload to API
      const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
      const response = await fetch(`${apiBase}/api/direct_upload`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()

      // Update status to completed
      await this.updateQueueItem(item.id, {
        status: 'completed',
        uploadUrl: result.file_url,
        error: undefined
      })

      // Trigger proof QA if assignment ID provided
      if (item.assignmentId && result.file_url) {
        try {
          await this.triggerProofQA(item.assignmentId, result.file_url, item.metadata)
        } catch (qaError) {
          console.warn('Proof QA trigger failed:', qaError)
          // Don't fail the upload for QA issues
        }
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      
      if (item.retryCount < item.maxRetries) {
        // Schedule retry with exponential backoff
        await this.updateQueueItem(item.id, {
          status: 'failed',
          retryCount: item.retryCount + 1,
          error: errorMessage,
          lastRetryAt: Date.now()
        })
      } else {
        // Max retries exceeded
        await this.updateQueueItem(item.id, {
          status: 'failed',
          error: `Max retries exceeded: ${errorMessage}`
        })
      }

      throw error
    }
  }

  private async triggerProofQA(assignmentId: number, videoUrl: string, metadata: QueueItem['metadata']): Promise<void> {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000'
    
    const qaData = {
      assignment_id: assignmentId,
      video_url: videoUrl,
      duration_sec: metadata.size > 0 ? undefined : 15, // Would get from video analysis
      file_size_mb: metadata.size / (1024 * 1024),
      resolution: '1920x1080' // Would get from video analysis
    }

    const response = await fetch(`${apiBase}/api/proofs/qa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(qaData)
    })

    if (!response.ok) {
      throw new Error(`Proof QA failed: ${response.status}`)
    }
  }

  private shouldRetry(item: QueueItem): boolean {
    if (item.retryCount >= item.maxRetries) return false
    if (!item.lastRetryAt) return true

    // Exponential backoff: 2s, 4s, 8s, 16s, 32s
    const backoffMs = Math.pow(2, item.retryCount) * 2000
    const maxBackoffMs = 2 * 60 * 1000 // 2 minutes max
    const actualBackoffMs = Math.min(backoffMs, maxBackoffMs)

    return Date.now() - item.lastRetryAt >= actualBackoffMs
  }

  async getStats(): Promise<QueueStats> {
    const items = await this.getQueueItems()
    
    return items.reduce((stats, item) => {
      stats[item.status]++
      stats.totalSize += item.metadata.size
      return stats
    }, {
      pending: 0,
      uploading: 0,
      completed: 0,
      failed: 0,
      totalSize: 0
    } as QueueStats)
  }

  async clearCompleted(): Promise<number> {
    const items = await this.getQueueItems()
    const completedItems = items.filter(item => item.status === 'completed')
    
    for (const item of completedItems) {
      await this.removeQueueItem(item.id)
    }

    return completedItems.length
  }

  async retryFailed(): Promise<void> {
    const items = await this.getQueueItems()
    const failedItems = items.filter(item => item.status === 'failed')
    
    for (const item of failedItems) {
      if (item.retryCount < item.maxRetries) {
        await this.updateQueueItem(item.id, {
          status: 'pending',
          error: undefined
        })
      }
    }
  }

  private generateId(): string {
    return `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private formatSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Auto-retry mechanism
  startAutoRetry(intervalMs: number = 5000): void {
    if (typeof window === 'undefined') return

    const processQueueSafely = async () => {
      try {
        await this.processQueue()
      } catch (error) {
        console.error('Auto-retry queue processing failed:', error)
      }
    }

    // Process on visibility change (when app becomes active)
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        processQueueSafely()
      }
    })

    // Process on network status change
    window.addEventListener('online', processQueueSafely)

    // Periodic processing
    setInterval(processQueueSafely, intervalMs)
  }
}

// Export singleton instance
export const uploadQueue = new OfflineUploadQueue()