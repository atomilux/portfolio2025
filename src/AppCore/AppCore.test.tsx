// src/AppCore/AppCore.test.tsx
import { render, screen, act } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'; // Add beforeEach, afterEach
import AppCore from './AppCore';
import { PortfolioContext } from '../Data/DataProvider';

// Mock child components
vi.mock('../Nav/Nav', () => ({
  default: () => <div data-testid="mock-nav">Nav Mock</div>,
}));
vi.mock('../SubNav/SubNav', () => ({
  default: () => <div data-testid="mock-subnav">SubNav Mock</div>,
}));
vi.mock('../Content_SkillOverview/Content_SkillOverview', () => ({
  default: () => <div>SkillOverview Mock</div>,
}));
vi.mock('../Content_Skillset/Content_Skillset', () => ({
  default: () => <div>Skillset Mock</div>,
}));
vi.mock('../Content_PortfolioCollection/Content_PortfolioCollection', () => ({
  default: () => <div>PortfolioCollection Mock</div>,
}));
vi.mock('../Content_PortfolioDetail/Content_PortfolioDetail', () => ({
  default: () => <div>PortfolioDetail Mock</div>,
}));

// Mock the SVG import
vi.mock('../assets/logo_stevelux_logotype_940x150.svg', () => ({
  default: 'mocked-logo.svg',
}));

// Mock the EventEmitter from PortfolioContext
const mockEmit = vi.fn();
const mockOn = vi.fn();
const mockEe = { emit: mockEmit, on: mockOn };

// Mock window properties
beforeEach(() => {
  window.outerWidth = 1000;
  window.port_isAwaiting_resize_timeout = false;
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
});

describe('AppCore Component', () => {
	
  const renderAppCore = () =>
    render(
      <PortfolioContext.Provider value={{ ee: mockEe }}>
        <AppCore />
      </PortfolioContext.Provider>
    );

  test('renders child components and logo', () => {
    renderAppCore();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'mocked-logo.svg');
    expect(screen.getByTestId('mock-nav')).toBeInTheDocument();
    expect(screen.getByTestId('mock-subnav')).toBeInTheDocument();
    expect(screen.getByText('SkillOverview Mock')).toBeInTheDocument();
    expect(screen.getByText('Skillset Mock')).toBeInTheDocument();
    expect(screen.getByText('PortfolioCollection Mock')).toBeInTheDocument();
    expect(screen.getByText('PortfolioDetail Mock')).toBeInTheDocument();
  });

  test('sets initial content width and left based on window.outerWidth', () => {
    renderAppCore();
    const pageContent = document.querySelector('.page_content');
    expect(pageContent).toHaveStyle('width: 750px');
    expect(pageContent).toHaveStyle('left: 125px');
  });

  test('handles window resize event and updates dimensions', () => {
    renderAppCore();
    act(() => {
      window.outerWidth = 800;
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(500);
    });
    const pageContent = document.querySelector('.page_content');
    expect(pageContent).toHaveStyle('width: 750px');
    expect(pageContent).toHaveStyle('left: 125px');
    expect(mockEmit).toHaveBeenCalledWith('WINDOW_RESIZE', { source: 'AppCore' });
  });

  test('debounces resize events', () => {
    renderAppCore();
    act(() => {
      window.outerWidth = 800;
      window.dispatchEvent(new Event('resize'));
      window.dispatchEvent(new Event('resize'));
      vi.advanceTimersByTime(250);
    });
    const pageContent = document.querySelector('.page_content');
    expect(pageContent).toHaveStyle('width: 750px');
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(pageContent).toHaveStyle('width: 750px');
    expect(mockEmit).toHaveBeenCalledTimes(1);
  });
});