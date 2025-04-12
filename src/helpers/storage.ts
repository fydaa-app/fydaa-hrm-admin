class StorageApiService {
    set(name: string, value: string): void {
        globalThis?.localStorage.setItem(name, value)
    }

    get(name: string): any {
        const value = globalThis?.localStorage.getItem(name)
        try {
            const parsedValue = JSON.parse(value ?? '');
            return parsedValue
        } catch (e) {
            console.error(e);
            return value
        }
    }

    delete(name: string): void {
        globalThis?.localStorage.removeItem(name)
    }
}

export const storageService = new StorageApiService()

