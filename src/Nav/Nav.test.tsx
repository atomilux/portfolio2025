import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Nav from './Nav';
import { PortfolioContext } from '../Data/DataProvider';
import { EVT_ENUM, Portfolio_item_link } from '../Data/Models';
import { useState } from 'react';

// Mock EventEmitter
const mockEe = {
  delay1000: vi.fn((callback) => { callback(); return Promise.resolve(); }),
  delay500: vi.fn((callback) => { callback(); return Promise.resolve(); }),
  on: vi.fn(),
  emit: vi.fn(),
};

// Mock PortfolioContext base values
const basePortfolioContext = {
  ee: mockEe,
  global_set_content_3d_translateZ: vi.fn(),
  global_nav_isOpen: false,
  global_set_nav_isOpen: vi.fn(),
  global_skills_roles: [
    { key: 'skills_marketing', title: 'Marketing', desc: '', skill_labels: '', skill_keys: '', resume: '' },
    { key: 'skills_uiux', title: 'UI/UX', desc: '', skill_labels: '', skill_keys: '', resume: '' },
    { key: 'skills_webDev', title: 'Web Dev', desc: '', skill_labels: '', skill_keys: '', resume: '' },
    { key: 'skills_gameDev', title: 'Game Dev', desc: '', skill_labels: '', skill_keys: '', resume: '' },
  ],
  global_portfolio_item_current: {
    id: 0,
    title: '',
    objective: '',
    solution: [''],
    skillset: '',
    images: [''],
    links: [new Portfolio_item_link()],
  },
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
  anim_sequence_subnav_click: vi.fn(),
};

const TestProvider = ({ children, overrideContext = {} }) => {
  const [context, setContext] = useState({ ...basePortfolioContext, ...overrideContext });
  const ctrl_set_global_role_skillsData = (role) => {
    setContext((prev) => {
      const newContext = {
        ...prev,
        global_skills_role_current: prev.global_skills_roles.find(item => item.key === role) || prev.global_skills_role_current,
      };
      console.log('Updated global_skills_role_current:', newContext.global_skills_role_current);
      return newContext;
    });
    basePortfolioContext.ctrl_set_global_role_skillsData(role);
  };
  return (
    <PortfolioContext.Provider value={{ ...context, ctrl_set_global_role_skillsData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

describe('Nav Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 800 });
    Object.defineProperty(window, 'outerWidth', { writable: true, configurable: true, value: 800 });
  });

  const renderNavWithContext = (overrideContext = {}) => {
    return render(<TestProvider overrideContext={overrideContext}><Nav /></TestProvider>);
  };

  it('triggers context updates and toggles classes on nav item click', async () => {
    renderNavWithContext();

    const uiuxItem = screen.getByText('UI/UX');
    console.log('Before click - UI/UX classes:', uiuxItem.className);
    fireEvent.click(uiuxItem);

    expect(basePortfolioContext.global_set_nav_isOpen).toHaveBeenCalledWith(true);
    expect(basePortfolioContext.ctrl_set_global_role_skillsData).toHaveBeenCalledWith('skills_uiux');
    expect(basePortfolioContext.ctrl_set_global_role_skillsRanked).toHaveBeenCalledWith('skills_uiux');
    expect(basePortfolioContext.ctrl_portfolio_filter_byRole).toHaveBeenCalledWith('skills_uiux');
    expect(basePortfolioContext.anim_sequence_subnav_click).toHaveBeenCalled();

    await waitFor(() => {
      const navContainer = screen.getByText('AS A SENIOR LEVEL:').closest('.nav');
      expect(navContainer).toHaveClass('nav_uiux');
      const updatedUiuxItem = screen.getByText('UI/UX'); // Re-query to get fresh DOM
      console.log('After click - UI/UX classes:', updatedUiuxItem.className);
      expect(updatedUiuxItem).toHaveClass('nav_role_item_active');
    }, { timeout: 1000 }); // Increased timeout for debugging
  });
});