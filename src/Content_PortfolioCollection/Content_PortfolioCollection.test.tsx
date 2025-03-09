import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Content_PortfolioCollection from './Content_PortfolioCollection';
import { PortfolioContext } from '../Data/DataProvider';
import { EVT_ENUM } from '../Data/Models';

vi.mock('../assets/play_icon.svg', () => ({
  default: 'mocked_play_icon.svg'
}));

const mockContextValue = {
  ee: {
    on: vi.fn(),
    emit: vi.fn()
  },
  global_skillset_opacity: 1,
  global_content_3d_translateZ: 0,
  global_content_portfolio_rotateY: 0,
  global_portfolio_filtered: [
    {
      id: 1,
      title: 'Image Project',
      images: ['http://example.com/image.jpg']
    },
    {
      id: 2,
      title: 'Vimeo Project',
      images: ['https://vimeo.com/123456789']
    }
  ],
  ctrl_skillsRated_get_byPortfolioID: vi.fn((id) => 
    id === 1 ? [
      { title: 'JavaScript', category: 'skills_webDev', strength: 80 }
    ] : [
      { title: 'Photoshop', category: 'skills_uiux', strength: 75 }
    ]
  ),
  ctrl_global_set_portfolio_item_current: vi.fn()
};

global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ thumbnail_large: 'http://vimeo.com/thumb.jpg' }])
  })
);

describe('Content_PortfolioCollection', () => {
  const renderWithContext = async (contextValue = mockContextValue) => {
    const result = render(
      <PortfolioContext.Provider value={contextValue}>
        <Content_PortfolioCollection />
      </PortfolioContext.Provider>
    );
    await waitFor(() => {
      expect(screen.getByText('Image Project')).toBeInTheDocument();
    });
    return result;
  };

  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders portfolio items', async () => {
    await renderWithContext();
    expect(screen.getByText('Image Project')).toBeInTheDocument();
    expect(screen.getByText('Vimeo Project')).toBeInTheDocument();
  });

  it('applies correct styles from context', async () => {
    await renderWithContext();
    const portfolioDiv = screen.getByTestId('portfolio-collection');
    expect(portfolioDiv).toHaveStyle({
      opacity: '1',
      transform: 'rotateY(0deg) translateZ(0px)'
    });
  });

  it('handles portfolio item click', async () => {
    await renderWithContext();
    const item = screen.getByText('Image Project');
    fireEvent.click(item);
    expect(mockContextValue.ctrl_global_set_portfolio_item_current).toHaveBeenCalledWith(1);
    expect(mockContextValue.ee.emit).toHaveBeenCalledWith(EVT_ENUM.PORTFOLIO_ITEM_CLICK, { id: "1" });
  });

  it('renders image thumbnails', async () => {
    await renderWithContext();
    const imageThumbnail = screen.getByAltText('portfolio thumbnail 1');
    expect(imageThumbnail).toHaveAttribute('src', 'http://example.com/image.jpg');
  });

  it('renders vimeo thumbnails with play icon', async () => {
    await renderWithContext();
    await waitFor(() => {
      // Debug the DOM
      screen.debug();
      // Fallback to class-based query if alt is missing
      const videoThumbnail = screen.getByAltText('portfolio thumbnail 2') || 
                            screen.getByTestId('portfolio-collection')
                              .querySelector('[data-key="2"].port_thumbnail');
      const playIcon = screen.getByAltText('play icon');
      expect(videoThumbnail).toHaveAttribute('src', 'http://vimeo.com/thumb.jpg');
      expect(playIcon).toHaveAttribute('src', 'mocked_play_icon.svg');
    }, { timeout: 2000 });
  });

  it('renders skills ratings', async () => {
    await renderWithContext();
    const jsBar = screen.getByText('Image Project')
      .closest('.port_item')
      .querySelector('.skill_bar_vertical_fuel');
    expect(jsBar).toHaveClass('bar_height80');
    
    const psBar = screen.getByText('Vimeo Project')
      .closest('.port_item')
      .querySelector('.skill_bar_vertical_fuel');
    expect(psBar).toHaveClass('bar_height75');
  });

  it('scrolls to top on nav click', async () => {
    await renderWithContext();
    const navHandler = mockContextValue.ee.on.mock.calls.find(
      call => call[0] === EVT_ENUM.NAV_CLICK
    )[1];
    navHandler();
    expect(Element.prototype.scrollTo).toHaveBeenCalledWith(0, 0);
  });
});