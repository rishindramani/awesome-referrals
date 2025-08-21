import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import '@testing-library/jest-dom';
import StatCard from '../StatCard';
import { Work as WorkIcon } from '@mui/icons-material';

const theme = createTheme();

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('StatCard Component', () => {
  const defaultProps = {
    title: 'Test Metric',
    value: 42,
    icon: <WorkIcon />,
    color: 'primary'
  };

  it('should render basic stat card with title and value', () => {
    renderWithTheme(<StatCard {...defaultProps} />);
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('should display loading state', () => {
    renderWithTheme(<StatCard {...defaultProps} loading={true} />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('42')).not.toBeInTheDocument();
  });

  it('should format value using formatValue function', () => {
    const formatValue = (value) => `$${value.toLocaleString()}`;
    
    renderWithTheme(
      <StatCard 
        {...defaultProps} 
        value={1234} 
        formatValue={formatValue} 
      />
    );
    
    expect(screen.getByText('$1,234')).toBeInTheDocument();
  });

  it('should display trend indicator when trend is provided', () => {
    renderWithTheme(
      <StatCard 
        {...defaultProps} 
        trend="up" 
        trendValue={15} 
      />
    );
    
    expect(screen.getByText('+15%')).toBeInTheDocument();
  });

  it('should display footer text when provided', () => {
    const footer = 'Last updated 5 minutes ago';
    
    renderWithTheme(
      <StatCard 
        {...defaultProps} 
        footer={footer} 
      />
    );
    
    expect(screen.getByText(footer)).toBeInTheDocument();
  });

  it('should display subtitle when provided', () => {
    const subtitle = 'This is a subtitle';
    
    renderWithTheme(
      <StatCard 
        {...defaultProps} 
        subtitle={subtitle} 
      />
    );
    
    expect(screen.getByText(subtitle)).toBeInTheDocument();
  });

  it('should be clickable when onClick is provided', () => {
    const handleClick = jest.fn();
    
    renderWithTheme(
      <StatCard 
        {...defaultProps} 
        onClick={handleClick} 
      />
    );
    
    const card = screen.getByText('Test Metric').closest('[role="button"]') || 
                  screen.getByText('Test Metric').closest('div');
    
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should display different trend indicators', () => {
    // Test up trend
    const { rerender } = renderWithTheme(
      <StatCard 
        {...defaultProps} 
        trend="up" 
        trendValue={10} 
      />
    );
    expect(screen.getByText('+10%')).toBeInTheDocument();

    // Test down trend
    rerender(
      <ThemeProvider theme={theme}>
        <StatCard 
          {...defaultProps} 
          trend="down" 
          trendValue={5} 
        />
      </ThemeProvider>
    );
    expect(screen.getByText('-5%')).toBeInTheDocument();

    // Test neutral trend
    rerender(
      <ThemeProvider theme={theme}>
        <StatCard 
          {...defaultProps} 
          trend="neutral" 
          trendValue={0} 
        />
      </ThemeProvider>
    );
    expect(screen.getByText('0%')).toBeInTheDocument();
  });

  it('should handle zero values correctly', () => {
    renderWithTheme(<StatCard {...defaultProps} value={0} />);
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should handle large numbers correctly', () => {
    const formatValue = (value) => value.toLocaleString();
    
    renderWithTheme(
      <StatCard 
        {...defaultProps} 
        value={1234567} 
        formatValue={formatValue} 
      />
    );
    
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
  });

  it('should not render trend when no trend value is provided', () => {
    renderWithTheme(
      <StatCard 
        {...defaultProps} 
        trend="up" 
      />
    );
    
    expect(screen.queryByText('%')).not.toBeInTheDocument();
  });

  it('should apply proper styling based on color prop', () => {
    renderWithTheme(
      <StatCard 
        {...defaultProps} 
        color="secondary" 
      />
    );
    
    // The icon container should have the secondary color styling
    const iconContainer = screen.getByTestId('WorkIcon').closest('div');
    expect(iconContainer).toHaveStyle({
      color: theme.palette.secondary.main
    });
  });

  it('should render without icon', () => {
    const { icon, ...propsWithoutIcon } = defaultProps;
    
    renderWithTheme(<StatCard {...propsWithoutIcon} />);
    
    expect(screen.getByText('Test Metric')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.queryByTestId('WorkIcon')).not.toBeInTheDocument();
  });
});