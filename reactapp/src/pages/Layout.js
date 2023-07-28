import { Outlet, Link } from "react-router-dom";
import './Layout.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';  
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const NavBarButton = (props) => {
    const { to, children } = props;
    return (
        <Button
            component={RouterLink}
            to={to}
            sx={{
                color: '#fff',
                backgroundColor: '#007BFF',
                borderRadius: '5px',
                textDecoration: 'none',
                fontSize: '16px',
                '&:hover': {
                    backgroundColor: '#0056b3',
                },
            }}
        >
            {children}
        </Button>
    )
}

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});



const Layout = () => {
    return (
        <ThemeProvider theme={theme}>
            <AppBar position="static" color="transparent">
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Box display="flex" gap={2}>
                        <NavBarButton to="/">Dashboard</NavBarButton>
                        <NavBarButton to="/manage">Manage Trackings</NavBarButton>
                        <NavBarButton to="/test">Test</NavBarButton>
                    </Box>
                    <NavBarButton to="/login">Log in</NavBarButton>
                </Toolbar>
            </AppBar>
            <Outlet />
        </ThemeProvider>
    )
};

export default Layout;