// src/shared/CodPaymentService.ts
class CodPaymentService {
    private static instance: CodPaymentService;
    private selectedOption: string = '';
    private CODAmount: number = 0;
    private isCODSelected: boolean = false;
    private codOrderFailure: string = '';
    private listeners: ((option: string, amount: number, isCODSelected: boolean, codOrderFailure: string) => void)[] = [];

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

    public setCODSelected(option: boolean): void {
        this.isCODSelected = option;
        this.notifyListeners();
    }

    public getCODSelected(): boolean {
        return this.isCODSelected;
    }

    public setCODOrderFailure(codOrderFailure: string): void {
        this.codOrderFailure = codOrderFailure;
        this.notifyListeners();

        // Clear the codOrderFailure message after 3 seconds
        setTimeout(() => {
            this.codOrderFailure = '';
            this.notifyListeners();
        }, 3000); // 3000 milliseconds = 3 seconds
    }

    public getCODOrderFailure(): string {
        return this.codOrderFailure;
    }

    public addListener(listener: (option: string, amount: number, isCODSelected: boolean, codOrderFailure: string) => void): void {
        this.listeners.push(listener);
    }

    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.selectedOption, this.CODAmount, this.isCODSelected, this.codOrderFailure));
    }

    public removeListener(listener: (option: string, amount: number, isCODSelected: boolean, codOrderFailure: string) => void): void {
        this.listeners = this.listeners.filter(l => l !== listener);
    }
}

export default CodPaymentService;
