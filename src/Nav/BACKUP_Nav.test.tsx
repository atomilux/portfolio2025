import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Nav from './Nav';
import { PortfolioContext } from '../Data/DataProvider';
import { EVT_ENUM, Portfolio_item_link } from '../Data/Models';
import EventEmitter from '../EVENTS/EventEmitter'

// Mock the event emitter (ee)
/*
const mockEe = {
  delay1000: vi.fn((callback) => setTimeout(callback, 0)), // Immediate for testing
  delay500: vi.fn((callback) => setTimeout(callback, 0)),
  on: vi.fn(),
};
*/

const mockEe = new EventEmitter()

// Mock PortfolioContext values
const mockPortfolioContext = {
  ee: mockEe,
  ctrl_set_rotateY: vi.fn(),
  global_set_portfolio_mode: vi.fn(),
  ctrl_global_set_portfolio_item_current: vi.fn(),
  ctrl_skillsRated_get_byPortfolioID: vi.fn(),
  global_portfolio_filtered: [],
  global_portfolio_item_current: {
    id: 0,
    title: '',
    objective: '',
    solution: [''],
    skillset: '',
    images: [''],
    links: [new Portfolio_item_link()]
  },
  global_portfolio_item_mode: 'grid',
  global_set_portfolio_filtered: vi.fn(),
  global_set_portfolio_item_current: vi.fn(),
  global_set_portfolio_item_mode: vi.fn(),
  global_set_skillset_opacity: vi.fn(),
  global_set_skillset_scale: vi.fn(),
  global_skillset_opacity: 1,
  global_skillset_scale: 1,
  global_portfolio_mode: 'grid',
  global_portfolio: [],
  global_portfolio_active: null,
  global_portfolio_filter: '',
  global_portfolio_sort: '',
  global_portfolio_page: 1,
  global_portfolio_perPage: 10,
  global_portfolio_total: 0,
  global_portfolio_loading: false,
  global_role_skillsRanked_all: [],
  global_role_skillsRanked: [],
  global_skills_role_current_skills: [],
  global_role_skillsData: [],
  global_role_skillsData_all: [],
  global_role_skills_max: 0,
  global_role_skills_min: 0,
  global_role_skills_avg: 0,
  global_role_skills_range: 0,
  global_role_skills_interval: 0,
  global_role_skills_categories: [],
  global_role_skills_categories_all: [],
  global_role_skills_categories_current: [],
  ctrl_set_role_skills_stats: vi.fn(),
  ctrl_set_role_skills_categories: vi.fn(),
  global_skills_roles: [
    { key: 'skills_marketing', title: 'Marketing', desc: '', skill_labels: '', skill_keys: '', resume: '' },
    { key: 'skills_uiux', title: 'UI/UX', desc: '', skill_labels: '', skill_keys: '', resume: '' },
    { key: 'skills_webDev', title: 'Web Dev', desc: '', skill_labels: '', skill_keys: '', resume: '' },
    { key: 'skills_gameDev', title: 'Game Dev', desc: '', skill_labels: '', skill_keys: '', resume: '' },
  ],
  anim_sequence_subnav_click: vi.fn(),
  global_set_content_3d_translateZ: vi.fn(),
  global_nav_isOpen: false,
  global_set_nav_isOpen: vi.fn(),
  global_skills_role_current: { key: 'skills_marketing', title: 'Marketing', desc: '', skill_labels: '', skill_keys: '', resume: '' },
  ctrl_set_global_role_skillsData: vi.fn(),
  ctrl_set_global_role_skillsRanked: vi.fn(),
  global_ui_nav_classMap: {
    skills_marketing: 'nav_marketing',
    skills_uiux: 'nav_uiux',
    skills_webDev: 'nav_webDev',
    skills_gameDev: 'nav_gameDev',
  },
  ctrl_portfolio_filter_byRole: vi.fn(),
  global_nav_openHeight: 0,
  global_subnav_opacity: 1,
  global_subnav_scale: 1,
  global_content_overview_rotateY: 0,
  global_content_3d_translateZ: 0,
  global_content_3d_rotateX: 0,
  global_content_3d_scaleY: 1,
  global_content_3d_perspective: 1000,
  global_debug: false,
  global_nav_title: '',
  global_nav_skills_data: [],
  global_nav_skills_ranked: [],
  global_nav_role_active: '',
  global_portfolio_items: [],
  global_portfolio_items_filtered: [],
  global_content_skillset_rotateY: 0,
  global_content_portfolio_rotateY: 0,
  global_set_nav_openHeight: vi.fn(),
  global_set_ui_nav_classMap: vi.fn(),
  global_set_subnav_opacity: vi.fn(),
  global_set_subnav_scale: vi.fn(),
  global_set_content_overview_rotateY: vi.fn(),
  global_set_content_skillset_rotateY: vi.fn(),
  global_set_content_portfolio_rotateY: vi.fn(),
  global_set_content_3d_rotateX: vi.fn(),
  global_set_content_3d_scaleY: vi.fn(),
  global_set_content_3d_perspective: vi.fn(),
  global_set_nav_role_active: vi.fn(),
  global_set_nav_skills_data: vi.fn(),
  global_set_nav_skills_ranked: vi.fn(),
  global_set_portfolio_items: vi.fn(),
  global_set_portfolio_items_filtered: vi.fn(),
  global_set_skills_role_current: vi.fn(),
  global_set_nav_title: vi.fn(),
  global_set_debug: vi.fn()
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
		vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
			height: 100, // Non-zero to bypass early return
			width: 800,
			top: 0,
			left: 0,
			bottom: 0,
			right: 0,
			x: 0,
			y: 0,
			toJSON: function () {
				throw new Error('Function not implemented.');
			}
		});
	
		renderNavWithContext();
	
		await waitFor(() => {
			expect(mockPortfolioContext.ee.delay1000).toHaveBeenCalled();
			expect(mockPortfolioContext.ctrl_set_global_role_skillsRanked).toHaveBeenCalledWith('skills_marketing');
		}, { timeout: 100 });
	
		vi.restoreAllMocks();
	});



  it('responds to window resize event with state updates', async () => {
    renderNavWithContext({ global_nav_isOpen: true });

    // Simulate WINDOW_RESIZE event
    const foundCall = mockEe.on.mock.calls.find(([event]) => event === EVT_ENUM.WINDOW_RESIZE);
    const resizeHandler = foundCall ? foundCall[1] : () => {};
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