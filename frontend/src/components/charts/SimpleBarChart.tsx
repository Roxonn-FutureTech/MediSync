import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  BarChart,
  Bar,
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

interface SimpleBarChartProps {
  data: DataPoint[];
  color?: string;
  showGrid?: boolean;
  showAxis?: boolean;
  barSize?: number;
  borderRadius?: number;
}

const SimpleBarChart: React.FC<SimpleBarChartProps> = ({
  data,
  color,
  showGrid = false,
  showAxis = true,
  barSize,
  borderRadius = 4,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isCompact = data.length > 5;
  
  // Use provided color or theme primary color
  const chartColor = color || theme.palette.primary.main;
  
  // Dynamic bar size based on chart dimensions and data points
  const dynamicBarSize = barSize || (isCompact ? 12 : isMobile ? 15 : 20);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 0,
          left: showAxis ? (isMobile ? -20 : -10) : 0,
          bottom: 5,
        }}
        barSize={dynamicBarSize}
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke={theme.palette.divider}
          />
        )}
        {showAxis && (
          <>
            <XAxis
              dataKey="name"
              axisLine={{ stroke: theme.palette.divider }}
              tick={{ 
                fill: theme.palette.text.secondary,
                fontSize: isMobile ? 9 : 10
              }}
              tickLine={false}
              dy={8}
            />
            <YAxis
              axisLine={{ stroke: theme.palette.divider }}
              tick={{ 
                fill: theme.palette.text.secondary,
                fontSize: isMobile ? 9 : 10
              }}
              tickLine={false}
              dx={-5}
            />
          </>
        )}
        <Tooltip
          cursor={{ fill: theme.palette.action.hover }}
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 6,
            boxShadow: theme.shadows[2],
            padding: '4px 8px',
          }}
          itemStyle={{
            color: theme.palette.text.primary,
            fontSize: isMobile ? 11 : 12,
            padding: 2,
          }}
          labelStyle={{
            color: theme.palette.text.secondary,
            fontWeight: 600,
            marginBottom: 2,
            fontSize: isMobile ? 10 : 11,
          }}
        />
        <Bar
          dataKey="value"
          fill={chartColor}
          radius={borderRadius}
          animationDuration={1500}
          animationEasing="ease-out"
          isAnimationActive={true}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart; 