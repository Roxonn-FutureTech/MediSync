import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Paper,
  Tabs,
  Tab,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  Stack,
  CircularProgress,
  Tooltip,
  Badge,
  alpha,
  useTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Map as MapIcon,
  Add as AddIcon,
  ViewModule as GridIcon,
  ViewList as ListIcon,
  Refresh as RefreshIcon,
  ArrowDropDown as ArrowDropDownIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Bed as BedIcon,
  LocalHospital as HospitalIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Person as PersonIcon,
  Download as DownloadIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import HospitalMap from './components/HospitalMap';
import HospitalList from './components/HospitalList';
import HospitalGrid from './components/HospitalGrid';
import HospitalDetail from './components/HospitalDetail';
import AddHospitalDialog from './components/AddHospitalDialog';

// Types for Hospital data
export interface HospitalStats {
  totalPatients: number;
  availableBeds: number;
  occupancyRate: number;
  staffCount: number;
  emergencyCapacity: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  phone: string;
  email: string;
  status: 'active' | 'limited' | 'full';
  type: 'General' | 'Specialized' | 'Children\'s' | 'Trauma';
  rating: number;
  distance: number;
  lastUpdated: string;
  image: string;
  stats: HospitalStats;
}

// Mock hospital data
const MOCK_HOSPITALS: Hospital[] = [
  {
    id: '1',
    name: 'Central Medical Center',
    address: '123 Healthcare Avenue, Medical District',
    location: { lat: 40.7128, lng: -74.006 },
    phone: '+1 (555) 123-4567',
    email: 'info@centralmed.com',
    status: 'active',
    type: 'General',
    rating: 4.5,
    distance: 2.3,
    lastUpdated: '10 minutes ago',
    image: 'https://images.unsplash.com/photo-1587351021759-3772687c05bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    stats: {
      totalPatients: 423,
      availableBeds: 45,
      occupancyRate: 78,
      staffCount: 120,
      emergencyCapacity: true
    }
  },
  {
    id: '2',
    name: 'Riverside Hospital',
    address: '456 River Road, Eastside',
    location: { lat: 40.7282, lng: -73.994 },
    phone: '+1 (555) 987-6543',
    email: 'contact@riverside.org',
    status: 'limited',
    type: 'Specialized',
    rating: 4.2,
    distance: 3.7,
    lastUpdated: '25 minutes ago',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80',
    stats: {
      totalPatients: 312,
      availableBeds: 12,
      occupancyRate: 92,
      staffCount: 85,
      emergencyCapacity: true
    }
  },
  {
    id: '3',
    name: 'Children\'s Wellness Hospital',
    address: '789 Healing Path, West District',
    location: { lat: 40.7369, lng: -74.032 },
    phone: '+1 (555) 234-5678',
    email: 'help@childrenswellness.org',
    status: 'active',
    type: 'Children\'s',
    rating: 4.8,
    distance: 5.2,
    lastUpdated: '1 hour ago',
    image: 'https://images.unsplash.com/photo-1516549655669-33b6224ebe15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    stats: {
      totalPatients: 187,
      availableBeds: 32,
      occupancyRate: 65,
      staffCount: 92,
      emergencyCapacity: false
    }
  },
  {
    id: '4',
    name: 'Metro Trauma Center',
    address: '1010 Emergency Way, Downtown',
    location: { lat: 40.7501, lng: -73.987 },
    phone: '+1 (555) 876-5432',
    email: 'emergencies@metrotrauma.com',
    status: 'full',
    type: 'Trauma',
    rating: 4.6,
    distance: 1.8,
    lastUpdated: '5 minutes ago',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1153&q=80',
    stats: {
      totalPatients: 278,
      availableBeds: 0,
      occupancyRate: 100,
      staffCount: 140,
      emergencyCapacity: false
    }
  },
  {
    id: '5',
    name: 'Eastside Medical',
    address: '2020 Health Street, Eastside',
    location: { lat: 40.7235, lng: -73.965 },
    phone: '+1 (555) 345-6789',
    email: 'info@eastsidemed.com',
    status: 'active',
    type: 'General',
    rating: 4.0,
    distance: 4.5,
    lastUpdated: '30 minutes ago',
    image: 'https://images.unsplash.com/photo-1516549655669-33b6224ebe15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
    stats: {
      totalPatients: 345,
      availableBeds: 27,
      occupancyRate: 82,
      staffCount: 95,
      emergencyCapacity: true
    }
  }
];

const HospitalDashboard = () => {
  const theme = useTheme();
  
  // State variables
  const [view, setView] = useState<'list' | 'grid' | 'map'>('grid');
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([...MOCK_HOSPITALS]);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Filter hospitals based on search term
  const filteredHospitals = hospitals.filter(hospital => {
    if (!searchTerm) return true;
    
    const term = searchTerm.toLowerCase();
    return (
      hospital.name.toLowerCase().includes(term) ||
      hospital.address.toLowerCase().includes(term) ||
      hospital.type.toLowerCase().includes(term)
    );
  });

  // Handle filter menu
  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterMenuAnchor(event.currentTarget);
  };
  
  const handleFilterClose = () => {
    setFilterMenuAnchor(null);
  };

  const applyFilter = (filter: string | null) => {
    handleFilterClose();
    setActiveFilter(filter);
    
    if (!filter) {
      setHospitals([...MOCK_HOSPITALS]);
      return;
    }
    
    let filtered = [...MOCK_HOSPITALS];
    
    switch (filter) {
      case 'availability':
        filtered = filtered.filter(h => h.stats.availableBeds > 0);
        break;
      case 'emergency':
        filtered = filtered.filter(h => h.stats.emergencyCapacity);
        break;
      case 'distance':
        filtered.sort((a, b) => a.distance - b.distance);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'active':
        filtered = filtered.filter(h => h.status === 'active');
        break;
    }
    
    setHospitals(filtered);
  };
  
  // Simulate data fetching
  const fetchHospitals = () => {
    setIsLoading(true);
    setTimeout(() => {
      setHospitals([...MOCK_HOSPITALS]);
      setIsLoading(false);
    }, 800);
  };
  
  // View details of a hospital
  const handleViewDetails = (hospital: Hospital) => {
    setSelectedHospital(hospital);
  };
  
  // Close hospital details
  const handleCloseDetails = () => {
    setSelectedHospital(null);
  };
  
  return (
    <Box>
      {/* Header section with actions */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3
      }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Hospitals
        </Typography>
        
        <Stack direction="row" spacing={1}>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => setShowAddDialog(true)}
          >
            Add Hospital
          </Button>
          
          <Button
            variant={activeFilter ? "contained" : "outlined"}
            color={activeFilter ? "primary" : "inherit"}
            startIcon={<FilterIcon />}
            endIcon={<ArrowDropDownIcon />}
            onClick={handleFilterClick}
          >
            {activeFilter ? 'Filtered' : 'Filter'}
          </Button>
          
          <Tooltip title="Refresh">
            <IconButton 
              onClick={fetchHospitals} 
              color="inherit"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : <RefreshIcon />}
            </IconButton>
          </Tooltip>
          
          <Divider orientation="vertical" flexItem />
          
          <Tooltip title="List View">
            <IconButton 
              color={view === 'list' ? 'primary' : 'default'} 
              onClick={() => setView('list')}
            >
              <ListIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Grid View">
            <IconButton 
              color={view === 'grid' ? 'primary' : 'default'} 
              onClick={() => setView('grid')}
            >
              <GridIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Map View">
            <IconButton 
              color={view === 'map' ? 'primary' : 'default'} 
              onClick={() => setView('map')}
            >
              <MapIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
      
      {/* Search and stats section */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="Search hospitals by name, address or type..."
              variant="outlined"
              size="medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper sx={{ 
            p: 2, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-around'
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">Total</Typography>
              <Typography variant="h5" fontWeight="bold">{hospitals.length}</Typography>
            </Box>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">Available</Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                {hospitals.filter(h => h.status === 'active').length}
              </Typography>
            </Box>
            
            <Divider orientation="vertical" flexItem sx={{ mx: 2 }} />
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary">Limited</Typography>
              <Typography variant="h5" fontWeight="bold" color="warning.main">
                {hospitals.filter(h => h.status === 'limited').length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Main content section based on view type */}
      <Box sx={{ position: 'relative', minHeight: '500px' }}>
        {isLoading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            height: '500px'
          }}>
            <CircularProgress />
          </Box>
        ) : filteredHospitals.length === 0 ? (
          <Paper sx={{ 
            p: 4, 
            textAlign: 'center',
            borderStyle: 'dashed',
            borderWidth: 1,
            borderColor: 'divider',
            bgcolor: 'background.default'
          }}>
            <HospitalIcon sx={{ fontSize: 60, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography variant="h6" gutterBottom>No hospitals found</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Try adjusting your search or filters to find what you're looking for.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => {
                setSearchTerm('');
                applyFilter(null);
              }}
            >
              Clear Filters
            </Button>
          </Paper>
        ) : (
          <>
            {view === 'list' && (
              <HospitalList 
                hospitals={filteredHospitals} 
                onViewDetails={handleViewDetails}
              />
            )}
            
            {view === 'grid' && (
              <HospitalGrid 
                hospitals={filteredHospitals} 
                onViewDetails={handleViewDetails}
              />
            )}
            
            {view === 'map' && (
              <HospitalMap 
                hospitals={filteredHospitals} 
                onViewDetails={handleViewDetails}
              />
            )}
          </>
        )}
      </Box>
      
      {/* Filter Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={handleFilterClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem 
          onClick={() => applyFilter('availability')}
          selected={activeFilter === 'availability'}
        >
          <ListItemIcon>
            <BedIcon />
          </ListItemIcon>
          <ListItemText>Available Beds</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => applyFilter('emergency')}
          selected={activeFilter === 'emergency'}
        >
          <ListItemIcon>
            <CheckCircleIcon />
          </ListItemIcon>
          <ListItemText>Emergency Capacity</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => applyFilter('distance')}
          selected={activeFilter === 'distance'}
        >
          <ListItemIcon>
            <LocationIcon />
          </ListItemIcon>
          <ListItemText>Nearest First</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => applyFilter('rating')}
          selected={activeFilter === 'rating'}
        >
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText>Highest Rated</ListItemText>
        </MenuItem>
        
        <MenuItem 
          onClick={() => applyFilter('active')}
          selected={activeFilter === 'active'}
        >
          <ListItemIcon>
            <CheckCircleIcon />
          </ListItemIcon>
          <ListItemText>Active Status</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => applyFilter(null)}>
          <ListItemText>Clear Filters</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Hospital Detail Dialog */}
      {selectedHospital && (
        <HospitalDetail
          hospital={selectedHospital}
          open={!!selectedHospital}
          onClose={handleCloseDetails}
        />
      )}
      
      {/* Add Hospital Dialog */}
      <AddHospitalDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={(hospital) => {
          setHospitals([...hospitals, { ...hospital, id: `${hospitals.length + 1}` }]);
          setShowAddDialog(false);
        }}
      />
    </Box>
  );
};

export default HospitalDashboard; 