import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExpandingCandidateCard } from './ExpandingCandidateCard';
import type { Candidate } from '@/lib/types';

describe('ExpandingCandidateCard', () => {
  const mockCandidate: Candidate = {
    id: '1',
    name: 'Jane Doe',
    role: 'Lead Developer',
    bio: 'An experienced developer with a passion for testing.',
    imageUrl: '/jane-doe.jpg',
    imageHint: 'A portrait of Jane Doe',
  };

  it('renders the candidate name and role when not expanded', () => {
    render(<ExpandingCandidateCard candidate={mockCandidate} isExpanded={false} onClick={() => {}} />);

    // There are two places the name is rendered, one for collapsed and one for expanded
    const nameElements = screen.getAllByText('Jane Doe');
    expect(nameElements).toHaveLength(2);

    // The collapsed one is visible, check if it's there
    expect(screen.getAllByText('Lead Developer')).toHaveLength(2);
  });

  it('calls onClick when the card is clicked', () => {
    const handleClick = jest.fn();
    const { container } = render(
      <ExpandingCandidateCard candidate={mockCandidate} isExpanded={false} onClick={handleClick} />
    );

    // Click the main container
    fireEvent.click(container.firstChild as Element);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders bio when expanded', () => {
    render(<ExpandingCandidateCard candidate={mockCandidate} isExpanded={true} onClick={() => {}} />);

    const bioElement = screen.getByText('An experienced developer with a passion for testing.');
    expect(bioElement).toBeInTheDocument();
  });
});
