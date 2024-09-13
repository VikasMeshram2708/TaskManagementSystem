import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchBar from '../components/SearchBar'; // Adjust this path as needed

// Mock the useDebounce hook
jest.mock('../helpers/useDebounce', () => ({
  __esModule: true,
  default: (value) => value // This simplifies the debounce effect for testing
}));

const mockTasks = [
  { id: 1, title: 'Task 1', description: 'Description 1', status: 'todo', createdAt: '2024-09-13T10:00:00Z' },
  { id: 2, title: 'Task 2', description: 'Description 2', status: 'inprogress', createdAt: '2024-09-13T11:00:00Z' },
  { id: 3, title: 'Task 3', description: 'Description 3', status: 'done', createdAt: '2024-09-13T12:00:00Z' },
];

describe('SearchBar Component', () => {
  test('renders SearchBar component', () => {
    render(<SearchBar tasks={mockTasks} />);
    expect(screen.getByLabelText('Search:')).toBeInTheDocument();
    expect(screen.getByLabelText('Sort By:')).toBeInTheDocument();
  });

  test('updates search query on input change', async () => {
    render(<SearchBar tasks={mockTasks} />);
    const searchInput = screen.getByLabelText('Search:');
    fireEvent.change(searchInput, { target: { value: 'Task 1' } });
    await waitFor(() => {
      expect(screen.getByText('Search Result:')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Result count
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
  });

  test('filters tasks based on sort option', async () => {
    render(<SearchBar tasks={mockTasks} />);
    const sortSelect = screen.getByLabelText('Sort By:');
    fireEvent.change(sortSelect, { target: { value: 'inprogress' } });
    await waitFor(() => {
      expect(screen.getByText('Search Result:')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Result count
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  test('clears search and sort queries when clear button is clicked', async () => {
    render(<SearchBar tasks={mockTasks} />);
    const searchInput = screen.getByLabelText('Search:');
    const sortSelect = screen.getByLabelText('Sort By:');

    // Set search and sort values
    fireEvent.change(searchInput, { target: { value: 'Task' } });
    fireEvent.change(sortSelect, { target: { value: 'todo' } });

    await waitFor(() => {
      expect(screen.getByText('Clear Results')).toBeInTheDocument();
    });

    // Click clear button
    fireEvent.click(screen.getByText('Clear Results'));

    // Check if search and sort are cleared
    expect(searchInput).toHaveValue('');
    expect(sortSelect).toHaveValue('');
    expect(screen.queryByText('Search Result:')).not.toBeInTheDocument();
  });

  test('displays "No results found" when no tasks match the search', async () => {
    render(<SearchBar tasks={mockTasks} />);
    const searchInput = screen.getByLabelText('Search:');
    fireEvent.change(searchInput, { target: { value: 'Non-existent Task' } });
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  test('displays all tasks when "Recent" sort option is selected', async () => {
    render(<SearchBar tasks={mockTasks} />);
    const sortSelect = screen.getByLabelText('Sort By:');
    fireEvent.change(sortSelect, { target: { value: 'recent' } });
    await waitFor(() => {
      expect(screen.getByText('Search Result:')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument(); // Result count
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });
  });
});