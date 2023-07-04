import React from 'react';
import './Dashboard.css';
import MainPane from './MainPane';

class Dashboard extends React.Component {
    render() {
        return (
            <div>
                <h1>Dashboard</h1>
                <MainPane />
            </div>
        );
    }
}

export default Dashboard;
