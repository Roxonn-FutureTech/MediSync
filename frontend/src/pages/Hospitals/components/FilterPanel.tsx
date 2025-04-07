import { FC } from 'react';
import {
  Paper,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
  Chip,
  Divider,
  Button,
  Switch,
  FormControlLabel,
  IconButton,
  InputAdornment,
  alpha,
  Stack,
  useTheme,
  Grid
} from '@mui/material';
import {
  TuneRounded as TuneIcon,
  Search as SearchIcon,
  LocationOn as LocationIcon,
  LocalHospital as HospitalIcon,
  Clear as ClearIcon,
  Check as CheckIcon,
  Star as StarIcon,
  FilterAlt as FilterIcon,
  RestartAlt as ResetIcon
} from '@mui/icons-material';

interface FilterPanelProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filters: {
    type: string;
    status: string;
    distance: [number, number];
    rating: number;
    emergencyOnly: boolean;
    showActive: boolean;
  };
  setFilters: (filters: any) => void;
  clearFilters: () => void;
}

const FilterPanel: FC<FilterPanelProps> = ({ 
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  clearFilters
}) => {
  const theme = useTheme();
  
  const hospitalTypes = [
    'All Types',
    'General Hospital', 
    'Specialty Hospital', 
    'Teaching Hospital', 
    'Clinic', 
    'Trauma Center',
    'Rehabilitation Center',
    'Mental Health Facility',
    'Children\'s Hospital'
  ];
  
  const statusOptions = [
    'All Statuses',
    'Active',
    'Limited',
    'Full'
  ];
  
  const handleFilterChange = (name: string, value: any) => {
    setFilters((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleDistanceChange = (event: Event, newValue: number | number[]) => {
    setFilters((prev: any) => ({
      ...prev,
      distance: newValue as [number, number]
    }));
  };
  
  const handleRatingChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setFilters((prev: any) => ({
        ...prev,
        rating: newValue
      }));
    }
  };
  
  const handleSwitchChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev: any) => ({
      ...prev,
      [name]: event.target.checked
    }));
  };
  
  return (
    <Paper 
      elevation={0} 
      variant="outlined" 
      sx={{ 
        p: 2.5, 
        borderRadius: 2, 
        mb: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.7)}`
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <FilterIcon color="primary" />
        <Typography variant="h6" fontWeight="medium">
          Filter Hospitals
        </Typography>
        <Button 
          size="small" 
          startIcon={<ResetIcon />} 
          sx={{ ml: 'auto' }}
          onClick={clearFilters}
        >
          Reset
        </Button>
      </Box>
      
      <TextField
        fullWidth
        placeholder="Search hospitals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm ? (
            <InputAdornment position="end">
              <IconButton 
                size="small" 
                onClick={() => setSearchTerm('')}
                edge="end"
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : null
        }}
      />
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="type-label">Hospital Type</InputLabel>
            <Select
              labelId="type-label"
              id="type-select"
              value={filters.type}
              label="Hospital Type"
              onChange={(e) => handleFilterChange('type', e.target.value)}
              startAdornment={
                <Box sx={{ mr: 0.5, ml: -0.25, color: 'action.active' }}>
                  <HospitalIcon fontSize="small" />
                </Box>
              }
            >
              {hospitalTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              id="status-select"
              value={filters.status}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
              startAdornment={
                <Box 
                  sx={{ 
                    mr: 0.5, 
                    ml: -0.25, 
                    color: filters.status === 'Active' 
                      ? 'success.main' 
                      : filters.status === 'Limited' 
                        ? 'warning.main' 
                        : filters.status === 'Full' 
                          ? 'error.main' 
                          : 'action.active' 
                  }}
                >
                  <CheckIcon fontSize="small" />
                </Box>
              }
            >
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <Box sx={{ px: 1 }}>
            <Typography variant="subtitle2" id="distance-slider" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationIcon fontSize="small" color="action" /> 
              Distance Range: {filters.distance[0]} - {filters.distance[1]} miles
            </Typography>
            <Slider
              value={filters.distance}
              onChange={handleDistanceChange}
              valueLabelDisplay="auto"
              aria-labelledby="distance-slider"
              min={0}
              max={50}
              step={1}
              marks={[
                { value: 0, label: '0 mi' },
                { value: 10, label: '10 mi' },
                { value: 25, label: '25 mi' },
                { value: 50, label: '50 mi' }
              ]}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Box sx={{ px: 1 }}>
            <Typography variant="subtitle2" id="rating-slider" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <StarIcon fontSize="small" color="warning" /> 
              Minimum Rating: {filters.rating}+
            </Typography>
            <Slider
              value={filters.rating}
              onChange={handleRatingChange}
              valueLabelDisplay="auto"
              aria-labelledby="rating-slider"
              min={1}
              max={5}
              step={0.5}
              marks={[
                { value: 1, label: '1' },
                { value: 2, label: '2' },
                { value: 3, label: '3' },
                { value: 4, label: '4' },
                { value: 5, label: '5' }
              ]}
              sx={{ 
                color: theme.palette.warning.main,
                '& .MuiSlider-thumb': {
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${alpha(theme.palette.warning.main, 0.16)}`
                  },
                  '&.Mui-active': {
                    boxShadow: `0px 0px 0px 14px ${alpha(theme.palette.warning.main, 0.16)}`
                  }
                }
              }}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ height: '100%' }}>
            <FormControlLabel
              control={
                <Switch 
                  checked={filters.emergencyOnly}
                  onChange={handleSwitchChange('emergencyOnly')}
                  color="error"
                />
              }
              label="Emergency Services Only"
              sx={{ mr: 2 }}
            />
            
            <FormControlLabel
              control={
                <Switch 
                  checked={filters.showActive}
                  onChange={handleSwitchChange('showActive')}
                  color="success"
                />
              }
              label="Available Beds Only"
            />
          </Stack>
        </Grid>
      </Grid>
      
      <Divider sx={{ my: 2.5 }} />
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="subtitle2" sx={{ mr: 1 }}>
          Active Filters:
        </Typography>
        
        {filters.type !== 'All Types' && (
          <Chip 
            label={`Type: ${filters.type}`} 
            size="small" 
            onDelete={() => handleFilterChange('type', 'All Types')}
            color="primary"
            variant="outlined"
          />
        )}
        
        {filters.status !== 'All Statuses' && (
          <Chip 
            label={`Status: ${filters.status}`} 
            size="small" 
            onDelete={() => handleFilterChange('status', 'All Statuses')}
            color="primary"
            variant="outlined"
          />
        )}
        
        {(filters.distance[0] > 0 || filters.distance[1] < 50) && (
          <Chip 
            label={`Distance: ${filters.distance[0]}-${filters.distance[1]} mi`} 
            size="small" 
            onDelete={() => handleFilterChange('distance', [0, 50])}
            color="primary"
            variant="outlined"
          />
        )}
        
        {filters.rating > 1 && (
          <Chip 
            label={`Rating: ${filters.rating}+`} 
            size="small" 
            onDelete={() => handleFilterChange('rating', 1)}
            color="primary"
            variant="outlined"
          />
        )}
        
        {filters.emergencyOnly && (
          <Chip 
            label="Emergency Services Only" 
            size="small" 
            onDelete={() => handleFilterChange('emergencyOnly', false)}
            color="error"
            variant="outlined"
          />
        )}
        
        {filters.showActive && (
          <Chip 
            label="Available Beds Only" 
            size="small" 
            onDelete={() => handleFilterChange('showActive', false)}
            color="success"
            variant="outlined"
          />
        )}
        
        {searchTerm && (
          <Chip 
            label={`Search: "${searchTerm}"`} 
            size="small" 
            onDelete={() => setSearchTerm('')}
            color="primary"
            variant="outlined"
          />
        )}
        
        {!searchTerm && 
          filters.type === 'All Types' && 
          filters.status === 'All Statuses' && 
          filters.distance[0] === 0 && 
          filters.distance[1] === 50 &&
          filters.rating === 1 &&
          !filters.emergencyOnly &&
          !filters.showActive && (
          <Typography variant="body2" color="text.secondary">
            No filters applied
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

export default FilterPanel; 