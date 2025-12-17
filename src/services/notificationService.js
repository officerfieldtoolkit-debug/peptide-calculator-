/**
 * Enhanced Push Notification Service for scheduled dose reminders and alerts
 */
class NotificationServiceClass {
    constructor() {
        this.scheduledNotifications = new Map();
    }

    /**
     * Check if notifications are supported
     */
    isSupported() {
        return 'Notification' in window;
    }

    /**
     * Request notification permission
     */
    async requestPermission() {
        if (!this.isSupported()) {
            console.log('This browser does not support desktop notification');
            return false;
        }

        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    /**
     * Check current permission status
     */
    getPermission() {
        if (!this.isSupported()) return 'unsupported';
        return Notification.permission;
    }

    /**
     * Send an immediate notification
     */
    sendNotification(title, options = {}) {
        if (Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/pwa-192x192.png',
                badge: '/pwa-192x192.png',
                vibrate: [100, 50, 100],
                ...options
            });

            notification.onclick = function () {
                window.focus();
                notification.close();
                if (options.onClick) options.onClick();
            };

            return notification;
        }
        return null;
    }

    /**
     * Schedule a notification for a future time
     */
    scheduleNotification(id, scheduledTime, title, options = {}) {
        // Clear any existing notification with this ID
        this.cancelNotification(id);

        const now = new Date();
        const targetTime = new Date(scheduledTime);
        const delay = targetTime.getTime() - now.getTime();

        // Don't schedule if the time has passed
        if (delay <= 0) {
            return false;
        }

        // Schedule the notification
        const timeoutId = setTimeout(() => {
            this.sendNotification(title, options);
            this.scheduledNotifications.delete(id);
        }, delay);

        this.scheduledNotifications.set(id, timeoutId);
        return true;
    }

    /**
     * Legacy method for backwards compatibility
     */
    scheduleNotificationDelay(title, options, delayMs) {
        setTimeout(() => {
            this.sendNotification(title, options);
        }, delayMs);
    }

    /**
     * Cancel a scheduled notification
     */
    cancelNotification(id) {
        if (this.scheduledNotifications.has(id)) {
            clearTimeout(this.scheduledNotifications.get(id));
            this.scheduledNotifications.delete(id);
            return true;
        }
        return false;
    }

    /**
     * Cancel all scheduled notifications
     */
    cancelAllNotifications() {
        this.scheduledNotifications.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
        this.scheduledNotifications.clear();
    }

    /**
     * Schedule reminders for all upcoming doses
     * @param {Array} schedules - Array of scheduled doses
     * @param {number} reminderMinutes - Minutes before the dose to remind (default: 30)
     */
    scheduleReminders(schedules, reminderMinutes = 30) {
        // Cancel existing reminders
        this.cancelAllNotifications();

        const now = new Date();
        let scheduledCount = 0;

        schedules.forEach(schedule => {
            if (schedule.completed) return;

            // Parse the schedule date and time
            let scheduleDateTime;
            if (schedule.scheduled_date && schedule.scheduled_time) {
                scheduleDateTime = new Date(`${schedule.scheduled_date}T${schedule.scheduled_time}`);
            } else if (schedule.date) {
                scheduleDateTime = new Date(schedule.date);
            } else {
                return;
            }

            // Calculate reminder time (X minutes before)
            const reminderTime = new Date(scheduleDateTime.getTime() - (reminderMinutes * 60 * 1000));

            // Only schedule if reminder time is in the future
            if (reminderTime > now) {
                const peptideName = schedule.peptide_name || schedule.peptide || 'your peptide';
                const dosage = schedule.dosage || '';
                const unit = schedule.unit || 'mg';

                this.scheduleNotification(
                    `reminder-${schedule.id}`,
                    reminderTime,
                    `⏰ Dose Reminder`,
                    {
                        body: `Time to take ${peptideName} (${dosage}${unit}) in ${reminderMinutes} minutes`,
                        tag: `dose-reminder-${schedule.id}`
                    }
                );
                scheduledCount++;
            }

            // Also schedule a notification at the exact time
            if (scheduleDateTime > now) {
                const peptideName = schedule.peptide_name || schedule.peptide || 'your peptide';
                const dosage = schedule.dosage || '';
                const unit = schedule.unit || 'mg';

                this.scheduleNotification(
                    `dose-${schedule.id}`,
                    scheduleDateTime,
                    `💉 Time for your dose!`,
                    {
                        body: `Take ${peptideName} - ${dosage}${unit}`,
                        tag: `dose-${schedule.id}`,
                        requireInteraction: true
                    }
                );
                scheduledCount++;
            }
        });

        return scheduledCount;
    }

    /**
     * Send low stock alert
     */
    sendLowStockAlert(peptideName, remainingAmount, unit = 'mg') {
        return this.sendNotification('⚠️ Low Stock Alert', {
            body: `${peptideName} is running low (${remainingAmount}${unit} remaining)`,
            tag: `low-stock-${peptideName}`,
            requireInteraction: true
        });
    }
}

// Create singleton instance
const notificationServiceInstance = new NotificationServiceClass();

// Export both the instance and named exports for compatibility
export const notificationService = {
    requestPermission: () => notificationServiceInstance.requestPermission(),
    sendNotification: (title, options) => notificationServiceInstance.sendNotification(title, options),
    scheduleNotification: (title, options, delayMs) => notificationServiceInstance.scheduleNotificationDelay(title, options, delayMs),
    scheduleReminders: (schedules, minutes) => notificationServiceInstance.scheduleReminders(schedules, minutes),
    cancelAllNotifications: () => notificationServiceInstance.cancelAllNotifications(),
    sendLowStockAlert: (name, amount, unit) => notificationServiceInstance.sendLowStockAlert(name, amount, unit),
    getPermission: () => notificationServiceInstance.getPermission(),
    isSupported: () => notificationServiceInstance.isSupported()
};

export default notificationService;
