import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GlobalSearch } from './GlobalSearch';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect } from 'vitest';

// Mock dependencies
vi.mock('../../store/useNeuronStore', () => ({
  useNeuronStore: () => ({
    tasks: [
      { id: '1', title: 'Buy Milk', status: 'TODO' },
      { id: '2', title: 'Walk Dog', status: 'DONE' }
    ],
    notes: [
      { id: 'n1', title: 'Project Ideas', content: '' }
    ]
  })
}));

vi.mock('../../store/useCrmStore', () => ({
  useCrmStore: () => ({
    leads: [
      { id: 'l1', name: 'John Doe', company: 'Acme' }
    ]
  })
}));

vi.mock('../../store/useWindowStore', () => ({
  useWindowStore: () => ({
    closeWindow: vi.fn()
  })
}));

describe('GlobalSearch Component', () => {
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <GlobalSearch onClose={vi.fn()} />
      </BrowserRouter>
    );
  };

  it('renders search input', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Search anything...')).toBeInTheDocument();
  });

  it('filters results based on input', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Search anything...');
    
    // Type "Buy"
    fireEvent.change(input, { target: { value: 'Buy' } });
    
    // Should see "Buy Milk" task
    expect(screen.getByText('Buy Milk')).toBeInTheDocument();
    
    // Should not see "Walk Dog"
    expect(screen.queryByText('Walk Dog')).not.toBeInTheDocument();
  });

  it('shows CRM results', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Search anything...');
    
    fireEvent.change(input, { target: { value: 'John' } });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Acme')).toBeInTheDocument();
  });

  it('shows empty state when no results found', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Search anything...');
    
    fireEvent.change(input, { target: { value: 'XYZ123' } });
    
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });
});