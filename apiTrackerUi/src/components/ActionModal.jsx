import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, Switch, TextField, Button, FormControlLabel, MenuItem,
  Snackbar, Alert, Fade
} from '@mui/material';
import axios from 'axios';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 320,
  bgcolor: '#0f172a',
  borderRadius: '12px',
  boxShadow: 24,
  p: 3,
  color: '#fff'
};

const inputStyle = {
  input: { color: '#fff' },
  label: { color: '#e3e6ebff' }
};

function ActionModal({ open, handleClose, endpoint }) {
  const [controls, setControls] = useState({
    api: false,
    tracer: false,
    limit: false,
    schedule: false,
    startTime: '',
    endTime: '',
    requestCount: 0,
    rateUnit: 'sec'
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ open: false, message: '', severity: 'success' });
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchSettings = async () => {
      if (!open || !endpoint) return;
      setLoading(true);
      try {

        const res = await axios.get(`${apiUrl}/api/controls/data`, {
          params: { endpoint }
        });

        if (res.data?.data) {
          const {
            api, tracer, limit, schedule,
            startTime, endTime, requestCount, rateUnit
          } = res.data.data;

          setControls({
            api, tracer, limit, schedule,
            startTime, endTime,
            requestCount: requestCount || 0,
            rateUnit: rateUnit || 'sec'
          });
        }
      } catch (err) {
        setToast({ open: true, message: 'Failed to load settings', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [open, endpoint]);

  const handleToggle = (key) => {
    setControls(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setControls(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (controls.limit && controls.requestCount < 1) {
      setToast({ open: true, message: 'Request count must be at least 1', severity: 'error' });
      return;
    }

    try {
      const payload = { endpoint, ...controls };
      await axios.post('http://localhost:4000/api/controls', payload);
      setToast({ open: true, message: 'Settings saved successfully', severity: 'success' });
    } catch (err) {
      setToast({ open: true, message: 'Failed to save settings', severity: 'error' });
    }

    handleClose();
  };

  const handleToastClose = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Modal open={open} onClose={handleClose} closeAfterTransition>
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={2}>Controls</Typography>

            {loading && <Typography>Loading...</Typography>}

            <FormControlLabel
              control={<Switch checked={controls.api} onChange={() => handleToggle('api')} />}
              label="API"
              sx={{ color: '#fff' }}
            />
            <FormControlLabel
              control={<Switch checked={controls.tracer} onChange={() => handleToggle('tracer')} />}
              label="Tracer"
              sx={{ color: '#fff' }}
            />
            <FormControlLabel
              control={<Switch checked={controls.limit} onChange={() => handleToggle('limit')} />}
              label="Limit"
              sx={{ color: '#fff' }}
            />

            {controls.limit && (
              <Box mt={2} display="flex" gap={2}>
                <TextField
                  label="Number of Requests"
                  type="number"
                  value={controls.requestCount}
                  onChange={(e) => handleChange('requestCount', parseInt(e.target.value))}
                  InputLabelProps={{ shrink: true }}
                  sx={inputStyle}
                  fullWidth
                />
                <TextField
                  label="Rate"
                  select
                  value={controls.rateUnit}
                  onChange={(e) => handleChange('rateUnit', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={inputStyle}
                  fullWidth
                >
                  <MenuItem value="sec">sec</MenuItem>
                  <MenuItem value="min">min</MenuItem>
                  <MenuItem value="hour">hour</MenuItem>
                </TextField>
              </Box>
            )}

            <FormControlLabel
              control={<Switch checked={controls.schedule} onChange={() => handleToggle('schedule')} />}
              label="Schedule On/Off"
              sx={{ color: '#fff' }}
            />

            {controls.schedule && (
              <Box mt={2} display="flex" gap={2}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={controls.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                  InputProps={{ inputProps: { step: 300 } }}
                  sx={inputStyle}
                />
                <TextField
                  label="End Time"
                  type="time"
                  value={controls.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={inputStyle}
                />
              </Box>
            )}

            <Box mt={3} textAlign="right">
              <Button variant="contained" onClick={handleSave} sx={{ bgcolor: '#3b82f6' }}>
                Save
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleToastClose} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ActionModal;
