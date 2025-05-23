export const ENV = process.env.NEXT_PUBLIC_ENV || process.env.ENV
export const APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN || process.env.APP_DOMAIN

interface IValues {
    INTERNAL_SERVICE: string
    AUTH_SERVICE: string
    API_SERVICE: string // Added for the new API service base URL
    HEIRARCHY_SERVICE: string
    EMPLOYEE_SERVICE: string, 
    GOALSHEET_SERVICE: string, 
    TRANSACTION_SERVICE: string,
    STUDENT_SERVICE: string,
}

interface ISettings {
    dev: IValues
    beta: IValues
    prod: IValues
}

const envSettingsMap: ISettings = {
    dev: {
        INTERNAL_SERVICE: `${APP_DOMAIN}/api`,
        AUTH_SERVICE: 'http://localhost:3005', // Changed to match the new login URL port
        API_SERVICE: 'http://localhost:3005', // Separate base URL for other API calls
        HEIRARCHY_SERVICE: 'http://localhost:3005',
        EMPLOYEE_SERVICE: 'http://localhost:3005', 
        GOALSHEET_SERVICE: 'http://localhost:3005', 
        TRANSACTION_SERVICE: 'http://localhost:3005', 
        STUDENT_SERVICE: 'http://localhost:3000',
    },
    beta: {
        INTERNAL_SERVICE: `${APP_DOMAIN}/api`,
        AUTH_SERVICE: 'https://referral.fydaa.in', // Removed /auth/signin to match the new URL structure
        API_SERVICE: 'https://referral.fydaa.in',
        HEIRARCHY_SERVICE: 'https://referral.fydaa.in/api',
        EMPLOYEE_SERVICE: 'http://localhost:8000/user', 
        GOALSHEET_SERVICE: 'http://localhost:8000/goal-sheet', 
        TRANSACTION_SERVICE: 'https://stocktransaction-stage.fydaa.com', 
        STUDENT_SERVICE: 'https://auth-stage.fydaa.com',
    },
    prod: {
        INTERNAL_SERVICE: `${APP_DOMAIN}/api`,
        AUTH_SERVICE: 'https://crm-prod.fydaa.com', // Removed /api to match the new URL structure
        API_SERVICE: 'https://crm-prod.fydaa.com',
        HEIRARCHY_SERVICE: 'https://crm-prod.fydaa.com',
        EMPLOYEE_SERVICE: 'https://crm-prod.fydaa.com', 
        GOALSHEET_SERVICE: 'https://crm-prod.fydaa.com', 
        TRANSACTION_SERVICE: 'https://crm-prod.fydaa.com', 
        STUDENT_SERVICE: 'https://auth.fydaa.com', 
    },
}

export const settings = envSettingsMap[ENV as keyof ISettings]