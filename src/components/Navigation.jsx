import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Syringe, Calculator, Activity } from 'lucide-react';
import styles from './Navigation.module.css';

const Navigation = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <NavLink 
          to="/" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <LayoutDashboard size={24} />
          <span className={styles.label}>Home</span>
        </NavLink>
        
        <NavLink 
          to="/tracker" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <Syringe size={24} />
          <span className={styles.label}>Tracker</span>
        </NavLink>

        <NavLink 
          to="/calculator" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <Calculator size={24} />
          <span className={styles.label}>Reconst</span>
        </NavLink>

        <NavLink 
          to="/half-life" 
          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
        >
          <Activity size={24} />
          <span className={styles.label}>Decay</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
