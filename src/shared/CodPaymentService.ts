// src/shared/CodPaymentService.ts
class CodPaymentService {
    private static instance: CodPaymentService;
    private selectedOption: string = '';
    private listeners: ((option: string) => void)[] = [];

    private constructor() {}

    public static getInstance(): CodPaymentService {
        if (!CodPaymentService.instance) {
            CodPaymentService.instance = new CodPaymentService();
        }
        return CodPaymentService.instance;
    }

    public setSelectedOption(option: string): void {
        this.selectedOption = option;
        this.notifyListeners();
    }

    public getSelectedOption(): string {
        return this.selectedOption;
    }

    public addListener(listener: (option: string) => void): void {
        this.listeners.push(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.selectedOption));
    }
}

export default CodPaymentService;
