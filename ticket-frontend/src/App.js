import React, { useState, useEffect } from 'react';
import { 
  createTheme, ThemeProvider, CssBaseline, Box, AppBar, Toolbar, Typography, Button, 
  Container, Grid, Card, Chip, TextField, Dialog, DialogTitle, DialogContent, 
  DialogActions, IconButton, MenuItem, Select, InputLabel, FormControl, Avatar, Alert, CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dashboard as DashboardIcon, Add as AddIcon, ExitToApp as LogoutIcon,
  CheckCircle as CloseIcon, Delete as DeleteIcon,
  Flag as PriorityIcon, Category as CategoryIcon
} from '@mui/icons-material';

const theme = createTheme({
  palette: {
    primary: { main: '#4f46e5' },
    secondary: { main: '#ec4899' },
    background: { default: '#f1f5f9', paper: '#ffffff' },
    text: { primary: '#1e293b', secondary: '#64748b' }
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    button: { textTransform: 'none', fontWeight: 600, borderRadius: 8 }
  },
  shape: { borderRadius: 12 }
});

const API_URL = '/api';

// --- MAIN APP ---
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  if (!token) return <ThemeProvider theme={theme}><AuthScreen setToken={setToken} /></ThemeProvider>;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DashboardLayout onLogout={logout}>
        <TicketDashboard onLogout={logout} />
      </DashboardLayout>
    </ThemeProvider>
  );
}

// --- AUTH SCREEN ---
const AuthScreen = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch(`${API_URL}${isLogin ? '/login' : '/register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.access_token);
          setToken(data.access_token);
        } else {
          setIsLogin(true);
          alert('Account created! Please login.');
        }
      } else {
        setError(data.msg || 'Authentication failed');
      }
    } catch (err) { setError('Network error. Is the backend running?'); }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#eef2f6' }}>
      <Card component={motion.div} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} sx={{ p: 5, width: 400, textAlign: 'center' }}>
        <Avatar sx={{ m: 'auto', bgcolor: 'primary.main', mb: 2 }}><PriorityIcon /></Avatar>
        <Typography variant="h4" gutterBottom fontWeight="bold">{isLogin ? 'Welcome Back' : 'Join Us'}</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Username" margin="normal" onChange={e => setFormData({...formData, username: e.target.value})} />
          <TextField fullWidth label="Password" type="password" margin="normal" onChange={e => setFormData({...formData, password: e.target.value})} />
          <Button fullWidth variant="contained" size="large" type="submit" disabled={loading} sx={{ mt: 3, py: 1.5 }}>
            {loading ? <CircularProgress size={24} /> : (isLogin ? 'Login' : 'Register')}
          </Button>
        </form>
        <Button sx={{ mt: 2 }} onClick={() => setIsLogin(!isLogin)}>{isLogin ? "Need an account? Sign Up" : "Have an account? Login"}</Button>
      </Card>
    </Box>
  );
};

// --- DASHBOARD ---
const TicketDashboard = ({ onLogout }) => {
  const [tickets, setTickets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: '', description: '', priority: 'Medium', category: 'Support' });
  const [sessionError, setSessionError] = useState('');

  // Use localStorage token directly to ensure freshness
  const getToken = () => localStorage.getItem('token');

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_URL}/tickets`, {
        headers: { 'Authorization': `Bearer ${getToken()}`, 'ngrok-skip-browser-warning': 'true' }
      });
      
      if (res.status === 401 || res.status === 422) {
        setSessionError("Session expired. Please logout and login again.");
        return;
      }

      if (res.ok) setTickets(await res.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchTickets(); }, []);

  const handleCreate = async () => {
    const res = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
      body: JSON.stringify(newTicket)
    });

    if (res.ok) {
      setOpenDialog(false);
      setNewTicket({ title: '', description: '', priority: 'Medium', category: 'Support' });
      fetchTickets();
    }
  };

  const handleAction = async (id, action) => {
    const method = action === 'delete' ? 'DELETE' : 'PUT';
    const body = action === 'close' ? JSON.stringify({ status: 'Closed' }) : null;
    await fetch(`${API_URL}/tickets/${id}`, {
      method, headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` }, body
    });
    fetchTickets();
  };

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'Open').length,
    closed: tickets.filter(t => t.status === 'Closed').length
  };

  return (
    <Container maxWidth="lg">
      {sessionError && (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={onLogout}>Logout</Button>} sx={{ mb: 3 }}>
          {sessionError}
        </Alert>
      )}

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight="bold">Dashboard</Typography>
          <Typography color="textSecondary">Overview of your tickets</Typography>
        </Box>
        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpenDialog(true)}>New Ticket</Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { label: 'Total', val: stats.total, color: '#4f46e5', icon: <DashboardIcon /> },
          { label: 'Pending', val: stats.open, color: '#f59e0b', icon: <PriorityIcon /> },
          { label: 'Closed', val: stats.closed, color: '#10b981', icon: <CloseIcon /> }
        ].map((stat, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">{stat.label}</Typography>
                <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>{stat.val}</Typography>
              </Box>
              <Avatar sx={{ bgcolor: stat.color + '20', color: stat.color }}>{stat.icon}</Avatar>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Ticket List */}
      <Grid container spacing={3} component={motion.div} variants={{ show: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="show">
        <AnimatePresence>
          {tickets.map((t) => (
            <Grid item xs={12} md={6} lg={4} key={t.id} component={motion.div} variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }} layout>
              <Card sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Chip size="small" label={t.category} icon={<CategoryIcon />} sx={{ bgcolor: '#eff6ff', color: '#1e40af', fontWeight: 'bold' }} />
                  <Chip size="small" label={t.priority} color={t.priority === 'High' ? 'error' : 'success'} variant="outlined" />
                </Box>
                <Typography variant="h6" fontWeight="bold">{t.title}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flexGrow: 1 }}>{t.description}</Typography>
                <Box sx={{ pt: 2, borderTop: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
                  <Chip label={t.status} color={t.status === 'Open' ? 'primary' : 'default'} size="small" />
                  <Box>
                     {t.status === 'Open' && <IconButton size="small" color="success" onClick={() => handleAction(t.id, 'close')}><CloseIcon /></IconButton>}
                     <IconButton size="small" color="error" onClick={() => handleAction(t.id, 'delete')}><DeleteIcon /></IconButton>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Ticket</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Subject" fullWidth value={newTicket.title} onChange={(e) => setNewTicket({...newTicket, title: e.target.value})} />
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select value={newTicket.priority} label="Priority" onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}>
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={newTicket.category} label="Category" onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}>
                  <MenuItem value="Bug">Bug</MenuItem>
                  <MenuItem value="Feature">Feature</MenuItem>
                  <MenuItem value="Support">Support</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <TextField margin="dense" label="Description" fullWidth multiline rows={4} value={newTicket.description} onChange={(e) => setNewTicket({...newTicket, description: e.target.value})} sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

const DashboardLayout = ({ children, onLogout }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #e2e8f0' }}>
      <Toolbar>
        <Typography variant="h6" color="primary" sx={{ flexGrow: 1, fontWeight: 'bold' }}>Helpy.</Typography>
        <Button color="inherit" startIcon={<LogoutIcon />} onClick={onLogout}>Logout</Button>
      </Toolbar>
    </AppBar>
    <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, bgcolor: 'background.default' }}>{children}</Box>
  </Box>
);

export default App;