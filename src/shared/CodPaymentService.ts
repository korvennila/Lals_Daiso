// src/shared/CodPaymentService.ts
class CodPaymentService {
    private static instance: CodPaymentService;
    private selectedOption: string = '';
    private CODAmount: number = 0;
    private listeners: ((option: string, amount: number) => void)[] = [];

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

    public setCODAmount(amount: number): void {
        this.CODAmount = amount;
        this.notifyListeners();
    }

    public getCODAmount(): number {
        return this.CODAmount;
    }

    public addListener(listener: (option: string, amount: number) => void): void {
        this.listeners.push(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.selectedOption, this.CODAmount));
    }
}

export default CodPaymentService;
