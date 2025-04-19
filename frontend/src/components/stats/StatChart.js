import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Paper, Typography, Box, CircularProgress } from '@mui/material';

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const StatChart = ({
  type = 'bar',
  data = [],
  title,
  subtitle,
  dataKey = 'value',
  nameKey = 'name',
  loading = false,
  height = 300,
  colors = COLORS
}) => {
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={colors[0]} activeDot={{ r: 8 }} />
          </LineChart>
        );
      
      case 'bar':
        return (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill={colors[0]} />
          </BarChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
      
      case 'stacked-bar':
        // Assumes multiple dataKeys are passed as an array
        const dataKeys = Array.isArray(dataKey) ? dataKey : [dataKey];
        
        return (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={nameKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            {dataKeys.map((key, index) => (
              <Bar 
                key={key} 
                dataKey={key} 
                stackId="a" 
                fill={colors[index % colors.length]} 
              />
            ))}
          </BarChart>
        );
      
      default:
        return <Typography color="error">Invalid chart type</Typography>;
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
      <Box mb={2}>
        {title && <Typography variant="h6">{title}</Typography>}
        {subtitle && (
          <Typography variant="body2" color="textSecondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={height}
        >
          <CircularProgress />
        </Box>
      ) : data.length === 0 ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={height}
        >
          <Typography color="textSecondary">No data available</Typography>
        </Box>
      ) : (
        <Box height={height}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </Box>
      )}
    </Paper>
  );
};

export default StatChart; 