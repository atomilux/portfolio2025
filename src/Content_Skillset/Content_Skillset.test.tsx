import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Content_Skillset from './Content_Skillset';
import { PortfolioContext } from '../Data/DataProvider';

const mockContextValue = {
  global_content_3d_translateZ: 0,
  global_content_skillset_rotateY: 0,
  global_skillset_opacity: 1,
  global_skillset_scale: 1,
  global_skills_role_current: { title: 'Developer' },
  global_role_skillsRanked: [
    { title: 'JavaScript', category: 'programming', strength: 80 },
    { title: 'React', category: 'framework', strength: 75 },
    { title: 'CSS', category: 'styling', strength: 70 }
  ],
  global_nav_openHeight: 100
};

vi.mock('lodash', () => ({
  default: {
    filter: vi.fn((arr, predicate) => arr.filter(predicate))
  }
}));

describe('Content_Skillset', () => {
  const renderWithContext = (contextValue = mockContextValue) => {
    return render(
      <PortfolioContext.Provider value={contextValue}>
        <Content_Skillset />
      </PortfolioContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('renders component with initial skills from context', () => {
    renderWithContext();
    expect(screen.getByText('Developer Skills (3)')).toBeInTheDocument();
    expect(screen.getAllByText('JavaScript')[0]).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('CSS')).toBeInTheDocument();
  });

  it('applies correct styles from context', () => {
    renderWithContext();
    const skillsetDiv = screen.getByTestId('skillset');
    expect(skillsetDiv).toHaveStyle({
      opacity: '1',
      transform: 'rotateY(0deg) translateZ(0px)'
    });
  });

  it('filters skills when searching', async () => {
    renderWithContext();
    const searchInput = screen.getByTestId('skills-search-input');
    fireEvent.change(searchInput, { target: { value: 'React' } });
    
    await waitFor(() => {
      expect(screen.getByText('React')).toBeInTheDocument();
      expect(screen.queryByText('JavaScript')).not.toBeInTheDocument();
      expect(screen.queryByText('CSS')).not.toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('renders correct number of skills based on context', () => {
    const customContext = {
      ...mockContextValue,
      global_role_skillsRanked: [
        { title: 'Python', category: 'programming', strength: 85 }
      ]
    };
    renderWithContext(customContext);
    expect(screen.getByText('Developer Skills (1)')).toBeInTheDocument();
    expect(screen.getByText('Python')).toBeInTheDocument();
  });

  it('updates when context values change', async () => {
    const { rerender } = renderWithContext();
    
    const updatedContext = {
      ...mockContextValue,
      global_content_skillset_rotateY: 90,
      global_skillset_opacity: 0.5
    };

    rerender(
      <PortfolioContext.Provider value={updatedContext}>
        <Content_Skillset />
      </PortfolioContext.Provider>
    );

    const skillsetDiv = screen.getByTestId('skillset');

    await waitFor(() => {
      expect(skillsetDiv).toHaveStyle({
        opacity: '0.5',
        transform: 'rotateY(90deg) translateZ(0px)'
      });
    }, {
      timeout: 2000,
      interval: 100
    });
  });

  it('renders skill bars with correct classes', () => {
    renderWithContext();
    const jsBars = screen.getAllByText('JavaScript');
    const jsBar = jsBars[0].nextElementSibling.firstChild;
    expect(jsBar).toHaveClass('skill_bar_horizontal_fuel');
    expect(jsBar).toHaveClass('type_programming');
    expect(jsBar).toHaveClass('bar_width80');
  });
});