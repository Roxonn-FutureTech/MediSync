import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Chip,
  Grid,
  Tooltip,
  IconButton,
  useMediaQuery,
  Menu,
  MenuItem,
  Drawer,
  Fab,
  Badge,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  LocalHospital as LocalHospitalIcon,
  DirectionsRun as DirectionsRunIcon,
  Coronavirus as CoronavirusIcon,
  MeetingRoom as MeetingRoomIcon,
  Assignment as AssignmentIcon,
  Print as PrintIcon,
  GetApp as GetAppIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  Share as ShareIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Healing as HealingIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

// Protocol checklist item interface
interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  critical: boolean;
}

// Protocol interface
interface Protocol {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  category: string;
  status: 'active' | 'under-review' | 'archived';
  lastUpdated: string;
  checklist: ChecklistItem[];
  resources?: {
    title: string;
    link: string;
    type: 'pdf' | 'video' | 'form' | 'contact';
  }[];
}

const protocolsData: Protocol[] = [
  {
    id: 'card-001',
    title: 'Cardiac Arrest Response',
    icon: <LocalHospitalIcon />,
    description: 'Standard protocol for responding to cardiac arrest emergencies.',
    category: 'medical',
    status: 'active',
    lastUpdated: 'June 15, 2023',
    checklist: [
      { id: 'card-001-1', text: 'Assess scene safety and use appropriate PPE', completed: false, critical: true },
      { id: 'card-001-2', text: 'Check consciousness and breathing', completed: false, critical: true },
      { id: 'card-001-3', text: 'Call for additional support/ALS', completed: false, critical: true },
      { id: 'card-001-4', text: 'Begin chest compressions immediately', completed: false, critical: true },
      { id: 'card-001-5', text: 'Attach AED/defibrillator as soon as available', completed: false, critical: true },
      { id: 'card-001-6', text: 'Follow AED prompts if shock advised', completed: false, critical: true },
      { id: 'card-001-7', text: 'Establish IV/IO access', completed: false, critical: false },
      { id: 'card-001-8', text: 'Administer epinephrine 1mg IV/IO every 3-5 minutes', completed: false, critical: false },
      { id: 'card-001-9', text: 'Consider advanced airway management', completed: false, critical: false },
      { id: 'card-001-10', text: 'Document timing of interventions and medications', completed: false, critical: false },
    ],
    resources: [
      { title: 'AHA Cardiac Arrest Algorithm', link: '/resources/aha-cardiac-algorithm.pdf', type: 'pdf' },
      { title: 'Cardiac Medication Guide', link: '/resources/cardiac-medications.pdf', type: 'pdf' },
      { title: 'CPR Refresher Video', link: '/resources/cpr-refresher.mp4', type: 'video' },
      { title: 'Cardiology Specialist On-Call', link: 'tel:+15551234567', type: 'contact' },
    ]
  },
  {
    id: 'strok-001',
    title: 'Stroke Assessment Protocol',
    icon: <HealingIcon />,
    description: 'Protocol for rapid assessment and management of suspected stroke.',
    category: 'medical',
    status: 'active',
    lastUpdated: 'April 28, 2023',
    checklist: [
      { id: 'strok-001-1', text: 'Establish time of symptom onset (when last known well)', completed: false, critical: true },
      { id: 'strok-001-2', text: 'Perform FAST assessment (Face, Arms, Speech, Time)', completed: false, critical: true },
      { id: 'strok-001-3', text: 'Check vital signs and blood glucose', completed: false, critical: true },
      { id: 'strok-001-4', text: 'Establish IV access', completed: false, critical: false },
      { id: 'strok-001-5', text: 'Notify receiving stroke center', completed: false, critical: true },
      { id: 'strok-001-6', text: 'Provide pre-notification with estimated arrival time', completed: false, critical: true },
      { id: 'strok-001-7', text: 'Transport rapidly to appropriate stroke center', completed: false, critical: true },
      { id: 'strok-001-8', text: 'Complete stroke severity scale (if trained)', completed: false, critical: false },
    ],
    resources: [
      { title: 'Stroke Assessment Guide', link: '/resources/stroke-assessment.pdf', type: 'pdf' },
      { title: 'Local Stroke Center Map', link: '/resources/stroke-centers.pdf', type: 'pdf' },
      { title: 'Stroke Scale Tutorial', link: '/resources/stroke-scale.mp4', type: 'video' },
    ]
  },
  {
    id: 'trau-001',
    title: 'Major Trauma Response',
    icon: <DirectionsRunIcon />,
    description: 'Guidelines for managing patients with significant traumatic injuries.',
    category: 'trauma',
    status: 'active',
    lastUpdated: 'May 10, 2023',
    checklist: [
      { id: 'trau-001-1', text: 'Ensure scene safety and personal protection', completed: false, critical: true },
      { id: 'trau-001-2', text: 'Assess and manage catastrophic hemorrhage', completed: false, critical: true },
      { id: 'trau-001-3', text: 'Assess airway patency and cervical spine', completed: false, critical: true },
      { id: 'trau-001-4', text: 'Assess breathing adequacy and chest injuries', completed: false, critical: true },
      { id: 'trau-001-5', text: 'Assess circulation and control external bleeding', completed: false, critical: true },
      { id: 'trau-001-6', text: 'Assess disability (neurological status)', completed: false, critical: false },
      { id: 'trau-001-7', text: 'Expose patient and protect from environment', completed: false, critical: false },
      { id: 'trau-001-8', text: 'Transport to appropriate trauma center', completed: false, critical: true },
      { id: 'trau-001-9', text: 'Provide trauma team pre-notification', completed: false, critical: true },
    ],
    resources: [
      { title: 'Trauma Triage Guidelines', link: '/resources/trauma-triage.pdf', type: 'pdf' },
      { title: 'Tourniquet Application Demo', link: '/resources/tourniquet-demo.mp4', type: 'video' },
      { title: 'Trauma Center Contact List', link: '/resources/trauma-contacts.pdf', type: 'pdf' },
    ]
  },
  {
    id: 'inf-001',
    title: 'Infectious Disease Precautions',
    icon: <CoronavirusIcon />,
    description: 'Protocol for responding to suspected infectious disease cases.',
    category: 'safety',
    status: 'active',
    lastUpdated: 'March 12, 2023',
    checklist: [
      { id: 'inf-001-1', text: 'Screen for infectious disease risk factors', completed: false, critical: true },
      { id: 'inf-001-2', text: 'Don appropriate PPE based on suspected pathogen', completed: false, critical: true },
      { id: 'inf-001-3', text: 'Limit personnel exposure during assessment', completed: false, critical: true },
      { id: 'inf-001-4', text: 'Notify receiving facility of potential infectious case', completed: false, critical: true },
      { id: 'inf-001-5', text: 'Follow specific isolation procedures during transport', completed: false, critical: true },
      { id: 'inf-001-6', text: 'Properly doff and dispose of PPE after transfer', completed: false, critical: true },
      { id: 'inf-001-7', text: 'Document all personnel with patient contact', completed: false, critical: false },
      { id: 'inf-001-8', text: 'Complete vehicle and equipment decontamination', completed: false, critical: true },
    ],
    resources: [
      { title: 'PPE Donning & Doffing Guide', link: '/resources/ppe-guide.pdf', type: 'pdf' },
      { title: 'Decontamination Procedures', link: '/resources/decontamination.pdf', type: 'pdf' },
      { title: 'Infectious Disease Control Officer', link: 'tel:+15559876543', type: 'contact' },
    ]
  },
  {
    id: 'mass-001',
    title: 'Mass Casualty Incident (MCI) Response',
    icon: <GroupIcon />,
    description: 'Procedures for managing incidents with multiple patients/casualties.',
    category: 'disaster',
    status: 'active',
    lastUpdated: 'January 5, 2023',
    checklist: [
      { id: 'mass-001-1', text: 'Establish incident command', completed: false, critical: true },
      { id: 'mass-001-2', text: 'Request additional resources as needed', completed: false, critical: true },
      { id: 'mass-001-3', text: 'Set up triage, treatment, and transport areas', completed: false, critical: true },
      { id: 'mass-001-4', text: 'Begin initial triage using START method', completed: false, critical: true },
      { id: 'mass-001-5', text: 'Assign roles to arriving personnel', completed: false, critical: true },
      { id: 'mass-001-6', text: 'Establish communication with receiving facilities', completed: false, critical: true },
      { id: 'mass-001-7', text: 'Track patient distribution to hospitals', completed: false, critical: false },
      { id: 'mass-001-8', text: 'Document patient information and destination', completed: false, critical: false },
      { id: 'mass-001-9', text: 'Provide regular updates to command', completed: false, critical: false },
      { id: 'mass-001-10', text: 'Participate in incident debriefing', completed: false, critical: false },
    ],
    resources: [
      { title: 'MCI Field Operations Guide', link: '/resources/mci-guide.pdf', type: 'pdf' },
      { title: 'START Triage Algorithm', link: '/resources/start-triage.pdf', type: 'pdf' },
      { title: 'Regional Hospital Capacity Portal', link: '/resources/hospital-capacity.pdf', type: 'form' },
      { title: 'Emergency Operations Center', link: 'tel:+15552345678', type: 'contact' },
    ]
  },
];

const EmergencyProtocols: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const [activeProtocol, setActiveProtocol] = useState<Protocol | null>(null);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [categoryMenuAnchor, setCategoryMenuAnchor] = useState<null | HTMLElement>(null);
  const [completedItems, setCompletedItems] = useState(0);

  useEffect(() => {
    // Update completed items count whenever checklist changes
    if (checklist.length > 0) {
      setCompletedItems(checklist.filter(item => item.completed).length);
    } else {
      setCompletedItems(0);
    }
  }, [checklist]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProtocolSelect = (protocol: Protocol) => {
    setActiveProtocol(protocol);
    setChecklist([...protocol.checklist]);
    
    // Close mobile drawer after selection on mobile
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const handleChecklistItemToggle = (id: string) => {
    setChecklist(
      checklist.map(item => 
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const resetChecklist = () => {
    if (activeProtocol) {
      setChecklist(activeProtocol.checklist.map(item => ({ ...item, completed: false })));
    }
  };

  const handleCategoryMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setCategoryMenuAnchor(event.currentTarget);
  };

  const handleCategoryMenuClose = () => {
    setCategoryMenuAnchor(null);
  };

  const handleCategorySelect = (category: string | null) => {
    setCategoryFilter(category);
    handleCategoryMenuClose();
  };

  const toggleMobileDrawer = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const filteredProtocols = categoryFilter 
    ? protocolsData.filter(protocol => protocol.category === categoryFilter)
    : protocolsData;

  const categoryLabels: Record<string, string> = {
    'medical': 'Medical Emergencies',
    'trauma': 'Trauma Management',
    'safety': 'Safety Protocols',
    'disaster': 'Disaster Response',
  };

  const renderProtocolList = () => (
    <Box sx={{ px: isMobile ? 1 : 2 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, px: 1 }}>
        Available Protocols {filteredProtocols.length > 0 && `(${filteredProtocols.length})`}
      </Typography>
      
      <List sx={{ width: '100%', p: 0 }}>
        {filteredProtocols.map((protocol) => (
          <Paper
            key={protocol.id}
            elevation={0}
            className="emergency-protocol-card"
            sx={{ 
              mb: 1.5, 
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              bgcolor: activeProtocol?.id === protocol.id ? alpha(theme.palette.primary.main, 0.08) : 'transparent',
              '&:hover': {
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              },
            }}
          >
            <ListItem 
              button 
              onClick={() => handleProtocolSelect(protocol)}
              sx={{ borderRadius: 2 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Box sx={{ 
                  p: 0.75, 
                  borderRadius: '50%', 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {protocol.icon}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="body2" fontWeight={600} className="emergency-protocol-header">
                    {protocol.title}
                  </Typography>
                }
                secondary={
                  <Typography variant="caption" color="text.secondary">
                    Last updated: {protocol.lastUpdated}
                  </Typography>
                }
              />
              <Chip 
                label={protocol.status === 'active' ? 'Active' : protocol.status === 'under-review' ? 'Review' : 'Archived'} 
                size="small"
                className="emergency-status-badge"
                color={protocol.status === 'active' ? 'success' : protocol.status === 'under-review' ? 'warning' : 'default'}
                sx={{ height: 24, fontSize: '0.7rem' }}
              />
            </ListItem>
          </Paper>
        ))}

        {filteredProtocols.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              No protocols found for this filter
            </Typography>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={() => setCategoryFilter(null)}
              sx={{ mt: 1, borderRadius: 2 }}
            >
              Clear Filters
            </Button>
          </Box>
        )}
      </List>
    </Box>
  );

  const renderCategoryFilters = () => (
    <>
      {!isMobile && (
        <Box sx={{ mt: 2, px: 2 }}>
          <Button
            fullWidth
            variant={categoryFilter === null ? "contained" : "outlined"}
            onClick={() => setCategoryFilter(null)}
            sx={{ mb: 1, justifyContent: 'flex-start', borderRadius: 2 }}
          >
            All Protocols
          </Button>
          <Button
            fullWidth
            variant={categoryFilter === 'medical' ? "contained" : "outlined"}
            startIcon={<LocalHospitalIcon />}
            onClick={() => setCategoryFilter('medical')}
            sx={{ mb: 1, justifyContent: 'flex-start', borderRadius: 2 }}
          >
            Medical Emergencies
          </Button>
          <Button
            fullWidth
            variant={categoryFilter === 'trauma' ? "contained" : "outlined"}
            startIcon={<DirectionsRunIcon />}
            onClick={() => setCategoryFilter('trauma')}
            sx={{ mb: 1, justifyContent: 'flex-start', borderRadius: 2 }}
          >
            Trauma Management
          </Button>
          <Button
            fullWidth
            variant={categoryFilter === 'safety' ? "contained" : "outlined"}
            startIcon={<WarningIcon />}
            onClick={() => setCategoryFilter('safety')}
            sx={{ mb: 1, justifyContent: 'flex-start', borderRadius: 2 }}
          >
            Safety Protocols
          </Button>
          <Button
            fullWidth
            variant={categoryFilter === 'disaster' ? "contained" : "outlined"}
            startIcon={<GroupIcon />}
            onClick={() => setCategoryFilter('disaster')}
            sx={{ mb: 1, justifyContent: 'flex-start', borderRadius: 2 }}
          >
            Disaster Response
          </Button>
        </Box>
      )}

      {isMobile && (
        <Box sx={{ px: 2, mb: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleCategoryMenuOpen}
            sx={{ borderRadius: 2, justifyContent: 'space-between' }}
            endIcon={<Box sx={{ ml: 1 }}>{categoryFilter ? categoryLabels[categoryFilter] : 'All Protocols'}</Box>}
          >
            Filter
          </Button>
          <Menu
            anchorEl={categoryMenuAnchor}
            open={Boolean(categoryMenuAnchor)}
            onClose={handleCategoryMenuClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem 
              onClick={() => handleCategorySelect(null)}
              selected={categoryFilter === null}
              sx={{ minWidth: 200 }}
            >
              All Protocols
            </MenuItem>
            <MenuItem 
              onClick={() => handleCategorySelect('medical')}
              selected={categoryFilter === 'medical'}
              sx={{ minWidth: 200 }}
            >
              <LocalHospitalIcon fontSize="small" sx={{ mr: 1 }} /> Medical Emergencies
            </MenuItem>
            <MenuItem 
              onClick={() => handleCategorySelect('trauma')}
              selected={categoryFilter === 'trauma'}
              sx={{ minWidth: 200 }}
            >
              <DirectionsRunIcon fontSize="small" sx={{ mr: 1 }} /> Trauma Management
            </MenuItem>
            <MenuItem 
              onClick={() => handleCategorySelect('safety')}
              selected={categoryFilter === 'safety'}
              sx={{ minWidth: 200 }}
            >
              <WarningIcon fontSize="small" sx={{ mr: 1 }} /> Safety Protocols
            </MenuItem>
            <MenuItem 
              onClick={() => handleCategorySelect('disaster')}
              selected={categoryFilter === 'disaster'}
              sx={{ minWidth: 200 }}
            >
              <GroupIcon fontSize="small" sx={{ mr: 1 }} /> Disaster Response
            </MenuItem>
          </Menu>
        </Box>
      )}
    </>
  );

  return (
    <Box sx={{ height: '100%' }}>
      {/* Mobile Protocol Selector Drawer */}
      {isMobile && (
        <>
          <Drawer
            anchor="left"
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            PaperProps={{
              sx: { 
                width: '85%', 
                maxWidth: 320,
                borderRadius: '0 16px 16px 0',
              }
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              p: 2,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}>
              <Typography variant="h6" fontWeight={600}>
                Protocols Library
              </Typography>
              <IconButton onClick={() => setMobileDrawerOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            {renderCategoryFilters()}
            <Divider sx={{ my: 1 }} />
            {renderProtocolList()}
          </Drawer>

          {/* Show floating action button when protocol is selected */}
          {activeProtocol && (
            <Fab 
              color="primary" 
              size="medium"
              aria-label="protocols"
              onClick={toggleMobileDrawer}
              className="emergency-fab"
              sx={{ 
                position: 'fixed', 
                bottom: 16, 
                left: 16, 
                zIndex: 1200,
                boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
              }}
            >
              <Badge 
                badgeContent={completedItems}
                color="secondary"
                max={99}
                overlap="circular"
              >
                <MenuIcon />
              </Badge>
            </Fab>
          )}
        </>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper 
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.light, 0.02)} 100%)`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.08)}`,
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon sx={{ color: theme.palette.primary.main, mr: 1.5, fontSize: 28 }} />
                <Typography variant="h5" fontWeight={600} sx={{ fontSize: { xs: '1.125rem', sm: '1.25rem' } }}>
                  Emergency Response Protocols
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {!isSmall && (
                  <Button 
                    variant="outlined" 
                    startIcon={<GetAppIcon />}
                    size="small"
                    sx={{ borderRadius: 2 }}
                  >
                    Export
                  </Button>
                )}
                <Button 
                  variant="contained" 
                  startIcon={isSmall ? null : <PrintIcon />}
                  size="small"
                  sx={{ borderRadius: 2 }}
                >
                  {isSmall ? <PrintIcon /> : 'Print'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {!isMobile && (
          <Grid item xs={12} md={4} lg={3}>
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 2,
                boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                height: '100%',
                pb: 2,
              }}
            >
              <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}` }}>
                <Typography variant="h6" fontWeight={600}>
                  Protocol Categories
                </Typography>
              </Box>
              
              {renderCategoryFilters()}
              
              <Divider sx={{ my: 2 }} />
              
              {renderProtocolList()}
            </Paper>
          </Grid>
        )}

        <Grid item xs={12} md={isMobile ? 12 : 8} lg={isMobile ? 12 : 9}>
          {activeProtocol ? (
            <Paper 
              elevation={0}
              sx={{ 
                borderRadius: 2,
                boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                height: '100%',
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant={isMobile ? "fullWidth" : "standard"}
                  sx={{ 
                    px: isMobile ? 1 : 2, 
                    '& .MuiTab-root': { 
                      minHeight: isMobile ? 48 : 54, 
                      fontWeight: 600, 
                      py: isMobile ? 1 : 1.5,
                      fontSize: isMobile ? '0.8rem' : '0.875rem'
                    }
                  }}
                >
                  <Tab label="Protocol Checklist" />
                  <Tab label="Resources" />
                </Tabs>
              </Box>

              <Box sx={{ p: { xs: 2, sm: 3 } }}>
                {activeTab === 0 && (
                  <Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: { xs: 'stretch', sm: 'flex-start' },
                      mb: 3,
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 2, sm: 0 }
                    }}>
                      <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          {isMobile && (
                            <IconButton 
                              edge="start" 
                              color="primary" 
                              sx={{ ml: -1, mr: 1 }}
                              onClick={toggleMobileDrawer}
                            >
                              <MenuIcon />
                            </IconButton>
                          )}
                          <Typography variant="h6" fontWeight={600}>
                            {activeProtocol.title}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }} className="emergency-protocol-description">
                          {activeProtocol.description}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={`${completedItems}/${checklist.length}`}
                          color="primary"
                          variant="outlined"
                          sx={{ height: 32, fontWeight: 600 }}
                        />
                        <Button 
                          variant="outlined" 
                          onClick={resetChecklist}
                          className="emergency-action-button emergency-protocol-button"
                          sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}
                          size={isMobile ? "small" : "medium"}
                        >
                          Reset Checklist
                        </Button>
                      </Box>
                    </Box>

                    <Box 
                      sx={{ 
                        p: 1.5, 
                        mb: 3, 
                        borderRadius: 2, 
                        bgcolor: alpha(theme.palette.warning.light, 0.1),
                        border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <InfoIcon sx={{ color: theme.palette.warning.main, mr: 1.5 }} />
                      <Typography variant="body2" color="text.secondary">
                        Items marked with <strong>*</strong> are critical steps and must not be skipped.
                      </Typography>
                    </Box>
                    
                    <List sx={{ width: '100%' }}>
                      {checklist.map((item) => (
                        <Box key={item.id}>
                          <ListItem
                            className={`emergency-protocol-checklist-item ${item.critical ? 'emergency-critical-item' : ''}`}
                            sx={{ 
                              py: 1.5,
                              borderLeft: item.critical ? `4px solid ${theme.palette.error.main}` : 'none',
                              pl: item.critical ? 1.5 : 2,
                              borderRadius: 1,
                              bgcolor: item.completed ? alpha(theme.palette.success.main, 0.05) : 'transparent',
                              mb: 1,
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 40 }}>
                              <IconButton
                                edge="start"
                                onClick={() => handleChecklistItemToggle(item.id)}
                                className="emergency-haptic-indicator"
                                sx={{ 
                                  color: item.completed ? theme.palette.success.main : theme.palette.text.secondary,
                                }}
                              >
                                {item.completed ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                              </IconButton>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    textDecoration: item.completed ? 'line-through' : 'none',
                                    color: item.completed ? 'text.secondary' : 'text.primary',
                                    fontWeight: item.critical ? 600 : 400,
                                    fontSize: isMobile ? '0.875rem' : '1rem'
                                  }}
                                >
                                  {item.text} {item.critical && <span className="emergency-critical-marker" style={{ color: theme.palette.error.main }}>*</span>}
                                </Typography>
                              }
                            />
                          </ListItem>
                          <Divider variant="inset" component="li" />
                        </Box>
                      ))}
                    </List>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      mt: 3, 
                      flexDirection: isMobile ? 'column' : 'row',
                      gap: isMobile ? 1 : 0,
                      fontSize: '0.75rem'
                    }}>
                      <Typography variant="body2" color="text.secondary">
                        Protocol ID: {activeProtocol.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Last Updated: {activeProtocol.lastUpdated}
                      </Typography>
                    </Box>
                  </Box>
                )}

                {activeTab === 1 && activeProtocol.resources && (
                  <Box>
                    <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                      Resources & References
                    </Typography>
                    
                    <Grid container spacing={2}>
                      {activeProtocol.resources.map((resource, index) => (
                        <Grid item xs={12} sm={6} md={isMobile ? 6 : 4} key={index}>
                          <Paper
                            elevation={0}
                            sx={{ 
                              p: 2, 
                              borderRadius: 2,
                              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                              height: '100%',
                              '&:hover': {
                                boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                              },
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', height: '100%' }}>
                              <Box 
                                sx={{ 
                                  mr: 1.5,
                                  mt: 0.5,
                                  bgcolor: 
                                    resource.type === 'pdf' ? alpha(theme.palette.error.main, 0.1) :
                                    resource.type === 'video' ? alpha(theme.palette.primary.main, 0.1) :
                                    resource.type === 'form' ? alpha(theme.palette.warning.main, 0.1) :
                                    alpha(theme.palette.success.main, 0.1),
                                  color:
                                    resource.type === 'pdf' ? theme.palette.error.main :
                                    resource.type === 'video' ? theme.palette.primary.main :
                                    resource.type === 'form' ? theme.palette.warning.main :
                                    theme.palette.success.main,
                                  p: 1,
                                  borderRadius: 1,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                {resource.type === 'pdf' && <GetAppIcon />}
                                {resource.type === 'video' && <PlayCircleOutlineIcon />}
                                {resource.type === 'form' && <AssignmentIcon />}
                                {resource.type === 'contact' && <PersonIcon />}
                              </Box>
                              <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                                <Typography variant="body2" fontWeight={600}>
                                  {resource.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                                  {resource.type === 'pdf' && 'PDF Document'}
                                  {resource.type === 'video' && 'Video Tutorial'}
                                  {resource.type === 'form' && 'Interactive Form'}
                                  {resource.type === 'contact' && 'Emergency Contact'}
                                </Typography>
                                <Button
                                  variant="outlined"
                                  size="small"
                                  href={resource.link}
                                  target={resource.type !== 'contact' ? '_blank' : '_self'}
                                  sx={{ 
                                    mt: 'auto', 
                                    borderRadius: 1,
                                    fontSize: '0.75rem',
                                    whiteSpace: 'nowrap'
                                  }}
                                >
                                  {resource.type === 'contact' ? 'Call Now' : 'Open'}
                                </Button>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Box>
            </Paper>
          ) : (
            <>
              {/* Mobile view: show just the filters and list */}
              {isMobile && (
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                    height: '100%',
                    pb: 2,
                  }}
                >
                  {renderCategoryFilters()}
                  <Divider sx={{ mb: 2 }} />
                  {renderProtocolList()}
                </Paper>
              )}

              {/* Desktop empty state */}
              {!isMobile && (
                <Paper 
                  elevation={0}
                  sx={{ 
                    borderRadius: 2,
                    boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    p: 4,
                  }}
                >
                  <AssignmentIcon sx={{ fontSize: 60, color: alpha(theme.palette.text.secondary, 0.3), mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Select a Protocol
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 400 }}>
                    Choose an emergency protocol from the list to view detailed steps, checklists, and resources.
                  </Typography>
                </Paper>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default EmergencyProtocols; 