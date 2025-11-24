import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { useSchedule } from '../hooks/useSchedule';
import styles from './CalendarScheduler.module.css';

const CalendarScheduler = () => {
    const { schedules, addSchedule, deleteSchedule, toggleComplete } = useSchedule();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        peptide: '',
        dosage: '',
        unit: 'mg',
        time: '08:00'
    });

    const calendarDays = eachDayOfInterval({
        start: startOfWeek(startOfMonth(currentMonth)),
        end: endOfWeek(endOfMonth(currentMonth))
    });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const handleDateClick = (day) => {
        setSelectedDate(day);
        setIsFormOpen(false); // Close form when switching days
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.peptide || !formData.dosage) return;

        addSchedule({
            date: selectedDate.toISOString(),
            peptide: formData.peptide,
            dosage: parseFloat(formData.dosage),
            unit: formData.unit,
            time: formData.time
        });

        setFormData({ peptide: '', dosage: '', unit: 'mg', time: '08:00' });
        setIsFormOpen(false);
    };

    const selectedDaySchedules = schedules.filter(s => isSameDay(new Date(s.date), selectedDate));

    return (
        <div className={styles.container}>
            <div className={`card glass-panel ${styles.calendarCard}`}>
                <div className={styles.header}>
                    <button onClick={prevMonth} className={styles.navBtn}><ChevronLeft /></button>
                    <h2>{format(currentMonth, 'MMMM yyyy')}</h2>
                    <button onClick={nextMonth} className={styles.navBtn}><ChevronRight /></button>
                </div>

                <div className={styles.grid}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className={styles.dayHeader}>{day}</div>
                    ))}
                    {calendarDays.map(day => {
                        const daySchedules = schedules.filter(s => isSameDay(new Date(s.date), day));
                        const hasSchedules = daySchedules.length > 0;
                        const isSelected = isSameDay(day, selectedDate);
                        const isCurrentMonth = isSameMonth(day, currentMonth);

                        return (
                            <div
                                key={day.toString()}
                                className={`${styles.day} ${!isCurrentMonth ? styles.dimmed : ''} ${isSelected ? styles.selected : ''}`}
                                onClick={() => handleDateClick(day)}
                            >
                                <span>{format(day, 'd')}</span>
                                {hasSchedules && (
                                    <div className={styles.dots}>
                                        {daySchedules.slice(0, 3).map(s => (
                                            <div key={s.id} className={`${styles.dot} ${s.completed ? styles.completedDot : ''}`} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className={styles.detailsSection}>
                <div className={styles.detailsHeader}>
                    <h3>{format(selectedDate, 'EEEE, MMMM do')}</h3>
                    <button className="btn-primary" onClick={() => setIsFormOpen(!isFormOpen)}>
                        <Plus size={18} /> Add Schedule
                    </button>
                </div>

                {isFormOpen && (
                    <form className={`card glass-panel ${styles.form}`} onSubmit={handleSubmit}>
                        <div className={styles.inputGroup}>
                            <label>Peptide</label>
                            <input
                                type="text"
                                value={formData.peptide}
                                onChange={e => setFormData({ ...formData, peptide: e.target.value })}
                                placeholder="e.g. Tirzepatide"
                                required
                            />
                        </div>
                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>Dosage</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.dosage}
                                    onChange={e => setFormData({ ...formData, dosage: e.target.value })}
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
                                    <option value="iu">IU</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Time</label>
                            <input
                                type="time"
                                value={formData.time}
                                onChange={e => setFormData({ ...formData, time: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                            Save Schedule
                        </button>
                    </form>
                )}

                <div className={styles.scheduleList}>
                    {selectedDaySchedules.length === 0 ? (
                        <p className={styles.emptyText}>No shots scheduled for this day.</p>
                    ) : (
                        selectedDaySchedules.map(schedule => (
                            <div key={schedule.id} className={`card ${styles.scheduleItem} ${schedule.completed ? styles.completedItem : ''}`}>
                                <div className={styles.scheduleLeft} onClick={() => toggleComplete(schedule.id)}>
                                    {schedule.completed ?
                                        <CheckCircle className={styles.checkIcon} size={24} /> :
                                        <Circle className={styles.circleIcon} size={24} />
                                    }
                                    <div className={styles.scheduleInfo}>
                                        <span className={styles.schedulePeptide}>{schedule.peptide}</span>
                                        <span className={styles.scheduleDetails}>
                                            {schedule.dosage}{schedule.unit} at {schedule.time}
                                        </span>
                                    </div>
                                </div>
                                <button className={styles.deleteBtn} onClick={() => deleteSchedule(schedule.id)}>
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
