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
  ResponsiveContainer,
  AreaChart,
  Area,
  ComposedChart,
  ReferenceLine
} from 'recharts';
import { Paper, Typography, Box, CircularProgress, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';

// Enhanced chart colors with theme integration
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c'];

const ChartContainer = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  transition: 'box-shadow 0.2s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4]
  }
}));

const StatChart = ({
  type = 'bar',
  data = [],
  title,
  subtitle,
  dataKey = 'value',
  nameKey = 'name',
  loading = false,
  height = 300,
  colors = COLORS,
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  animate = true,
  gradientFill = false,
  referenceLines = [],
  customTooltip
}) => {
  const theme = useTheme();
  const renderChart = () => {
    const margin = { top: 5, right: 30, left: 20, bottom: 5 };
    const gridProps = showGrid ? { strokeDasharray: '3 3', stroke: theme.palette.divider } : {};
    
    switch (type) {
      case 'line':
        return (
          <LineChart data={data} margin={margin}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis 
              dataKey={nameKey} 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
            />
            {showTooltip && (
              <Tooltip 
                content={customTooltip}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.spacing(1)
                }}
              />
            )}
            {showLegend && <Legend />}
            {referenceLines.map((line, index) => (
              <ReferenceLine key={index} {...line} stroke={theme.palette.error.main} />
            ))}
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={colors[0]} 
              strokeWidth={2}
              activeDot={{ r: 6, fill: colors[0] }}
              dot={{ r: 4 }}
              animationDuration={animate ? 1000 : 0}
            />
          </LineChart>
        );
        
      case 'area':
        return (
          <AreaChart data={data} margin={margin}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis 
              dataKey={nameKey} 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
            />
            {showTooltip && (
              <Tooltip 
                content={customTooltip}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.spacing(1)
                }}
              />
            )}
            {showLegend && <Legend />}
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={colors[0]} 
              strokeWidth={2}
              fill={gradientFill ? "url(#colorGradient)" : colors[0]}
              fillOpacity={gradientFill ? 1 : 0.3}
              animationDuration={animate ? 1000 : 0}
            />
          </AreaChart>
        );
      
      case 'bar':
        return (
          <BarChart data={data} margin={margin}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis 
              dataKey={nameKey} 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
            />
            {showTooltip && (
              <Tooltip 
                content={customTooltip}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.spacing(1)
                }}
              />
            )}
            {showLegend && <Legend />}
            {referenceLines.map((line, index) => (
              <ReferenceLine key={index} {...line} stroke={theme.palette.error.main} />
            ))}
            <Bar 
              dataKey={dataKey} 
              fill={colors[0]} 
              radius={[4, 4, 0, 0]}
              animationDuration={animate ? 800 : 0}
            />
          </BarChart>
        );
        
      case 'composed':
        return (
          <ComposedChart data={data} margin={margin}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis 
              dataKey={nameKey} 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
            />
            {showTooltip && (
              <Tooltip 
                content={customTooltip}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.spacing(1)
                }}
              />
            )}
            {showLegend && <Legend />}
            {Array.isArray(dataKey) ? (
              dataKey.map((key, index) => (
                <Bar 
                  key={key}
                  dataKey={key} 
                  fill={colors[index % colors.length]} 
                  radius={[2, 2, 0, 0]}
                  animationDuration={animate ? 800 : 0}
                />
              ))
            ) : (
              <Bar 
                dataKey={dataKey} 
                fill={colors[0]} 
                radius={[4, 4, 0, 0]}
                animationDuration={animate ? 800 : 0}
              />
            )}
          </ComposedChart>
        );
      
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={Math.min(height * 0.35, 100)}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              animationDuration={animate ? 1000 : 0}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  stroke={theme.palette.background.paper}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            {showTooltip && (
              <Tooltip 
                content={customTooltip}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.spacing(1)
                }}
              />
            )}
            {showLegend && <Legend />}
          </PieChart>
        );
        
      case 'donut':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={Math.min(height * 0.35, 100)}
              innerRadius={Math.min(height * 0.2, 60)}
              fill="#8884d8"
              dataKey={dataKey}
              nameKey={nameKey}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              animationDuration={animate ? 1000 : 0}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]}
                  stroke={theme.palette.background.paper}
                  strokeWidth={2}
                />
              ))}
            </Pie>
            {showTooltip && (
              <Tooltip 
                content={customTooltip}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.spacing(1)
                }}
              />
            )}
            {showLegend && <Legend />}
          </PieChart>
        );
      
      case 'stackedBar':
        return (
          <BarChart data={data} margin={margin}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis 
              dataKey={nameKey} 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              axisLine={{ stroke: theme.palette.divider }}
            />
            {showTooltip && (
              <Tooltip 
                content={customTooltip}
                contentStyle={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: theme.spacing(1)
                }}
              />
            )}
            {showLegend && <Legend />}
            {Array.isArray(dataKey) ? (
              dataKey.map((key, index) => (
                <Bar 
                  key={key}
                  dataKey={key} 
                  stackId="a" 
                  fill={colors[index % colors.length]}
                  radius={index === dataKey.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                  animationDuration={animate ? 800 : 0}
                />
              ))
            ) : (
              <Bar 
                dataKey={dataKey} 
                stackId="a" 
                fill={colors[0]}
                radius={[4, 4, 0, 0]}
                animationDuration={animate ? 800 : 0}
              />
            )}
          </BarChart>
        );
      
      default:
        return <Typography color="error">Invalid chart type</Typography>;
    }
  };

  return (
    <ChartContainer elevation={2} sx={{ p: 3, height: '100%' }}>
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
    </ChartContainer>
  );
};

export default StatChart; 