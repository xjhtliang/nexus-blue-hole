import { test, expect } from '@playwright/test';

test.describe('Core User Journey', () => {
  test('should load dashboard and navigate', async ({ page }) => {
    // 1. Visit Home
    await page.goto('/');
    
    // 2. Check Redirect to Dashboard
    await expect(page).toHaveURL(/.*\/dashboard/);
    await expect(page.getByText('欢迎回来, 架构师')).toBeVisible();

    // 3. Verify KPI Cards
    await expect(page.getByText('季度目标达成率')).toBeVisible();
    await expect(page.getByText('本月净收入')).toBeVisible();

    // 4. Navigate to Tasks (Tools)
    await page.click('text=神经元 (工具)');
    await page.click('text=任务清单');
    await expect(page).toHaveURL(/.*\/tools\/tasks/);
    
    // 5. Interact with Task Board
    await expect(page.getByText('Task Master')).toBeVisible();
    // Check if tasks are rendered
    const taskCards = await page.locator('.bg-card').count();
    expect(taskCards).toBeGreaterThan(0);
  });

  test('should open and close global search', async ({ page }) => {
    await page.goto('/');
    
    // Open Search via click
    await page.click('text=Search...');
    await expect(page.getByPlaceholderText('Search anything...')).toBeVisible();

    // Type query
    await page.fill('input[placeholder="Search anything..."]', 'Task');
    // Expect some results (mocked or static in this env)
    
    // Close via Esc (Simulate)
    await page.keyboard.press('Escape');
    // Ensure modal is gone (might need specific selector for window)
  });
});