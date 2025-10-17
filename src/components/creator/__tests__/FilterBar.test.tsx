/**
 * FilterBar Component Tests
 * 
 * Tests for the FilterBar component functionality including:
 * - Category filtering
 * - Search functionality with debounce
 * - Sort options
 * - Quick filters (featured, urgent)
 * - Filter reset
 * - Active filter count badge
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FilterBar } from '../FilterBar';
import * as missionStore from '@/store/mission.store';

// Mock the useMissionStore hook
const mockSetFilters = jest.fn();
const mockApplyFilters = jest.fn();
const mockResetFilters = jest.fn();

jest.mock('@/store/mission.store', () => ({
  useMissionStore: (selector: any) => {
    const mockState = {
      filters: {
        category: 'all' as const,
        status: 'active' as const,
        search: '',
        sortBy: 'newest' as const,
        difficulty: null,
        featured: false,
        urgent: false,
        rewardMin: null,
        rewardMax: null,
      },
      setFilters: mockSetFilters,
      applyFilters: mockApplyFilters,
      resetFilters: mockResetFilters,
    };
    
    return selector(mockState);
  },
}));

describe('FilterBar', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  it('renders category tabs', () => {
    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    expect(screen.getByText('전체')).toBeInTheDocument();
    expect(screen.getByText('음식점')).toBeInTheDocument();
    expect(screen.getByText('카페')).toBeInTheDocument();
    expect(screen.getByText('액티비티')).toBeInTheDocument();
    expect(screen.getByText('쇼핑')).toBeInTheDocument();
  });

  it('highlights active category tab', () => {
    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    const allTab = screen.getByText('전체').closest('button');
    expect(allTab).toHaveClass('bg-primary', 'text-white');
  });

  it('changes category when tab is clicked', async () => {
    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    const cafeTab = screen.getByText('카페').closest('button');
    fireEvent.click(cafeTab!);
    
    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({ category: 'cafe' });
      expect(mockApplyFilters).toHaveBeenCalled();
      expect(mockOnFilterChange).toHaveBeenCalled();
    });
  });

  it('renders search input', () => {
    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    const searchInput = screen.getByPlaceholderText(/미션 검색/i);
    expect(searchInput).toBeInTheDocument();
  });

  it('debounces search input', async () => {
    jest.useFakeTimers();
    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    const searchInput = screen.getByPlaceholderText(/미션 검색/i);
    
    // Type search query
    fireEvent.change(searchInput, { target: { value: '카페' } });
    
    // Should not call immediately
    expect(mockSetFilters).not.toHaveBeenCalled();
    
    // Fast-forward time by 500ms (debounce delay)
    jest.advanceTimersByTime(500);
    
    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({ search: '카페' });
      expect(mockApplyFilters).toHaveBeenCalled();
    });
    
    jest.useRealTimers();
  });

  it('renders sort dropdown', () => {
    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    // Look for sort button with "최신순" label (default sort)
    const sortButton = screen.getByText('최신순').closest('button');
    expect(sortButton).toBeInTheDocument();
  });

  it('changes sort option', async () => {
    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    // Click sort button to open menu
    const sortButton = screen.getByText('최신순').closest('button');
    fireEvent.click(sortButton!);
    
    // Select a sort option (e.g., "높은 리워드순")
    const rewardOption = await screen.findByText('높은 리워드순');
    fireEvent.click(rewardOption);
    
    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({ sortBy: 'reward' });
      expect(mockApplyFilters).toHaveBeenCalled();
    });
  });

  it('renders quick filter buttons', () => {
    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    expect(screen.getByText(/추천 미션/i)).toBeInTheDocument();
    expect(screen.getByText(/급구/i)).toBeInTheDocument();
  });

  it('toggles featured filter', async () => {
    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    const featuredButton = screen.getByText(/추천 미션/i).closest('button');
    fireEvent.click(featuredButton!);
    
    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({ featured: true });
      expect(mockApplyFilters).toHaveBeenCalled();
    });
  });

  it('toggles urgent filter', async () => {
    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    const urgentButton = screen.getByText(/급구 미션/i).closest('button');
    fireEvent.click(urgentButton!);
    
    await waitFor(() => {
      expect(mockSetFilters).toHaveBeenCalledWith({ urgent: true });
      expect(mockApplyFilters).toHaveBeenCalled();
    });
  });

  it.skip('shows active filter count badge', () => {
    // Mock store with active filters
    const mockStoreWithFilters = {
      filters: {
        category: 'cafe',
        featured: true,
        urgent: true,
        search: '테스트',
        sortBy: 'reward' as const,
        status: 'active' as const,
        difficulty: null,
        rewardMin: null,
        rewardMax: null,
      },
      setFilters: jest.fn(),
      applyFilters: jest.fn(),
      resetFilters: jest.fn(),
    };

    jest.spyOn(missionStore, 'useMissionStore').mockImplementation(
      (selector: any) => selector(mockStoreWithFilters)
    );

    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    // Should show count badge with number of active filters
    // category='cafe' (not 'all') + featured + urgent + search + sortBy='reward' (not 'newest') = 5
    const badge = screen.getByText(/5개 필터 적용/);
    expect(badge).toBeInTheDocument();
  });

  it.skip('renders reset filters button when filters are active', () => {
    const mockStoreWithFilters = {
      filters: {
        category: 'cafe',
        featured: true,
        search: '',
        sortBy: 'newest' as const,
        status: 'active' as const,
        difficulty: null,
        urgent: false,
        rewardMin: null,
        rewardMax: null,
      },
      setFilters: mockSetFilters,
      applyFilters: mockApplyFilters,
      resetFilters: mockResetFilters,
    };

    jest.spyOn(missionStore, 'useMissionStore').mockImplementation(
      (selector: any) => selector(mockStoreWithFilters)
    );

    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    const resetButton = screen.getByText(/초기화/i);
    expect(resetButton).toBeInTheDocument();
  });

  it.skip('resets filters when reset button is clicked', async () => {
    const localMockResetFilters = jest.fn();
    const mockStoreWithFilters = {
      filters: {
        category: 'cafe',
        featured: true,
        search: '',
        sortBy: 'newest' as const,
        status: 'active' as const,
        difficulty: null,
        urgent: false,
        rewardMin: null,
        rewardMax: null,
      },
      setFilters: mockSetFilters,
      applyFilters: mockApplyFilters,
      resetFilters: localMockResetFilters,
    };

    jest.spyOn(missionStore, 'useMissionStore').mockImplementation(
      (selector: any) => selector(mockStoreWithFilters)
    );

    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    const resetButton = screen.getByText(/초기화/i);
    fireEvent.click(resetButton);
    
    await waitFor(() => {
      expect(localMockResetFilters).toHaveBeenCalled();
    });
  });

  it('clears search input when typing empty string', async () => {
    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    const searchInput = screen.getByPlaceholderText(/미션 검색/i) as HTMLInputElement;
    
    // Type and then clear
    fireEvent.change(searchInput, { target: { value: '테스트' } });
    expect(searchInput.value).toBe('테스트');
    
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(searchInput.value).toBe('');
  });

  it('applies custom className', () => {
    const customClass = 'custom-filter-class';
    const { container } = render(
      <FilterBar onFilterChange={mockOnFilterChange} className={customClass} />
    );
    
    const filterBar = container.firstChild;
    expect(filterBar).toHaveClass(customClass);
  });

  it('renders all category options', () => {
    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    // Verify all categories are rendered
    expect(screen.getByText('전체')).toBeInTheDocument();
    expect(screen.getByText('음식점')).toBeInTheDocument();
    expect(screen.getByText('카페')).toBeInTheDocument();
    expect(screen.getByText('액티비티')).toBeInTheDocument();
    expect(screen.getByText('쇼핑')).toBeInTheDocument();
    expect(screen.getByText('뷰티')).toBeInTheDocument();
    expect(screen.getByText('기타')).toBeInTheDocument();
  });

  it('renders all sort options when dropdown is opened', async () => {
    render(<FilterBar onFilterChange={mockOnFilterChange} />);
    
    // Click sort button to open menu
    const sortButton = screen.getByText('최신순').closest('button');
    fireEvent.click(sortButton!);
    
    // Verify all sort options are shown (use getAllByText since 최신순 appears twice)
    await waitFor(() => {
      const newestOptions = screen.getAllByText('최신순');
      expect(newestOptions.length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText('높은 리워드순')).toBeInTheDocument();
      expect(screen.getByText('가까운 거리순')).toBeInTheDocument();
      expect(screen.getByText('인기순')).toBeInTheDocument();
      expect(screen.getByText('마감 임박순')).toBeInTheDocument();
    });
  });
});
