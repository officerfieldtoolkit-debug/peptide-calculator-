// Internationalization configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const en = {
    translation: {
        // Navigation
        nav: {
            home: 'Home',
            tracker: 'Tracker',
            calculator: 'Calc',
            library: 'Library',
            schedule: 'Schedule',
            guides: 'Guides',
            profile: 'Profile',
            login: 'Login',
            more: 'More'
        },
        // Dashboard
        dashboard: {
            welcome: 'Welcome back',
            quickActions: 'Quick Actions',
            recentInjections: 'Recent Injections',
            upcomingSchedule: 'Upcoming Schedule',
            noInjections: 'No injections logged yet',
            noSchedule: 'No upcoming doses scheduled'
        },
        // Tracker
        tracker: {
            title: 'Injection Tracker',
            logInjection: 'Log Injection',
            peptide: 'Peptide',
            dosage: 'Dosage',
            date: 'Date',
            time: 'Time',
            site: 'Injection Site',
            notes: 'Notes',
            save: 'Save',
            delete: 'Delete',
            edit: 'Edit'
        },
        // Calculator
        calculator: {
            title: 'Reconstitution Calculator',
            peptideAmount: 'Peptide Amount',
            bacWater: 'BAC Water',
            desiredDose: 'Desired Dose',
            result: 'Draw',
            units: 'units'
        },
        // Schedule
        schedule: {
            title: 'Schedule',
            addDose: 'Add Dose',
            today: 'Today',
            upcoming: 'Upcoming',
            completed: 'Completed',
            markComplete: 'Mark Complete'
        },
        // Settings
        settings: {
            title: 'Settings',
            profile: 'Profile',
            preferences: 'Preferences',
            notifications: 'Notifications',
            theme: 'Theme',
            language: 'Language',
            darkMode: 'Dark Mode',
            lightMode: 'Light Mode',
            export: 'Export Data',
            logout: 'Log Out'
        },
        // Common
        common: {
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            loading: 'Loading...',
            error: 'Error',
            success: 'Success',
            confirm: 'Confirm',
            back: 'Back',
            next: 'Next',
            mg: 'mg',
            mcg: 'mcg',
            iu: 'IU',
            ml: 'mL'
        },
        // Export
        export: {
            title: 'Export Data',
            format: 'Format',
            csv: 'CSV',
            pdf: 'PDF',
            dateRange: 'Date Range',
            allTime: 'All Time',
            lastMonth: 'Last Month',
            lastWeek: 'Last Week',
            download: 'Download'
        },
        // Notifications
        notifications: {
            enabled: 'Notifications Enabled',
            disabled: 'Notifications Disabled',
            scheduled: 'Scheduled Dose Reminder',
            lowStock: 'Low Stock Alert',
            permission: 'Allow Notifications'
        }
    }
};

// Spanish translations
const es = {
    translation: {
        // Navigation
        nav: {
            home: 'Inicio',
            tracker: 'Registro',
            calculator: 'Calc',
            library: 'Biblioteca',
            schedule: 'Horario',
            guides: 'Guías',
            profile: 'Perfil',
            login: 'Iniciar',
            more: 'Más'
        },
        // Dashboard
        dashboard: {
            welcome: 'Bienvenido de nuevo',
            quickActions: 'Acciones Rápidas',
            recentInjections: 'Inyecciones Recientes',
            upcomingSchedule: 'Próximas Dosis',
            noInjections: 'No hay inyecciones registradas',
            noSchedule: 'No hay dosis programadas'
        },
        // Tracker
        tracker: {
            title: 'Registro de Inyecciones',
            logInjection: 'Registrar Inyección',
            peptide: 'Péptido',
            dosage: 'Dosis',
            date: 'Fecha',
            time: 'Hora',
            site: 'Sitio de Inyección',
            notes: 'Notas',
            save: 'Guardar',
            delete: 'Eliminar',
            edit: 'Editar'
        },
        // Calculator
        calculator: {
            title: 'Calculadora de Reconstitución',
            peptideAmount: 'Cantidad de Péptido',
            bacWater: 'Agua BAC',
            desiredDose: 'Dosis Deseada',
            result: 'Extraer',
            units: 'unidades'
        },
        // Schedule
        schedule: {
            title: 'Horario',
            addDose: 'Agregar Dosis',
            today: 'Hoy',
            upcoming: 'Próximo',
            completed: 'Completado',
            markComplete: 'Marcar Completo'
        },
        // Settings
        settings: {
            title: 'Configuración',
            profile: 'Perfil',
            preferences: 'Preferencias',
            notifications: 'Notificaciones',
            theme: 'Tema',
            language: 'Idioma',
            darkMode: 'Modo Oscuro',
            lightMode: 'Modo Claro',
            export: 'Exportar Datos',
            logout: 'Cerrar Sesión'
        },
        // Common
        common: {
            save: 'Guardar',
            cancel: 'Cancelar',
            delete: 'Eliminar',
            edit: 'Editar',
            loading: 'Cargando...',
            error: 'Error',
            success: 'Éxito',
            confirm: 'Confirmar',
            back: 'Atrás',
            next: 'Siguiente',
            mg: 'mg',
            mcg: 'mcg',
            iu: 'UI',
            ml: 'mL'
        },
        // Export
        export: {
            title: 'Exportar Datos',
            format: 'Formato',
            csv: 'CSV',
            pdf: 'PDF',
            dateRange: 'Rango de Fechas',
            allTime: 'Todo el Tiempo',
            lastMonth: 'Último Mes',
            lastWeek: 'Última Semana',
            download: 'Descargar'
        },
        // Notifications
        notifications: {
            enabled: 'Notificaciones Activadas',
            disabled: 'Notificaciones Desactivadas',
            scheduled: 'Recordatorio de Dosis Programada',
            lowStock: 'Alerta de Stock Bajo',
            permission: 'Permitir Notificaciones'
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en,
            es
        },
        lng: localStorage.getItem('peptide_language') || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
