import { FC, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  InputAdornment,
  Slider,
  Chip,
  Autocomplete,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Close as CloseIcon,
  Add as AddIcon,
  PhotoCamera as CameraIcon,
  LocationOn as LocationIcon,
  PictureAsPdf as PdfIcon,
  AttachFile as FileIcon,
} from '@mui/icons-material';
import { Hospital } from '../HospitalDashboard';

interface AddHospitalDialogProps {
  open: boolean;
  onClose: () => void;
  onAddHospital: (hospital: Partial<Hospital>) => void;
}

// Available hospital types for selection
const hospitalTypes = [
  'General Hospital', 
  'Specialty Hospital', 
  'Teaching Hospital', 
  'Clinic', 
  'Trauma Center',
  'Rehabilitation Center',
  'Mental Health Facility',
  'Children\'s Hospital'
];

// Available medical services for autocomplete
const medicalServices = [
  'Emergency Care',
  'Intensive Care',
  'Surgery',
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Oncology',
  'Pediatrics',
  'Obstetrics & Gynecology',
  'Radiology',
  'Laboratory Services',
  'Physical Therapy',
  'Mental Health Services',
  'Dental Care',
  'Ophthalmology',
  'Dermatology',
  'Urology',
  'ENT'
];

const AddHospitalDialog: FC<AddHospitalDialogProps> = ({ open, onClose, onAddHospital }) => {
  const theme = useTheme();
  const [formData, setFormData] = useState<Partial<Hospital>>({
    name: '',
    address: '',
    phone: '',
    email: '',
    type: '',
    status: 'active',
    distance: 0,
    image: '',
    stats: {
      availableBeds: 0,
      occupancyRate: 0,
      emergencyCapacity: 0
    },
    services: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState(false);
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = 'Hospital name is required';
    }
    
    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.type) {
      newErrors.type = 'Hospital type is required';
    }
    
    if (!formData.stats?.availableBeds) {
      newErrors['stats.availableBeds'] = 'Available beds count is required';
    } else if (formData.stats.availableBeds < 0) {
      newErrors['stats.availableBeds'] = 'Available beds must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      // Add an ID and other missing properties
      const newHospital: Partial<Hospital> = {
        ...formData,
        id: `hospital-${Date.now()}`,
        lastUpdated: new Date().toLocaleString(),
        rating: 4.5,
        reviewCount: 0,
        website: formData.website || `https://www.${formData.name?.toLowerCase().replace(/\s+/g, '')}.com`,
        image: formData.image || 'https://via.placeholder.com/400x200?text=Hospital'
      };
      
      onAddHospital(newHospital);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        type: '',
        status: 'active',
        distance: 0,
        image: '',
        stats: {
          availableBeds: 0,
          occupancyRate: 0,
          emergencyCapacity: 0
        },
        services: []
      });
      setErrors({});
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is corrected
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is corrected
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10);
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: isNaN(numValue) ? 0 : numValue
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue
      }));
    }
    
    // Clear error when field is corrected
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSliderChange = (name: string) => (e: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData(prev => ({
          ...prev,
          [parent]: {
            ...prev[parent as keyof typeof prev],
            [child]: newValue
          }
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: newValue
        }));
      }
    }
  };
  
  const handleFileUpload = () => {
    setUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        image: 'https://via.placeholder.com/400x200?text=Hospital'
      }));
      setUploading(false);
    }, 1500);
  };
  
  const handleServicesChange = (event: any, newValue: string[]) => {
    setFormData(prev => ({
      ...prev,
      services: newValue
    }));
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
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
          justifyContent: 'space-between', 
          alignItems: 'center',
          bgcolor: alpha(theme.palette.primary.main, 0.05)
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AddIcon color="primary" />
          <Typography variant="h6">Add New Hospital</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography 
              variant="subtitle1" 
              fontWeight="medium" 
              color="primary" 
              gutterBottom
            >
              Basic Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Hospital Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.type} required>
              <InputLabel id="hospital-type-label">Hospital Type</InputLabel>
              <Select
                labelId="hospital-type-label"
                id="hospital-type"
                name="type"
                value={formData.type}
                onChange={handleSelectChange}
                label="Hospital Type"
              >
                {hospitalTypes.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
              {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              required
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              error={!!errors.address}
              helperText={errors.address}
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small">
                      <LocationIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              required
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={!!errors.phone}
              helperText={errors.phone}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              variant="outlined"
              placeholder="https://www.example.com"
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="hospital-status-label">Status</InputLabel>
              <Select
                labelId="hospital-status-label"
                id="hospital-status"
                name="status"
                value={formData.status}
                onChange={handleSelectChange}
                label="Status"
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="limited">Limited</MenuItem>
                <MenuItem value="full">Full</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography 
              variant="subtitle1" 
              fontWeight="medium" 
              color="primary" 
              gutterBottom
              sx={{ mt: 2 }}
            >
              Hospital Capacity Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              required
              type="number"
              label="Available Beds"
              name="stats.availableBeds"
              value={formData.stats?.availableBeds || ''}
              onChange={handleNumberInputChange}
              error={!!errors['stats.availableBeds']}
              helperText={errors['stats.availableBeds']}
              variant="outlined"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Occupancy Rate: {formData.stats?.occupancyRate || 0}%
              </Typography>
              <Slider
                value={formData.stats?.occupancyRate || 0}
                onChange={handleSliderChange('stats.occupancyRate')}
                aria-label="Occupancy Rate"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={100}
                sx={{
                  color: 
                    (formData.stats?.occupancyRate || 0) > 90 
                      ? theme.palette.error.main 
                      : (formData.stats?.occupancyRate || 0) > 70 
                        ? theme.palette.warning.main 
                        : theme.palette.success.main
                }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Emergency Capacity: {formData.stats?.emergencyCapacity || 0}%
              </Typography>
              <Slider
                value={formData.stats?.emergencyCapacity || 0}
                onChange={handleSliderChange('stats.emergencyCapacity')}
                aria-label="Emergency Capacity"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={100}
                sx={{ color: theme.palette.error.main }}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Distance from Center: {formData.distance || 0} miles
              </Typography>
              <Slider
                value={formData.distance || 0}
                onChange={handleSliderChange('distance')}
                aria-label="Distance"
                valueLabelDisplay="auto"
                step={0.5}
                marks
                min={0}
                max={50}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CameraIcon />}
              fullWidth
              sx={{ height: '100%', border: '1px dashed', borderColor: 'divider' }}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload Hospital Image'}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileUpload}
              />
            </Button>
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography 
              variant="subtitle1" 
              fontWeight="medium" 
              color="primary" 
              gutterBottom
              sx={{ mt: 2 }}
            >
              Services & Descriptions
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Autocomplete
              multiple
              id="services-autocomplete"
              options={medicalServices}
              value={formData.services || []}
              onChange={handleServicesChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Medical Services Offered"
                  placeholder="Add services"
                />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Hospital Description"
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              variant="outlined"
              multiline
              rows={3}
              placeholder="Enter a detailed description of the hospital facilities and specialties..."
            />
          </Grid>
          
          <Grid item xs={12}>
            <Box 
              sx={{ 
                p: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <PdfIcon color="action" />
              <Typography variant="body2" color="text.secondary">
                You can attach additional documents like licenses, certifications, or facility layouts.
              </Typography>
              <Button 
                size="small" 
                variant="outlined"
                startIcon={<FileIcon />}
                sx={{ ml: 'auto' }}
              >
                Attach Files
              </Button>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, py: 2, bgcolor: alpha(theme.palette.primary.main, 0.03) }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Add Hospital
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddHospitalDialog; 