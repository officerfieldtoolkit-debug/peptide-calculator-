import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, CheckCircle, Circle, Calendar, X, CloudOff, Loader2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { useSchedule } from '../hooks/useSchedule';
import { useAuth } from '../context/AuthContext';
import { PEPTIDE_DATABASE } from '../data/peptideDatabase';
import styles from './CalendarScheduler.module.css';

const PEPTIDE_NAMES = Object.keys(PEPTIDE_DATABASE);

const CalendarScheduler = () => {
    const { schedules, loading, addSchedule, deleteSchedule, toggleComplete } = useSchedule();
    const { user } = useAuth();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        peptide: '',
        dosage: '',
        unit: 'mg',
        time: '08:00',
        notes: ''
    });

    // Autocomplete state
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [filteredPeptides, setFilteredPeptides] = useState([]);
    const autocompleteRef = useRef(null);

    // Filter peptides for autocomplete
    useEffect(() => {
        if (formData.peptide) {
            const search = formData.peptide.toLowerCase();
            const filtered = PEPTIDE_NAMES.filter(name =>
                name.toLowerCase().includes(search)
            ).slice(0, 6);
            setFilteredPeptides(filtered);
        } else {
            setFilteredPeptides(PEPTIDE_NAMES.slice(0, 6));
        }
    }, [formData.peptide]);

    // Close autocomplete on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (autocompleteRef.current && !autocompleteRef.current.contains(e.target)) {
                setShowAutocomplete(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const calendarDays = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth))
    });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const goToToday = () => {
        const today = new Date();
        setCurrentMonth(today);
        setSelectedDate(today);
    };

    const handleDateClick = (day) => {
        setSelectedDate(day);
        setIsFormOpen(false);
    };

    const selectPeptide = (name) => {
        setFormData({ ...formData, peptide: name });
        setShowAutocomplete(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.peptide || !formData.dosage) return;

        addSchedule({
            date: selectedDate.toISOString(),
            peptide: formData.peptide,
            dosage: parseFloat(formData.dosage),
            unit: formData.unit,
            time: formData.time,
            notes: formData.notes || null
        });

        setFormData({ peptide: '', dosage: '', unit: 'mg', time: '08:00', notes: '' });
        setIsFormOpen(false);
    };

    // Safely parse schedule dates
    const getScheduleDate = (schedule) => {
        try {
            const date = new Date(schedule.date);
            if (isNaN(date.getTime())) return null;
            return date;
        } catch {
            return null;
        }
    };

    const selectedDaySchedules = schedules.filter(s => {
        const scheduleDate = getScheduleDate(s);
        return scheduleDate && isSameDay(scheduleDate, selectedDate);
    });

    // Count schedules per day for dots
    const getSchedulesForDay = (day) => {
        return schedules.filter(s => {
            const scheduleDate = getScheduleDate(s);
            return scheduleDate && isSameDay(scheduleDate, day);
        });
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <Loader2 size={32} className={styles.spinner} />
                    <p>Loading schedule...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.pageHeader}>
                <div className={styles.headerLeft}>
                    <Calendar size={28} className={styles.headerIcon} />
                    <div>
                        <h1>Injection Schedule</h1>
                        <p>Plan and track your doses</p>
                    </div>
                </div>
                {!user && (
                    <div className={styles.guestBadge}>
                        <CloudOff size={14} />
                        Guest Mode
                    </div>
                )}
            </div>

            {/* Calendar Card */}
            <div className={`card glass-panel ${styles.calendarCard}`}>
                <div className={styles.calendarHeader}>
                    <button onClick={prevMonth} className={styles.navBtn} aria-label="Previous month">
                        <ChevronLeft size={20} />
                    </button>
                    <div className={styles.monthDisplay}>
                        <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
                        <button onClick={goToToday} className={styles.todayBtn}>
                            Today
                        </button>
                    </div>
                    <button onClick={nextMonth} className={styles.navBtn} aria-label="Next month">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className={styles.grid}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className={styles.dayHeader}>{day}</div>
                    ))}
                    {calendarDays.map(day => {
                        const daySchedules = getSchedulesForDay(day);
                        const hasSchedules = daySchedules.length > 0;
                        const completedCount = daySchedules.filter(s => s.completed).length;
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isTodayDate = isToday(day);

                        return (
                            <button
                                key={day.toISOString()}
                                className={`${styles.day} ${!isCurrentMonth ? styles.dimmed : ''} ${isSelected ? styles.selected : ''} ${isTodayDate ? styles.today : ''}`}
                                onClick={() => handleDateClick(day)}
                            >
                                <span className={styles.dayNumber}>{format(day, 'd')}</span>
                                {hasSchedules && (
                                    <div className={styles.dots}>
                                        {daySchedules.slice(0, 3).map((s, idx) => (
                                            <div
                                                key={s.id || idx}
                                                className={`${styles.dot} ${s.completed ? styles.completedDot : ''}`}
                                            />
                                        ))}
                                        {daySchedules.length > 3 && (
                                            <span className={styles.moreCount}>+{daySchedules.length - 3}</span>
                                        )}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Details Section */}
            <div className={`card glass-panel ${styles.detailsSection}`}>
                <div className={styles.detailsHeader}>
                    <div>
                        <h3>{format(selectedDate, 'EEEE')}</h3>
                        <p className={styles.dateSubtitle}>{format(selectedDate, 'MMMM d, yyyy')}</p>
                    </div>
                    <button
                        className={`${styles.addBtn} ${isFormOpen ? styles.addBtnActive : ''}`}
                        onClick={() => setIsFormOpen(!isFormOpen)}
                    >
                        {isFormOpen ? <X size={18} /> : <Plus size={18} />}
                        {isFormOpen ? 'Cancel' : 'Add'}
                    </button>
                </div>

                {/* Add Schedule Form */}
                {isFormOpen && (
                    <form className={styles.form} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup} ref={autocompleteRef}>
                            <label>Peptide</label>
                            <div className={styles.autocompleteWrapper}>
                                <input
                                    type="text"
                                    value={formData.peptide}
                                    onChange={e => setFormData({ ...formData, peptide: e.target.value })}
                                    onFocus={() => setShowAutocomplete(true)}
                                    placeholder="Search peptide..."
                                    autoComplete="off"
                                    required
                                />
                                {showAutocomplete && filteredPeptides.length > 0 && (
                                    <div className={styles.autocomplete}>
                                        {filteredPeptides.map(name => (
                                            <button
                                                key={name}
                                                type="button"
                                                className={styles.autocompleteItem}
                                                onClick={() => selectPeptide(name)}
                                            >
                                                {name}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.formRow}>
                            <div className={styles.inputGroup}>
                                <label>Dosage</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.dosage}
                                    onChange={e => setFormData({ ...formData, dosage: e.target.value })}
                                    placeholder="0.5"
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Unit</label>
                                <select
                                    value={formData.unit}
                                    onChange={e => setFormData({ ...formData, unit: e.target.value })}
                                >
                                    <option value="mg">mg</option>
                                    <option value="mcg">mcg</option>
                                    <option value="IU">IU</option>
                                </select>
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Time</label>
                                <input
                                    type="time"
                                    value={formData.time}
                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Notes (optional)</label>
                            <input
                                type="text"
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                placeholder="e.g., Take with food"
                            />
                        </div>

                        <button type="submit" className={styles.submitBtn}>
                            <Plus size={18} />
                            Add to Schedule
                        </button>
                    </form>
                )}

                {/* Schedule List */}
                <div className={styles.scheduleList}>
                    {selectedDaySchedules.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Calendar size={40} className={styles.emptyIcon} />
                            <p>No doses scheduled</p>
                            <span>Tap "Add" to schedule a dose for this day</span>
                        </div>
                    ) : (
                        selectedDaySchedules.map(schedule => (
                            <div
                                key={schedule.id}
                                className={`${styles.scheduleItem} ${schedule.completed ? styles.completedItem : ''}`}
                            >
                                <button
                                    className={styles.scheduleToggle}
                                    onClick={() => toggleComplete(schedule.id)}
                                    aria-label={schedule.completed ? 'Mark as incomplete' : 'Mark as complete'}
                                >
                                    {schedule.completed ?
                                        <CheckCircle className={styles.checkIcon} size={24} /> :
                                        <Circle className={styles.circleIcon} size={24} />
                                    }
                                </button>
                                <div className={styles.scheduleInfo}>
                                    <span className={styles.schedulePeptide}>{schedule.peptide}</span>
                                    <span className={styles.scheduleDetails}>
                                        {schedule.dosage} {schedule.unit} • {schedule.time}
                                    </span>
                                    {schedule.notes && (
                                        <span className={styles.scheduleNotes}>{schedule.notes}</span>
                                    )}
                                </div>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => deleteSchedule(schedule.id)}
                                    aria-label="Delete schedule"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CalendarScheduler;
