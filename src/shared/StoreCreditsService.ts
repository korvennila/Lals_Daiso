// src/shared/StoreCreditsService.ts
class StoreCreditsService {
    private static instance: StoreCreditsService;
    private voucherId: string = '';
    private voucherBalance: number = 0;
    private appliedBalance: number = 0;
    private listeners: ((option: string, amount: number, appliedBalance: number) => void)[] = [];

    private constructor() {}

    public static getInstance(): StoreCreditsService {
        if (!StoreCreditsService.instance) {
            StoreCreditsService.instance = new StoreCreditsService();
        }
        return StoreCreditsService.instance;
    }

    public setVoucherId(option: string): void {
        this.voucherId = option;
        this.notifyListeners();
    }

    public getVoucherId(): string {
        return this.voucherId;
    }

    public setVoucherAmount(amount: number): void {
        this.voucherBalance = amount;
        this.notifyListeners();
    }

    public getVoucherAmount(): number {
        return this.voucherBalance;
    }

    public setAppliedAmount(option: number): void {
        this.appliedBalance = option;
        this.notifyListeners();
    }

    public getAppliedAmount(): number {
        return this.appliedBalance;
    }

    public addListener(listener: (option: string, amount: number, appliedBalance: number) => void): void {
        this.listeners.push(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.voucherId, this.voucherBalance, this.appliedBalance));
    }

    public removeListener(listener: (option: string, amount: number, appliedBalance: number) => void): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }
}

export default StoreCreditsService;
