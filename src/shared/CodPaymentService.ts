// src/shared/CodPaymentService.ts
type PaymentMethod = 'COD' | 'PG' | ''; // Define payment method types

class CodPaymentService {
    private static instance: CodPaymentService;

    private selectedOption: PaymentMethod = ''; // Default to no selection (matches screenshot)
    private CODAmount: number = 0;
    private isCODSelected: boolean = false;
    private codOrderFailure: string = '';
    private listeners: ((option: PaymentMethod, amount: number, isCODSelected: boolean, codOrderFailure: string) => void)[] = [];

    private constructor() {}

    public static getInstance(): CodPaymentService {
        if (!CodPaymentService.instance) {
            CodPaymentService.instance = new CodPaymentService();
        }
        return CodPaymentService.instance;
    }

    public selectPaymentMethod(method: PaymentMethod, amount: number = 0): void {
        if (method === 'COD') {
            this.selectedOption = 'COD';
            this.isCODSelected = true;
            this.CODAmount = amount;
        } else if (method === 'PG') {
            this.selectedOption = 'PG';
            this.isCODSelected = false;
            this.CODAmount = 0;
        } else {
            this.selectedOption = '';
            this.isCODSelected = false;
            this.CODAmount = 0;
        }
        this.notifyListeners();
    }

    public getSelectedOption(): PaymentMethod {
        return this.selectedOption;
    }

    public setCODAmount(amount: number): void {
        this.CODAmount = amount;
        this.notifyListeners();
    }

    public getCODAmount(): number {
        return this.CODAmount;
    }

    public setCODSelected(option: boolean): void {
        this.isCODSelected = option;
        this.selectedOption = option ? 'COD' : this.selectedOption === 'COD' ? '' : this.selectedOption; // Default to previous or '' if COD was active
        if (!option) {
            this.CODAmount = 0;
        }
        this.notifyListeners();
    }

    public getCODSelected(): boolean {
        return this.isCODSelected;
    }

    public setCODOrderFailure(codOrderFailure: string): void {
        this.codOrderFailure = codOrderFailure;
        this.notifyListeners();
        setTimeout(() => {
            this.codOrderFailure = '';
            this.notifyListeners();
        }, 3000);
    }

    public getCODOrderFailure(): string {
        return this.codOrderFailure;
    }

    public addListener(listener: (option: PaymentMethod, amount: number, isCODSelected: boolean, codOrderFailure: string) => void): void {
        this.listeners.push(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.selectedOption, this.CODAmount, this.isCODSelected, this.codOrderFailure));
    }

    public removeListener(
        listener: (option: PaymentMethod, amount: number, isCODSelected: boolean, codOrderFailure: string) => void
    ): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    // Backward compatibility
    public setSelectedOption(option: string): void {
        this.selectPaymentMethod(option as PaymentMethod);
    }
}

export default CodPaymentService;
