import React from 'react';
import { useTheme, useMediaQuery } from '@mui/material';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

interface SimplePieChartProps {
  data: DataPoint[];
  colors?: string[];
  donut?: boolean;
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  innerRadius?: number;
  outerRadius?: number;
}

const SimplePieChart: React.FC<SimplePieChartProps> = ({
  data,
  colors,
  donut = true,
  legendPosition = 'bottom',
  innerRadius,
  outerRadius,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  
  // Default color palette based on theme
  const defaultColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.info.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    '#9c27b0', // purple
    '#009688', // teal
    '#795548', // brown
    '#607d8b', // blue-grey
  ];
  
  // Use provided colors or default theme colors
  const chartColors = colors || defaultColors;
  
  // Determine dynamic radius based on screen size
  const dynamicOuterRadius = outerRadius || (isMobile ? 70 : isSmall ? 90 : 110);
  const dynamicInnerRadius = innerRadius || (donut ? dynamicOuterRadius * 0.6 : 0);
  
  // Format large numbers in tooltip
  const formatValue = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return value;
  };
  
  // Calculate percentages for each slice
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const dataWithPercent = data.map(entry => ({
    ...entry,
    percent: Math.round((entry.value / total) * 100)
  }));

  // Custom renderer for the legend text
  const renderLegendText = (value: string, entry: any) => {
    const { percent } = entry.payload;
    return (
      <span style={{ color: theme.palette.text.primary, fontSize: isMobile ? 10 : 12 }}>
        {value} ({percent}%)
      </span>
    );
  };
  
  // Handle legend layout based on position
  const getLegendProps = () => {
    switch (legendPosition) {
      case 'top':
        return {
          layout: 'horizontal',
          verticalAlign: 'top',
          align: 'center',
          height: 30,
        };
      case 'right':
        return {
          layout: 'vertical',
          verticalAlign: 'middle',
          align: 'right',
          width: 80,
        };
      case 'left':
        return {
          layout: 'vertical',
          verticalAlign: 'middle',
          align: 'left',
          width: 80,
        };
      case 'bottom':
      default:
        return {
          layout: 'horizontal',
          verticalAlign: 'bottom',
          align: 'center',
          height: 40,
        };
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={dataWithPercent}
          cx="50%"
          cy="50%"
          labelLine={false}
          innerRadius={dynamicInnerRadius}
          outerRadius={dynamicOuterRadius}
          fill={theme.palette.primary.main}
          dataKey="value"
          animationDuration={1000}
          animationEasing="ease-out"
          isAnimationActive={true}
        >
          {dataWithPercent.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={chartColors[index % chartColors.length]}
              stroke={theme.palette.background.paper}
              strokeWidth={isMobile ? 1 : 2}
            />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number, name: string, props: any) => [
            `${formatValue(value)} (${props.payload.percent}%)`,
            name
          ]}
          contentStyle={{
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 8,
            boxShadow: theme.shadows[3],
            padding: '8px 12px',
          }}
          itemStyle={{
            color: theme.palette.text.primary,
            fontSize: isMobile ? 11 : 12,
          }}
          labelStyle={{
            color: theme.palette.text.secondary,
            fontWeight: 600,
            marginBottom: 4,
            fontSize: isMobile ? 11 : 12,
          }}
        />
        <Legend 
          {...getLegendProps()}
          iconSize={isMobile ? 8 : 10}
          iconType="circle"
          formatter={renderLegendText}
          wrapperStyle={{
            paddingTop: legendPosition === 'bottom' ? 15 : 0,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default SimplePieChart; 