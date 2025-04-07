import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Collapse,
  Divider,
  TextField,
  InputAdornment,
  Tooltip,
  Button,
  FormControl,
  Select,
  MenuItem,
  Badge,
} from '@mui/material';
import {
  BugReport,
  Warning,
  Error as ErrorIcon,
  Info,
  KeyboardArrowDown,
  KeyboardArrowUp,
  Search,
  FilterList,
  ErrorOutline,
  Code,
  Refresh,
  Folder,
  FileDownload,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Mock error data
const mockErrors = [
  {
    id: 'ERR001',
    timestamp: '2025-04-07 11:23:45',
    type: 'Exception',
    message: 'NullPointerException in PatientDataProcessor',
    severity: 'Critical',
    component: 'Data Processing',
    file: 'PatientDataProcessor.java:127',
    stackTrace: `java.lang.NullPointerException: Cannot invoke "com.medisync.models.Patient.getId()" because "patient" is null
    at com.medisync.services.PatientDataProcessor.process(PatientDataProcessor.java:127)
    at com.medisync.controllers.PatientController.processData(PatientController.java:85)
    at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)`,
    resolved: false,
    occurrences: 17,
    lastOccurrence: '2025-04-07 11:23:45',
  },
  {
    id: 'ERR002',
    timestamp: '2025-04-07 10:45:32',
    type: 'API Error',
    message: 'Failed to connect to payment gateway API',
    severity: 'High',
    component: 'Payment Service',
    file: 'PaymentService.js:54',
    stackTrace: `TypeError: Cannot read properties of undefined (reading 'status')
    at PaymentService.processPayment (PaymentService.js:54:23)
    at async Function.handlePayment (PaymentController.js:32:12)`,
    resolved: false,
    occurrences: 8,
    lastOccurrence: '2025-04-07 10:45:32',
  },
  {
    id: 'ERR003',
    timestamp: '2025-04-07 09:15:19',
    type: 'Database Error',
    message: 'Timeout when querying patient records',
    severity: 'Medium',
    component: 'Database',
    file: 'PatientRepository.java:203',
    stackTrace: `java.sql.SQLTimeoutException: Statement timed out
    at com.medisync.repositories.PatientRepository.findByMedicalRecordNumber(PatientRepository.java:203)
    at com.medisync.services.PatientService.getPatientByMRN(PatientService.java:78)`,
    resolved: true,
    occurrences: 4,
    lastOccurrence: '2025-04-07 09:15:19',
  },
  {
    id: 'ERR004',
    timestamp: '2025-04-07 08:30:42',
    type: 'UI Error',
    message: 'Failed to render patient chart component',
    severity: 'Low',
    component: 'Frontend',
    file: 'PatientChart.tsx:156',
    stackTrace: `TypeError: Cannot read properties of null (reading 'data')
    at PatientChart (PatientChart.tsx:156)
    at renderWithHooks (react-dom.development.js:16305)`,
    resolved: false,
    occurrences: 12,
    lastOccurrence: '2025-04-07 08:30:42',
  },
  {
    id: 'ERR005',
    timestamp: '2025-04-06 23:12:07',
    type: 'Authentication Error',
    message: 'Invalid JWT token format',
    severity: 'High',
    component: 'Auth Service',
    file: 'JwtUtils.java:72',
    stackTrace: `io.jsonwebtoken.MalformedJwtException: JWT strings must contain exactly 2 period characters
    at io.jsonwebtoken.impl.DefaultJwtParser.parse(DefaultJwtParser.java:235)
    at io.jsonwebtoken.impl.DefaultJwtParser.parse(DefaultJwtParser.java:481)
    at io.jsonwebtoken.impl.DefaultJwtParser.parseClaimsJws(DefaultJwtParser.java:541)`,
    resolved: false,
    occurrences: 7,
    lastOccurrence: '2025-04-06 23:12:07',
  },
];

// Error Row component
const ErrorRow = ({ error }: { error: any }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  
  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return theme.palette.error.main;
      case 'High':
        return theme.palette.error.light;
      case 'Medium':
        return theme.palette.warning.main;
      case 'Low':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return <ErrorIcon fontSize="small" />;
      case 'High':
        return <Warning fontSize="small" />;
      case 'Medium':
        return <Warning fontSize="small" />;
      case 'Low':
        return <Info fontSize="small" />;
      default:
        return <Info fontSize="small" />;
    }
  };
  
  return (
    <>
      <TableRow 
        hover 
        onClick={() => setOpen(!open)}
        sx={{ 
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          },
          ...(open && {
            backgroundColor: alpha(theme.palette.primary.main, 0.05),
          }),
          ...(error.resolved && {
            opacity: 0.7,
            backgroundColor: alpha(theme.palette.success.main, 0.05),
          }),
        }}
      >
        <TableCell padding="checkbox">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ErrorOutline 
              fontSize="small" 
              sx={{ 
                mr: 1, 
                color: error.resolved ? theme.palette.success.main : getSeverityColor(error.severity) 
              }} 
            />
            <Typography variant="body2" fontWeight={500}>
              {error.id}
            </Typography>
          </Box>
        </TableCell>
        <TableCell>
          <Typography 
            variant="body2" 
            sx={{ 
              maxWidth: 300, 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis' 
            }}
          >
            {error.message}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            icon={getSeverityIcon(error.severity)}
            label={error.severity}
            size="small"
            sx={{
              backgroundColor: alpha(getSeverityColor(error.severity), 0.1),
              color: getSeverityColor(error.severity),
              fontWeight: 500,
              borderRadius: '4px',
            }}
          />
        </TableCell>
        <TableCell>{error.component}</TableCell>
        <TableCell align="center">
          <Chip
            label={error.occurrences}
            size="small"
            sx={{
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              fontWeight: 600,
            }}
          />
        </TableCell>
        <TableCell>{error.timestamp}</TableCell>
        <TableCell>
          <Chip
            label={error.resolved ? 'Resolved' : 'Active'}
            size="small"
            color={error.resolved ? 'success' : 'default'}
            sx={{
              fontWeight: 500,
              borderRadius: '4px',
            }}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight={500}>
                Error Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      File Location
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mt: 0.5,
                        p: 1,
                        borderRadius: 1,
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                      }}
                    >
                      <Folder fontSize="small" sx={{ mr: 1, color: theme.palette.primary.main }} />
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                        {error.file}
                      </Typography>
                    </Box>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Occurrence Information
                    </Typography>
                    <Box sx={{ display: 'flex', mt: 0.5 }}>
                      <Box sx={{ mr: 4 }}>
                        <Typography variant="caption" color="text.secondary">
                          First seen
                        </Typography>
                        <Typography variant="body2">
                          {error.timestamp}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Last seen
                        </Typography>
                        <Typography variant="body2">
                          {error.lastOccurrence}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Stack Trace
                  </Typography>
                  <Box
                    sx={{
                      p: 1.5,
                      mt: 0.5,
                      borderRadius: 1,
                      backgroundColor: theme.palette.mode === 'dark' ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.common.black, 0.05),
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      overflow: 'auto',
                      maxHeight: 200,
                      whiteSpace: 'pre-wrap',
                      position: 'relative',
                    }}
                  >
                    <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                      <Tooltip title="Copy stack trace">
                        <IconButton size="small">
                          <Code fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    {error.stackTrace}
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={error.resolved ? <BugReport /> : <Refresh />}
                      color={error.resolved ? 'warning' : 'success'}
                      sx={{ mr: 1 }}
                    >
                      {error.resolved ? 'Reopen Issue' : 'Mark as Resolved'}
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                    >
                      View Full Report
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const ErrorTracking: React.FC = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Error summary data
  const errorSummary = {
    total: 48,
    critical: 17,
    high: 8,
    medium: 15,
    low: 8,
    resolved: 12,
  };

  return (
    <Box sx={{ height: '100%' }}>
      {/* Error Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={4} md={2}>
          <Card 
            sx={{ 
              borderRadius: 2, 
              border: `1px solid ${alpha(theme.palette.grey[500], 0.1)}`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
            }}
          >
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="caption" color="text.secondary">Total Errors</Typography>
              <Typography variant="h5" fontWeight={600}>{errorSummary.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={4} md={2}>
          <Card 
            sx={{ 
              borderRadius: 2, 
              border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.error.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="caption" sx={{ color: theme.palette.error.main }}>
                Critical
              </Typography>
              <Typography variant="h5" fontWeight={600} sx={{ color: theme.palette.error.main }}>
                {errorSummary.critical}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={4} md={2}>
          <Card 
            sx={{ 
              borderRadius: 2, 
              border: `1px solid ${alpha(theme.palette.error.light, 0.1)}`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.error.light, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="caption" sx={{ color: theme.palette.error.light }}>
                High
              </Typography>
              <Typography variant="h5" fontWeight={600} sx={{ color: theme.palette.error.light }}>
                {errorSummary.high}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={4} md={2}>
          <Card 
            sx={{ 
              borderRadius: 2, 
              border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.warning.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="caption" sx={{ color: theme.palette.warning.main }}>
                Medium
              </Typography>
              <Typography variant="h5" fontWeight={600} sx={{ color: theme.palette.warning.main }}>
                {errorSummary.medium}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={4} md={2}>
          <Card 
            sx={{ 
              borderRadius: 2, 
              border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.info.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="caption" sx={{ color: theme.palette.info.main }}>
                Low
              </Typography>
              <Typography variant="h5" fontWeight={600} sx={{ color: theme.palette.info.main }}>
                {errorSummary.low}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={6} sm={4} md={2}>
          <Card 
            sx={{ 
              borderRadius: 2, 
              border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              boxShadow: `0 4px 12px ${alpha(theme.palette.success.main, 0.1)}`,
            }}
          >
            <CardContent sx={{ p: 1.5 }}>
              <Typography variant="caption" sx={{ color: theme.palette.success.main }}>
                Resolved
              </Typography>
              <Typography variant="h5" fontWeight={600} sx={{ color: theme.palette.success.main }}>
                {errorSummary.resolved}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Error List */}
      <Card 
        sx={{ 
          borderRadius: 2,
          boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
        }}
      >
        <CardContent sx={{ p: 0 }}>
          {/* Toolbar */}
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
            <Typography variant="h6" fontWeight={600}>Error Log</Typography>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Search errors..."
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '8px' }
                }}
                sx={{ width: { xs: '100%', sm: 220 } }}
              />
              
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  displayEmpty
                  startAdornment={<FilterList fontSize="small" sx={{ mr: 1, color: theme.palette.action.active }} />}
                  sx={{ borderRadius: '8px' }}
                >
                  <MenuItem value="all">All Errors</MenuItem>
                  <MenuItem value="active">Active Only</MenuItem>
                  <MenuItem value="resolved">Resolved Only</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
              
              <Button 
                variant="text" 
                startIcon={<FileDownload />}
                sx={{ color: theme.palette.primary.main }}
              >
                Export
              </Button>
            </Box>
          </Box>
          
          <Divider />
          
          {/* Table */}
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" />
                  <TableCell>ID</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Component</TableCell>
                  <TableCell align="center">Count</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {mockErrors.map((error) => (
                  <ErrorRow key={error.id} error={error} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ErrorTracking; 