import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Content_PortfolioDetail from './Content_PortfolioDetail';
import { PortfolioContext } from '../Data/DataProvider';
import { EVT_ENUM } from '../Data/Models';

const mockContextValue = {
  ee: {
    on: vi.fn(),
    emit: vi.fn()
  },
  global_portfolio_item_current: {
    id: '1',
    title: 'Test Project',
    objective: 'Test Objective',
    solution: ['Solution 1', 'Solution 2'],
    links: [
      { url: 'http://example.com', title: 'Example Link' },
      { url: 'document.pdf', title: 'PDF Document' }
    ],
    images: [
      'http://example.com/image.jpg',
      'https://vimeo.com/123456789'
    ]
  },
  ctrl_skillsRated_get_byPortfolioID: vi.fn(() => [
    { title: 'JavaScript', category: 'skills_webDev', strength: 80 },
    { title: 'Photoshop', category: 'skills_uiux', strength: 75 }
  ])
};

describe('Content_PortfolioDetail', () => {
  const renderWithContext = (contextValue = mockContextValue) => {
    return render(
      <PortfolioContext.Provider value={contextValue}>
        <Content_PortfolioDetail />
      </PortfolioContext.Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    global.window.scrollTo = vi.fn();
    document.body.style.overflow = '';
    Element.prototype.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders portfolio item details', () => {
    renderWithContext();
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Test Objective')).toBeInTheDocument();
    expect(screen.getByText('Solution 1')).toBeInTheDocument();
    expect(screen.getByText('Solution 2')).toBeInTheDocument();
  });

  it('renders links with correct icons', () => {
    renderWithContext();
    expect(screen.getByText('LINKS')).toBeInTheDocument();
    expect(screen.getByText('Example Link')).toBeInTheDocument();
    expect(screen.getByText('PDF Document')).toBeInTheDocument();
    
    // Match the actual alt text "link_icon"
    const linkIcons = screen.getAllByAltText('link_icon');
    expect(linkIcons[0]).toHaveAttribute('src', './images/icon_newWindow_256x256.svg');
    expect(linkIcons[1]).toHaveAttribute('src', './images/icon_acrobat.svg');
  });

  it('renders skills by category', () => {
    renderWithContext();
    expect(screen.getByText('Web Developer')).toBeInTheDocument();
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('UI/UX')).toBeInTheDocument();
    expect(screen.getByText('Photoshop')).toBeInTheDocument();
    
    const jsBar = screen.getByText('JavaScript').nextElementSibling.firstChild;
    expect(jsBar).toHaveClass('bar_width80');
  });

  it('renders images and videos', () => {
    renderWithContext();
    const portfolioImages = screen.getAllByAltText('portfolio item');
    expect(portfolioImages[0]).toHaveAttribute('src', 'http://example.com/image.jpg');
    
    const iframe = screen.getByTitle('vimeo-player');
    expect(iframe).toHaveAttribute('src', 'https://vimeo.com/123456789&transparent=0');
  });

  it('handles portfolio item click event', async () => {
    renderWithContext();
    const overlay = screen.getByTestId('portfolio-detail');
    
    await waitFor(() => {
      const eventHandler = mockContextValue.ee.on.mock.calls.find(
        call => call[0] === EVT_ENUM.PORTFOLIO_ITEM_CLICK
      )[1];
      eventHandler();
    });

    await waitFor(() => {
      expect(overlay).toHaveStyle('opacity: 1');
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
      expect(Element.prototype.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });
  });

  it('closes overlay when clicking title', async () => {
    renderWithContext();
    const title = screen.getByText('Test Project');
    
    await waitFor(() => {
      fireEvent.click(title);
    });
    
    await waitFor(() => {
      const overlay = screen.getByTestId('portfolio-detail');
      expect(overlay).toHaveStyle('opacity: 0');
      expect(document.body.style.overflow).toBe('');
    });
  });
});