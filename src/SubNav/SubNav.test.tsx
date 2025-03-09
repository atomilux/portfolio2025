import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import SubNav from './SubNav';
import { PortfolioContext } from '../Data/DataProvider';
import { EVT_ENUM } from '../Data/Models';

// Mock DOM methods for getBoundingClientRect
const mockRect = (left, width = 100) => ({
  left,
  top: 0,
  right: left + width,
  bottom: 0,
  width,
  height: 0,
  x: left,
  y: 0,
  toJSON: () => {}
});

const mockContextValue = {
  ee: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
  ctrl_set_rotateY: vi.fn(),
  global_subnav_opacity: 1,
  global_subnav_scale: 1,
  global_skills_role_current: { key: 'skills_webDev' },
  global_portfolio_mode: 'overview',
  global_set_portfolio_mode: vi.fn()
};

// Force mock override before all tests
beforeAll(() => {
  Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
    configurable: true,
    writable: true,
    value: vi.fn((el) => {
      if (!el || typeof el.className !== 'string' || typeof el.textContent !== 'string') return mockRect(0);
      if (el.className.includes('subnav_title subnav_active')) return mockRect(0);
      if (el.textContent === 'OVERVIEW') return mockRect(0);
      if (el.textContent === 'SKILLSET') return mockRect(100);
      if (el.textContent === 'PORTFOLIO') return mockRect(200);
      if (el.className.includes('subnav_stick_row')) return mockRect(0, 300);
      return mockRect(0);
    })
  });
});

describe('SubNav', () => {
  const renderWithContext = async (contextValue = mockContextValue) => {
    const result = render(
      <PortfolioContext.Provider value={contextValue}>
        <SubNav />
      </PortfolioContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('OVERVIEW')).toBeInTheDocument();
    }, { timeout: 2000 });
    return result;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders subnav items', async () => {
    await renderWithContext();
    expect(screen.getByText('OVERVIEW')).toBeInTheDocument();
    expect(screen.getByText('SKILLSET')).toBeInTheDocument();
    expect(screen.getByText('PORTFOLIO')).toBeInTheDocument();
  });

  it('applies correct styles from context', async () => {
    await renderWithContext();
    const subnavDiv = screen.getByTestId('subnav');
    expect(subnavDiv).toHaveStyle({ opacity: '1', transform: 'scale(1)' });
  });

  it('sets active class based on portfolio mode', async () => {
    await renderWithContext();
    expect(screen.getByText('OVERVIEW')).toHaveClass('subnav_active');
    expect(screen.getByText('SKILLSET')).not.toHaveClass('subnav_active');
    expect(screen.getByText('PORTFOLIO')).not.toHaveClass('subnav_active');
  });

  it('handles overview click', async () => {
    await renderWithContext();
    const overview = screen.getByText('OVERVIEW');
    fireEvent.click(overview);
    expect(mockContextValue.global_set_portfolio_mode).toHaveBeenCalledWith('overview');
    expect(mockContextValue.ctrl_set_rotateY).toHaveBeenCalledWith('overview');
    expect(mockContextValue.ee.emit).toHaveBeenCalledWith(EVT_ENUM.SUBNAV_CLICK, { subnav: 'overview' });
  });

  it('handles skillset click', async () => {
    await renderWithContext();
    const skillset = screen.getByText('SKILLSET');
    fireEvent.click(skillset);
    expect(mockContextValue.global_set_portfolio_mode).toHaveBeenCalledWith('skillset');
    expect(mockContextValue.ctrl_set_rotateY).toHaveBeenCalledWith('skillset');
    expect(mockContextValue.ee.emit).toHaveBeenCalledWith(EVT_ENUM.SUBNAV_CLICK, { subnav: 'skillset' });
  });

  it('handles portfolio click', async () => {
    await renderWithContext();
    const portfolio = screen.getByText('PORTFOLIO');
    fireEvent.click(portfolio);
    expect(mockContextValue.global_set_portfolio_mode).toHaveBeenCalledWith('portfolio');
    expect(mockContextValue.ctrl_set_rotateY).toHaveBeenCalledWith('portfolio');
    expect(mockContextValue.ee.emit).toHaveBeenCalledWith(EVT_ENUM.SUBNAV_CLICK, { subnav: 'portfolio' });
  });

  it('moves stick based on portfolio mode', async () => {
    const contextValue = { ...mockContextValue, global_portfolio_mode: 'skillset' };
    await renderWithContext(contextValue);
    await waitFor(() => {
      const stick = screen.getByTestId('subnav-stick');
      expect(stick).toHaveStyle('left: 95px');
    }, { timeout: 2000 });
  });

  it('updates stick position on window resize', async () => {
    await renderWithContext();
    const resizeHandler = mockContextValue.ee.on.mock.calls.find(
      call => call[0] === EVT_ENUM.WINDOW_RESIZE
    )[1];
    await waitFor(() => {
      const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect;
      Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
        configurable: true,
        value: vi.fn(() => mockRect(150))
      });
      resizeHandler();
      const stick = screen.getByTestId('subnav-stick');
      expect(stick).toHaveStyle('left: 150px');
      Object.defineProperty(Element.prototype, 'getBoundingClientRect', {
        configurable: true,
        value: originalGetBoundingClientRect
      });
    }, { timeout: 2000 });
  });
});