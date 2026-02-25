
export interface AppError {
    code: string;
    message: string;
    severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
    originalError?: any;
    timestamp: number;
}

const errorLog: AppError[] = [];
const listeners: ((error: AppError) => void)[] = [];

export const errorHandler = {
    /**
     * Report an error to the system
     */
    report: (error: Omit<AppError, 'timestamp'>) => {
        const fullError: AppError = {
            ...error,
            timestamp: Date.now()
        };
        
        errorLog.unshift(fullError);
        console.error(`[${error.severity}] ${error.code}: ${error.message}`, error.originalError);
        
        // Notify listeners (e.g., Toast components)
        listeners.forEach(fn => fn(fullError));

        // Trim log
        if (errorLog.length > 50) errorLog.pop();
    },

    /**
     * Get error history
     */
    getLog: () => [...errorLog],

    /**
     * Subscribe to new errors
     */
    subscribe: (fn: (error: AppError) => void) => {
        listeners.push(fn);
        return () => {
            const idx = listeners.indexOf(fn);
            if (idx >= 0) listeners.splice(idx, 1);
        };
    },

    /**
     * Clear logs
     */
    clear: () => {
        errorLog.length = 0;
    }
};
