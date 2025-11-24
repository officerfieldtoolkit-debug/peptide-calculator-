import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const Layout = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <main style={{ flex: 1, paddingBottom: '80px' }}>
                <Outlet />
            </main>
            <Navigation />
        </div>
    );
};

export default Layout;
