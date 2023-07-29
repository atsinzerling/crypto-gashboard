import React from 'react';
import './Dashboard.css';
import MainPane from './MainPane';
import { Box, Button, Typography } from '@mui/material';

class Dashboard extends React.Component {
    render() {
        return (
            <div>
                <Typography variant="h1">Dashboard</Typography>
                <MainPane />
            </div>
        );
    }
}

export default Dashboard;
