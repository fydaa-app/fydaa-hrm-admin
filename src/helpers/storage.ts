class StorageApiService {
    set(name: string, value: string): void {
        globalThis?.localStorage.setItem(name, value);
    }

    get<T>(name: string): T | null {
        const value = globalThis?.localStorage.getItem(name);
        try {
            const parsedValue = JSON.parse(value ?? '');
            return parsedValue as T;
        } catch (e) {
            console.error(e);
            return value as unknown as T; // Fallback to raw value if parsing fails
        }
    }

    delete(name: string): void {
        globalThis?.localStorage.removeItem(name);
    }
}

export const storageService = new StorageApiService();