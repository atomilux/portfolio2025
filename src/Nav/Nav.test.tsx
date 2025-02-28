import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Nav from './Nav';
import { PortfolioContext } from '../Data/DataProvider';
import { EVT_ENUM } from '../Data/Models';

// Mock the event emitter (ee)
const mockEe = {
  delay1000: vi.fn((callback) => setTimeout(callback, 0)), // Immediate for testing
  delay500: vi.fn((callback) => setTimeout(callback, 0)),
  on: vi.fn(),
};

// Mock PortfolioContext values
const mockPortfolioContext = {
  ee: mockEe,
  global_skills_roles: [
    { key: 'skills_marketing', title: 'Marketing' },
    { key: 'skills_uiux', title: 'UI/UX' },
    { key: 'skills_webDev', title: 'Web Dev' },
    { key: 'skills_gameDev', title: 'Game Dev' },
  ],
  anim_sequence_subnav_click: vi.fn(),
  global_set_content_3d_translateZ: vi.fn(),
  global_nav_isOpen: false,
  global_set_nav_isOpen: vi.fn(),
  global_skills_role_current: { key: 'skills_marketing' },
  ctrl_set_global_role_skillsData: vi.fn(),
  ctrl_set_global_role_skillsRanked: vi.fn(),
  global_ui_nav_classMap: {
    skills_marketing: 'nav_marketing',
    skills_uiux: 'nav_uiux',
    skills_webDev: 'nav_webDev',
    skills_gameDev: 'nav_gameDev',
  },
  ctrl_portfolio_filter_byRole: vi.fn(),
};

describe('Nav Component', () => {
	
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.innerWidth for responsive behavior
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 800, // Default laptop size
    });
  });

  // Helper to render with context
  const renderNavWithContext = (overrideContext = {}) => {
    return render(
      <PortfolioContext.Provider value={{ ...mockPortfolioContext, ...overrideContext }}>
        <Nav />
      </PortfolioContext.Provider>
    );
  };

  it('renders nav items correctly', () => {
    renderNavWithContext();

    expect(screen.getByText('AS A SENIOR LEVEL:')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('UI/UX')).toBeInTheDocument();
    expect(screen.getByText('Web Dev')).toBeInTheDocument();
    expect(screen.getByText('Game Dev')).toBeInTheDocument();
  });

	

  it('triggers context updates and toggles classes on nav item click', async () => {
    renderNavWithContext();

    const uiuxItem = screen.getByText('UI/UX');
    fireEvent.click(uiuxItem);

    // Verify context updates
    expect(mockPortfolioContext.global_set_nav_isOpen).toHaveBeenCalledWith(true); // !false
    expect(mockPortfolioContext.ctrl_set_global_role_skillsData).toHaveBeenCalledWith('skills_uiux');
    expect(mockPortfolioContext.ctrl_set_global_role_skillsRanked).toHaveBeenCalledWith('skills_uiux');
    expect(mockPortfolioContext.ctrl_portfolio_filter_byRole).toHaveBeenCalledWith('skills_uiux');

    // Check class updates
    await waitFor(() => {
      const navContainer = screen.getByText('AS A SENIOR LEVEL:').closest('.nav');
      expect(navContainer).toHaveClass('nav_uiux'); // Style swap via local_nav_skillset_navStyling
      expect(uiuxItem).toHaveClass('nav_role_item_active'); // Bold via ui_bold_nav
    });

    // Verify animation call (different item clicked)
    expect(mockPortfolioContext.anim_sequence_subnav_click).toHaveBeenCalled();
  });



  it('handles same item click with nav open and triggers animation', async () => {
    renderNavWithContext({ global_nav_isOpen: true, global_skills_role_current: { key: 'skills_uiux' } });

    const uiuxItem = screen.getByText('UI/UX');
    fireEvent.click(uiuxItem);

    expect(mockPortfolioContext.global_set_nav_isOpen).toHaveBeenCalledWith(false); // !true
    expect(mockPortfolioContext.anim_sequence_subnav_click).toHaveBeenCalled(); // Same item, nav open
  });



  it('updates state on initial load', async () => {
    renderNavWithContext();

    // Wait for useEffect with mocked delay
    await waitFor(() => {
      expect(mockPortfolioContext.ee.delay1000).toHaveBeenCalled();
      //expect(mockPortfolioContext.global_set_content_3d_translateZ).toHaveBeenCalledWith(320); // 800 * 0.4
      expect(mockPortfolioContext.ctrl_set_global_role_skillsRanked).toHaveBeenCalledWith('skills_marketing');
    }, { timeout: 100 });
  });



  it('responds to window resize event with state updates', async () => {
    renderNavWithContext({ global_nav_isOpen: true });

    // Simulate WINDOW_RESIZE event
    const resizeHandler = mockEe.on.mock.calls.find(([event]) => event === EVT_ENUM.WINDOW_RESIZE)[1];
    window.innerWidth = 600;
    resizeHandler();

    // Verify nested delays and state updates
    await waitFor(() => {
      expect(mockPortfolioContext.ee.delay1000).toHaveBeenCalled();
      expect(mockPortfolioContext.ee.delay500).toHaveBeenNthCalledWith(1, expect.any(Function));
      expect(mockPortfolioContext.ee.delay500).toHaveBeenNthCalledWith(2, expect.any(Function));
      //expect(mockPortfolioContext.global_set_content_3d_translateZ).toHaveBeenCalledWith(240); // 600 * 0.4
    }, { timeout: 100 });
  });
});