import { render, screen, waitFor } from '@testing-library/react';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Content_SkillOverview from './Content_SkillOverview';
import { PortfolioContext } from '../Data/DataProvider';

const mockContextValue = {
  global_content_3d_translateZ: 0,
  global_content_overview_rotateY: 0,
  global_skillset_opacity: 1,
  global_skillset_scale: 1,
  global_skills_role_current: {
    key: 'skills_webDev',
    desc: 'Web Development Skills Description'
  },
  global_role_skillsRanked: [
    { title: 'JavaScript', category: 'programming', strength: 80 }
  ],
  global_nav_openHeight: 100
};

describe('Content_SkillOverview', () => {
  const renderWithContext = (contextValue = mockContextValue) => {
    return render(
      <PortfolioContext.Provider value={contextValue}>
        <Content_SkillOverview />
      </PortfolioContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders component with context values', () => {
    renderWithContext();
    expect(screen.getByText('Web Development Skills Description')).toBeInTheDocument();
    expect(screen.getByText('Web Development Resume')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', './resumes/resume_SteveLux_UnityDev_2023.pdf');
  });

  it('applies correct styles from context', () => {
    renderWithContext();
    const overviewDiv = screen.getByTestId('skillset-overview');
    expect(overviewDiv).toHaveStyle({
      opacity: '1',
      transform: 'rotateY(0deg) translateZ(0px)'
    });
  });

  it('updates resume link and label when role changes', async () => {
    const { rerender } = renderWithContext();
    
    const updatedContext = {
      ...mockContextValue,
      global_skills_role_current: {
        key: 'skills_marketing',
        desc: 'Marketing Skills Description'
      }
    };

    rerender(
      <PortfolioContext.Provider value={updatedContext}>
        <Content_SkillOverview />
      </PortfolioContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Marketing Skills Description')).toBeInTheDocument();
      expect(screen.getByText('Marketing Resume')).toBeInTheDocument();
      expect(screen.getByRole('link')).toHaveAttribute('href', './resumes/resume_SteveLux_Marketing_2024.pdf');
    });
  });

  it('handles different role keys correctly', () => {
    const uiuxContext = {
      ...mockContextValue,
      global_skills_role_current: {
        key: 'skills_uiux',
        desc: 'UI/UX Skills Description'
      }
    };
    
    renderWithContext(uiuxContext);
    
    expect(screen.getByText('UI/UX Skills Description')).toBeInTheDocument();
    expect(screen.getByText('UI/UX Resume')).toBeInTheDocument();
    expect(screen.getByRole('link')).toHaveAttribute('href', './resumes/resume_SteveLux_UIUX_2023.pdf');
  });

  it('updates styles when context values change', async () => {
    const { rerender } = renderWithContext();
    
    const updatedContext = {
      ...mockContextValue,
      global_content_overview_rotateY: 180,
      global_skillset_opacity: 0.7
    };

    rerender(
      <PortfolioContext.Provider value={updatedContext}>
        <Content_SkillOverview />
      </PortfolioContext.Provider>
    );

    const overviewDiv = screen.getByTestId('skillset-overview');

    await waitFor(() => {
      expect(overviewDiv).toHaveStyle({
        opacity: '0.7',
        transform: 'rotateY(180deg) translateZ(0px)'
      });
    });
  });

  it('renders image with correct source', () => {
    renderWithContext();
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', './images/icon_acrobat.svg');
    expect(img).toHaveClass('acrobat_icon');
  });
});