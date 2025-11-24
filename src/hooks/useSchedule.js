import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'peptide_tracker_schedule';

export const useSchedule = () => {
    const [schedules, setSchedules] = useState([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            setSchedules(JSON.parse(stored));
        }
    }, []);

    const addSchedule = (schedule) => {
        const newSchedule = {
            id: uuidv4(),
            completed: false,
            ...schedule
        };

        const updated = [...schedules, newSchedule];
        setSchedules(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const deleteSchedule = (id) => {
        const updated = schedules.filter(s => s.id !== id);
        setSchedules(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const toggleComplete = (id) => {
        const updated = schedules.map(s =>
            s.id === id ? { ...s, completed: !s.completed } : s
        );
        setSchedules(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    return {
        schedules,
        addSchedule,
        deleteSchedule,
        toggleComplete
    };
};
