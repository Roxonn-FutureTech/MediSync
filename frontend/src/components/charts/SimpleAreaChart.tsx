import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

interface SimpleAreaChartProps {
  data: DataPoint[];
  color?: string;
  gradient?: boolean;
}

const SimpleAreaChart: React.FC<SimpleAreaChartProps> = ({
  data,
  color,
  gradient = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Use provided color or theme primary color
  const chartColor = color || theme.palette.primary.main;
  const gradientId = `areaChartGradient-${chartColor.replace('#', '')}`;
  
  // Format large numbers (e.g., 1000 -> 1k)
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 20,
          left: isMobile ? -10 : 0,
          bottom: 0,
        }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
            <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid 
          strokeDasharray="3 3" 
          vertical={false} 
          stroke={theme.palette.divider}
        />
        <XAxis 
          dataKey="name" 
          tickLine={false}
          axisLine={{ stroke: theme.palette.divider }}
          tick={{ 
            fill: theme.palette.text.secondary,
            fontSize: isMobile ? 10 : 12
          }}
          dy={10}
        />
        <YAxis 
          tickFormatter={formatYAxis}
          tickLine={false}
          axisLine={{ stroke: theme.palette.divider }}
          tick={{ 
            fill: theme.palette.text.secondary,
            fontSize: isMobile ? 10 : 12
          }}
          dx={-5}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
            boxShadow: theme.shadows[3],
          }}
          itemStyle={{
            color: theme.palette.text.primary,
          }}
          labelStyle={{
            color: theme.palette.text.secondary,
            fontWeight: 'bold',
            marginBottom: 4,
          }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={chartColor}
          strokeWidth={2}
          fill={gradient ? `url(#${gradientId})` : "none"}
          activeDot={{ 
            r: 5, 
            strokeWidth: 1, 
            stroke: theme.palette.background.paper 
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default SimpleAreaChart; 