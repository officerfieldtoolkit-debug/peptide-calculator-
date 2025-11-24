import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'peptide_tracker_injections';

export const useInjections = () => {
    const [injections, setInjections] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setInjections(JSON.parse(stored));
        }
    }, []);

    const addInjection = (injection) => {
        const newInjection = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            ...injection
        };

        const updated = [newInjection, ...injections];
        setInjections(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const deleteInjection = (id) => {
        const updated = injections.filter(i => i.id !== id);
        setInjections(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    return {
        injections,
        addInjection,
        deleteInjection
    };
};
