// Utility functions
class Utils {
    static generateId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    }

    static formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }

    static formatTime(timeString) {
        return timeString;
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static getRandomColor() {
        const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    static calculateWinRate(predictions) {
        if (!predictions.length) return 0;
        const wins = predictions.filter(p => p.result === 'win').length;
        return Math.round((wins / predictions.length) * 100);
    }
    }
