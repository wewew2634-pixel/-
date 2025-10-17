import { test, expect } from '@playwright/test'

/**
 * JJIKMEOK E2E Smoke Test
 * Tests the critical path: Mission → Accept → Capture → Upload → Wallet
 */

test.describe('JJIKMEOK Core Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from creator home page
    await page.goto('/creator/home')
  })

  test('should display mission list and allow navigation', async ({ page }) => {
    // Check page loads
    await expect(page).toHaveTitle(/JJIKMEOK/)
    
    // Check main heading
    await expect(page.getByRole('heading', { name: '근처 미션' })).toBeVisible()
    
    // Check tab navigation
    const tabBar = page.locator('.tab-bar')
    await expect(tabBar).toBeVisible()
    
    // Test tab navigation
    await page.click('text=지도')
    await expect(page).toHaveURL(/\/creator\/map/)
    
    await page.click('text=캡처')
    await expect(page).toHaveURL(/\/creator\/capture/)
    
    await page.click('text=지갑')
    await expect(page).toHaveURL(/\/creator\/wallet/)
    
    await page.click('text=프로필')
    await expect(page).toHaveURL(/\/creator\/me/)
    
    // Return to home
    await page.click('text=미션')
    await expect(page).toHaveURL(/\/creator\/home/)
  })

  test('should show mission cards with proper information', async ({ page }) => {
    await page.goto('/creator/home')
    
    // Wait for missions to load (either real data or mock)
    await page.waitForSelector('.mission-card', { timeout: 5000 })
    
    // Check first mission card
    const firstMission = page.locator('.mission-card').first()
    await expect(firstMission).toBeVisible()
    
    // Should have merchant name
    await expect(firstMission.locator('h3')).toBeVisible()
    
    // Should have budget display
    await expect(firstMission.locator('text=/₩[\d,]+/')).toBeVisible()
    
    // Should have action buttons
    await expect(firstMission.locator('button:has-text("상세보기")')).toBeVisible()
    await expect(firstMission.locator('button:has-text("미션 수락")')).toBeVisible()
  })

  test('should handle mission acceptance flow', async ({ page }) => {
    await page.goto('/creator/home')
    
    // Wait for missions to load
    await page.waitForSelector('.mission-card', { timeout: 5000 })
    
    // Click accept on first mission
    const acceptButton = page.locator('.mission-card button:has-text("미션 수락")').first()
    
    // Mock the API response if needed
    await page.route('**/v1/assignments/create', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ id: 1, mission_id: 1, creator_id: 1, state: 'assigned' })
      })
    })
    
    await page.route('**/v1/assignments/accept', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Assignment accepted', assignment_id: 1 })
      })
    })
    
    await acceptButton.click()
    
    // Should show success message (alert or notification)
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('미션을 수락했습니다')
      await dialog.accept()
    })
  })

  test('should access capture page and show camera interface', async ({ page }) => {
    await page.goto('/creator/capture')
    
    // Check for capture guide
    await expect(page.locator('text=촬영 가이드')).toBeVisible()
    
    // Check for instructions
    await expect(page.locator('text=#광고')).toBeVisible()
    await expect(page.locator('text=15초 이내')).toBeVisible()
    
    // Check for record button (may not work without camera permissions)
    const recordButton = page.locator('button svg[data-testid="VideoCameraIcon"]').first()
    await expect(recordButton).toBeVisible()
  })

  test('should access wallet page and show status', async ({ page }) => {
    await page.goto('/creator/wallet')
    
    // Should have wallet interface
    await expect(page.locator('text=/지갑|wallet|총 수익|결제/i')).toBeVisible()
    
    // Mock API response for wallet data
    await page.route('**/api/payout/recent*', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          payments: [],
          summary: {
            total_earned_krw: 0,
            pending_amount_krw: 0,
            payment_count: 0,
            instant_payment_rate: 0
          }
        })
      })
    })
    
    await page.reload()
  })

  test('should handle offline functionality', async ({ page }) => {
    await page.goto('/creator/home')
    
    // Test offline detection
    await page.evaluate(() => {
      // Simulate offline
      Object.defineProperty(navigator, 'onLine', {
        writable: true,
        value: false
      })
      window.dispatchEvent(new Event('offline'))
    })
    
    // Page should still be functional
    await expect(page.locator('.tab-bar')).toBeVisible()
  })

  test('should be mobile-responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/creator/home')
    
    // Check mobile layout
    await expect(page.locator('.tab-bar')).toBeVisible()
    
    // Check that content fits in viewport
    const tabBar = page.locator('.tab-bar')
    const boundingBox = await tabBar.boundingBox()
    expect(boundingBox?.width).toBeLessThanOrEqual(375)
    
    // Test tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()
    await expect(page.locator('.tab-bar')).toBeVisible()
  })

  test('should maintain performance standards', async ({ page }) => {
    // Navigate to home page
    await page.goto('/creator/home')
    
    // Measure page load performance
    const performanceEntries = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      return {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: 0 // Would need more sophisticated measurement
      }
    })
    
    // Basic performance assertions
    expect(performanceEntries.domContentLoaded).toBeLessThan(3000) // 3 second max
    
    // Check that critical UI elements load quickly
    const startTime = Date.now()
    await expect(page.locator('.tab-bar')).toBeVisible()
    const tabBarLoadTime = Date.now() - startTime
    expect(tabBarLoadTime).toBeLessThan(1000) // 1 second max for critical UI
  })
})