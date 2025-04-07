import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  InputAdornment, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Button, 
  Tabs, 
  Tab, 
  Divider, 
  alpha, 
  IconButton,
  Chip,
  CircularProgress,
  useTheme
} from '@mui/material';
import { 
  Search as SearchIcon, 
  History as HistoryIcon, 
  Close as CloseIcon,
  LocalHospital as HospitalIcon,
  Person as PatientIcon,
  MedicalServices as EmergencyIcon,
  People as StaffIcon,
  Dashboard as DashboardIcon,
  Article as DocsIcon,
  Favorite as FavoriteIcon,
  Delete as DeleteIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock search results data structure
interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  type: 'hospital' | 'patient' | 'staff' | 'emergency' | 'page' | 'document';
  icon: React.ReactNode;
  path: string;
  details?: string;
  tags?: string[];
}

// Hard-coded search items from different sections
const searchItems: SearchResult[] = [
  // Hospitals
  { 
    id: 'hospital-1', 
    title: 'Central Medical Center', 
    subtitle: 'General Hospital', 
    type: 'hospital', 
    icon: <HospitalIcon color="primary" />, 
    path: '/hospitals',
    details: 'A 500-bed facility with emergency services',
    tags: ['active', 'emergency']
  },
  { 
    id: 'hospital-2', 
    title: 'North County Hospital', 
    subtitle: 'Specialty Hospital', 
    type: 'hospital', 
    icon: <HospitalIcon color="primary" />, 
    path: '/hospitals',
    details: 'Specialized in cardiology and neurology',
    tags: ['active']
  },
  
  // Patients
  { 
    id: 'patient-1', 
    title: 'John Smith', 
    subtitle: 'Patient #12345', 
    type: 'patient', 
    icon: <PatientIcon color="secondary" />, 
    path: '/patients',
    details: '45-year-old male, admitted on Jun 12, 2023',
    tags: ['emergency']
  },
  { 
    id: 'patient-2', 
    title: 'Sarah Johnson', 
    subtitle: 'Patient #67890', 
    type: 'patient', 
    icon: <PatientIcon color="secondary" />, 
    path: '/patients',
    details: '32-year-old female, routine checkup',
    tags: ['scheduled']
  },
  
  // Staff
  { 
    id: 'staff-1', 
    title: 'Dr. Emily Carter', 
    subtitle: 'Cardiologist', 
    type: 'staff', 
    icon: <StaffIcon color="info" />, 
    path: '/staff',
    details: 'Department of Cardiology, Central Hospital',
    tags: ['doctor', 'senior']
  },
  { 
    id: 'staff-2', 
    title: 'James Wilson', 
    subtitle: 'Nurse', 
    type: 'staff', 
    icon: <StaffIcon color="info" />, 
    path: '/staff',
    details: 'Emergency Department, North County Hospital',
    tags: ['nurse']
  },
  
  // Emergencies
  { 
    id: 'emergency-1', 
    title: 'Cardiac Arrest', 
    subtitle: 'Emergency #E-5678', 
    type: 'emergency', 
    icon: <EmergencyIcon color="error" />, 
    path: '/emergencies',
    details: 'Critical condition, Central Medical Center',
    tags: ['critical', 'active']
  },
  { 
    id: 'emergency-2', 
    title: 'Traffic Accident', 
    subtitle: 'Emergency #E-8901', 
    type: 'emergency', 
    icon: <EmergencyIcon color="error" />, 
    path: '/emergencies',
    details: 'Multiple injuries, en route to North County',
    tags: ['critical', 'active']
  },
  
  // Pages
  { 
    id: 'page-1', 
    title: 'Dashboard', 
    type: 'page', 
    icon: <DashboardIcon />, 
    path: '/',
    details: 'System overview and statistics'
  },
  { 
    id: 'page-2', 
    title: 'Hospital Map', 
    type: 'page', 
    icon: <HospitalIcon />, 
    path: '/map',
    details: 'Interactive map of all facilities'
  },
  
  // Documents
  { 
    id: 'doc-1', 
    title: 'Emergency Protocol', 
    subtitle: 'PDF Document', 
    type: 'document', 
    icon: <DocsIcon color="warning" />, 
    path: '/emergencies?tab=protocols',
    details: 'Standard procedures for cardiac emergencies',
    tags: ['protocol']
  },
  { 
    id: 'doc-2', 
    title: 'Staff Handbook', 
    subtitle: 'PDF Document', 
    type: 'document', 
    icon: <DocsIcon color="warning" />, 
    path: '/staff?document=handbook',
    details: 'Guidelines and policies for medical staff',
    tags: ['policy']
  },
];

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>(
    JSON.parse(localStorage.getItem('recentSearches') || '[]')
  );
  const [loading, setLoading] = useState(false);
  const [favoritedItems, setFavoritedItems] = useState<string[]>(
    JSON.parse(localStorage.getItem('favoritedSearchItems') || '[]')
  );

  // Filter types based on active tab
  const filterByActiveTab = (result: SearchResult): boolean => {
    if (activeTab === 0) return true; // All
    if (activeTab === 1) return result.type === 'hospital';
    if (activeTab === 2) return result.type === 'patient';
    if (activeTab === 3) return result.type === 'staff';
    if (activeTab === 4) return result.type === 'emergency';
    if (activeTab === 5) return result.type === 'page' || result.type === 'document';
    return true;
  };

  // Search function
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const fetchResults = () => {
      setLoading(true);
      // Simulating search delay
      setTimeout(() => {
        // Filter the search items based on the search term
        const results = searchItems.filter(item => {
          const matchesSearch = 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.details && item.details.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.tags && item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
          
          return matchesSearch && filterByActiveTab(item);
        });
        
        setSearchResults(results);
        setLoading(false);
      }, 300);
    };

    fetchResults();
  }, [searchTerm, activeTab]);

  // Save recent search when search is executed
  const saveRecentSearch = (term: string) => {
    if (term.trim() === '') return;
    
    // Add to recent searches, remove duplicates, and limit to 5 items
    const updatedRecentSearches = [
      term,
      ...recentSearches.filter(search => search !== term)
    ].slice(0, 5);
    
    setRecentSearches(updatedRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedRecentSearches));
  };

  // Handle search execution
  const handleSearch = () => {
    if (searchTerm.trim() === '') return;
    saveRecentSearch(searchTerm);
    // In a real app, this would trigger additional logic
  };

  // Navigate to item and close search
  const handleSelectResult = (result: SearchResult) => {
    saveRecentSearch(result.title);
    navigate(result.path);
    onClose();
  };

  // Execute search on Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Handle favoriting search items
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    let updated;
    if (favoritedItems.includes(id)) {
      updated = favoritedItems.filter(item => item !== id);
    } else {
      updated = [...favoritedItems, id];
    }
    
    setFavoritedItems(updated);
    localStorage.setItem('favoritedSearchItems', JSON.stringify(updated));
  };

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  // Use recent search
  const useRecentSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Get icon based on result type
  const getIconForType = (type: string): React.ReactNode => {
    switch (type) {
      case 'hospital': return <HospitalIcon color="primary" />;
      case 'patient': return <PatientIcon color="secondary" />;
      case 'staff': return <StaffIcon color="info" />;
      case 'emergency': return <EmergencyIcon color="error" />;
      case 'page': return <DashboardIcon />;
      case 'document': return <DocsIcon color="warning" />;
      default: return <SearchIcon />;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: alpha(theme.palette.primary.main, 0.05)
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SearchIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6">Global Search</Typography>
        </Box>
        <IconButton edge="end" color="inherit" onClick={onClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
        <TextField
          autoFocus
          margin="dense"
          placeholder="Search across MediSync..."
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton 
                  edge="end" 
                  onClick={() => setSearchTerm('')}
                  size="small"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ),
            sx: { 
              borderRadius: 2,
              bgcolor: 'background.paper'
            }
          }}
        />
      </Box>
      
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          px: 2
        }}
      >
        <Tab label="All" />
        <Tab label="Hospitals" />
        <Tab label="Patients" />
        <Tab label="Staff" />
        <Tab label="Emergencies" />
        <Tab label="Other" />
      </Tabs>
      
      <DialogContent sx={{ p: 0, height: '400px', overflow: 'auto' }}>
        {searchTerm === '' ? (
          <Box sx={{ p: 2 }}>
            {/* Recent searches */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Recent Searches
                </Typography>
                {recentSearches.length > 0 && (
                  <Button 
                    size="small" 
                    onClick={clearRecentSearches}
                    startIcon={<DeleteIcon fontSize="small" />}
                  >
                    Clear
                  </Button>
                )}
              </Box>
              
              {recentSearches.length > 0 ? (
                <List dense>
                  {recentSearches.map((search, index) => (
                    <ListItem 
                      key={index} 
                      button 
                      onClick={() => useRecentSearch(search)}
                      sx={{ 
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08)
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <HistoryIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={search}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                  No recent searches
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Trending searches */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Trending Now
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip 
                  icon={<TrendingIcon />} 
                  label="Emergency Protocols" 
                  onClick={() => useRecentSearch("Emergency Protocols")}
                  variant="outlined"
                  color="primary"
                  size="small"
                />
                <Chip 
                  icon={<TrendingIcon />} 
                  label="Cardiology Department" 
                  onClick={() => useRecentSearch("Cardiology Department")}
                  variant="outlined"
                  color="primary"
                  size="small"
                />
                <Chip 
                  icon={<TrendingIcon />} 
                  label="Staff Schedule" 
                  onClick={() => useRecentSearch("Staff Schedule")}
                  variant="outlined"
                  color="primary"
                  size="small"
                />
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                <CircularProgress size={40} />
              </Box>
            ) : searchResults.length > 0 ? (
              <List>
                {searchResults.map(result => (
                  <ListItem 
                    key={result.id} 
                    button 
                    onClick={() => handleSelectResult(result)}
                    sx={{ 
                      py: 1.5,
                      borderRadius: 0,
                      borderLeft: 3,
                      borderColor: 
                        result.type === 'hospital' ? 'primary.main' :
                        result.type === 'patient' ? 'secondary.main' :
                        result.type === 'staff' ? 'info.main' :
                        result.type === 'emergency' ? 'error.main' :
                        result.type === 'document' ? 'warning.main' :
                        'grey.400',
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                  >
                    <ListItemIcon>
                      {result.icon || getIconForType(result.type)}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={500}>
                          {result.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          {result.subtitle && (
                            <Typography variant="body2" color="text.secondary">
                              {result.subtitle}
                            </Typography>
                          )}
                          {result.details && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {result.details}
                            </Typography>
                          )}
                          {result.tags && result.tags.length > 0 && (
                            <Box sx={{ mt: 0.5 }}>
                              {result.tags.map(tag => (
                                <Chip 
                                  key={tag} 
                                  label={tag} 
                                  size="small" 
                                  variant="outlined"
                                  sx={{ mr: 0.5, fontSize: '0.7rem', height: 20 }}
                                />
                              ))}
                            </Box>
                          )}
                        </Box>
                      }
                    />
                    <IconButton 
                      edge="end" 
                      onClick={(e) => toggleFavorite(result.id, e)}
                      size="small"
                      color={favoritedItems.includes(result.id) ? "primary" : "default"}
                    >
                      <FavoriteIcon fontSize="small" />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No results found for "{searchTerm}"
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Try different keywords or browse categories
                </Typography>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={handleSearch}
          disabled={searchTerm.trim() === ''}
          startIcon={<SearchIcon />}
        >
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GlobalSearch; 