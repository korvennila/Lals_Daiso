/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as Msdyn365 from '@msdyn365-commerce/core';
// import { isChannelTypeB2B } from '@msdyn365-commerce/core';
import { CustomerBalances } from '@msdyn365-commerce/retail-proxy';
import { IModuleStateManager, withModuleState } from '@msdyn365-commerce-modules/checkout-utilities';
import { IModuleProps } from '@msdyn365-commerce-modules/utilities';
import { CheckoutModule, ErrorLocation, IGiftCardExtend } from '@msdyn365-commerce/global-state';
import classnames from 'classnames';
import get from 'lodash/get';
import { action, computed, reaction, when } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { ICheckoutCustomerAccountPaymentData } from './checkout-customer-account-payment.data';
import { ICheckoutCustomerAccountPaymentProps } from './checkout-customer-account-payment.props.autogenerated';
import { getAccountPaymentFormEditMode, IAccountPaymentEditViewForm } from './components/get-account-payment-form-edit-mode';
import { getAccountPaymentFormSummaryMode, IAccountPaymentSummaryViewForm } from './components/get-account-payment-form-summary-mode';
// import { ErrorComponent } from '@msdyn365-commerce-modules/checkout';
import { focusOnCheckoutError } from '@msdyn365-commerce-modules/checkout';
import StoreCreditsService from '../../shared/StoreCreditsService';
import { Alert } from '@msdyn365-commerce-modules/utilities';

export interface ICheckoutCustomerAccountPaymentViewProps
    extends ICheckoutCustomerAccountPaymentProps<ICheckoutCustomerAccountPaymentData> {
    checkoutCustomerAccount: IModuleProps;
    summaryView: IAccountPaymentSummaryViewForm;
    editView: IAccountPaymentEditViewForm;
    moduleState: IModuleStateManager;
    alert?: React.ReactNode;
    checkoutErrorRef?: React.RefObject<HTMLElement>;
}

export interface ICheckoutCustomerAccountPaymentState {
    paymentAmount: number;
    isCreditSectionExpanded: boolean;
    customizedAmt: string;
    amountVariable: string;
    errorMessage?: string;
    handleSaveAndContinue?: boolean;
    voucherId: string;
    creditBalance: number;
}

const storeCreditsService = StoreCreditsService.getInstance();

/**
 *
 * CheckoutCustomerAccount component.
 * @extends {React.Component<ICheckoutCustomerAccountPaymentProps<ICheckoutCustomerAccountPaymentData>>}
 */
// @ts-expect-error
@withModuleState
@observer
export class CheckoutCustomerAccountPayment extends React.Component<
    ICheckoutCustomerAccountPaymentViewProps,
    ICheckoutCustomerAccountPaymentState
> {
    private readonly defaultLocale: string = 'en-us';
    @computed get isCustomerAccountPaymentEnabled(): boolean {
        const customerInfo = get(this.props, 'data.customerInformation.result');
        // const request = get(this.props, 'context.request');
        // const b2bChannel = isChannelTypeB2B(request);
        // const platform = get(this.props, 'context.request.app.platform');

        return customerInfo ? true : false;
        // &&
        // customerInfo.AllowOnAccountPayment === true
        // &&
        // platform &&
        // (platform.enableCustomerAccountPayment === 'all' ||
        //     (platform.enableCustomerAccountPayment === 'b2b' && b2bChannel) ||
        //     (platform.enableCustomerAccountPayment === 'b2c' && !b2bChannel))
    }

    @computed get getLoyaltyAmount(): number {
        const checkoutState = this.props.data.checkout.result;
        if (!checkoutState || !checkoutState.loyaltyAmount) {
            return 0;
        }
        return checkoutState.loyaltyAmount;
    }

    @computed get getGiftCardTotalAmount(): number {
        const checkoutState = this.props.data.checkout.result;
        if (!checkoutState || !checkoutState.giftCardExtends) {
            return 0;
        }
        return checkoutState.giftCardExtends.reduce((count: number, giftCard: IGiftCardExtend) => {
            const balance: number = giftCard.Balance || 0;
            return count + balance;
        }, 0);
    }

    @computed get maxPaymentAmount(): number {
        const cart = this.props.data.checkout.result ? this.props.data.checkout.result.checkoutCart.cart : undefined;
        if (!cart) {
            return 0;
        }

        // Use customer account after loyalty.
        const amountDue = Math.max(0, (cart.TotalAmount || 0) - this.getLoyaltyAmount);

        // If the user has a mandatory credit limit, then the max amount must not be more than that
        if (this.props.data.customerInformation?.result?.MandatoryCreditLimit) {
            return Math.min(this.getAvailableCredit(this.props.data.creditBalances?.result), amountDue);
        }
        return amountDue;
    }

    @computed get getRemainingAmountDue(): number {
        const cart = this.props.data.checkout.result ? this.props.data.checkout.result.checkoutCart.cart : undefined;
        if (!cart) {
            return 0;
        }

        // Use customer account after loyalty and giftcard.
        const amountDue = Math.max(0, (cart.TotalAmount || 0) - this.getLoyaltyAmount - this.getGiftCardTotalAmount);

        return amountDue > 0 ? amountDue : 0;
    }

    @computed get errorMessage(): string | undefined {
        if (this.state.paymentAmount > this.maxPaymentAmount) {
            return this.props.resources.invalidAmountExceedAmountDueMessage;
        }

        if (this.state.paymentAmount < 0) {
            return this.props.resources.invalidAmountNegativeMessage;
        }

        return undefined;
    }

    @computed get currencyCode(): string | undefined {
        return get(this.props, 'context.request.channel.Currency');
    }

    @computed get availableCredit(): number {
        const creditBalances = get(this.props, 'data.creditBalances.result');

        return creditBalances ? this.getAvailableCredit(creditBalances) : 0;
    }

    @computed get orderTotal(): number {
        const orderTotal = get(this.props, 'data.checkout.result.checkoutCart.cart.TotalAmount');

        return orderTotal ? orderTotal : 0;
    }

    @computed get formattedExcessCredit(): string | undefined {
        const excessCredit = this.availableCredit - this.orderTotal;
        return excessCredit < 0 ? this.props.context.cultureFormatter.formatCurrency(excessCredit, this.currencyCode) : undefined;
    }

    @computed get isDataReady(): boolean {
        return (this.props.data.checkout.result && this.props.data.checkout.status) === 'SUCCESS';
    }

    private readonly baseClassName: string = 'ms-checkout-customer-account';

    private readonly checkoutErrorRef: React.RefObject<HTMLElement> = React.createRef();

    public constructor(props: ICheckoutCustomerAccountPaymentViewProps) {
        super(props);
        const locale = get(this.props, 'context.request.locale') || this.defaultLocale;
        this.state = {
            paymentAmount: this.maxPaymentAmount,
            isCreditSectionExpanded: false,
            customizedAmt: new Intl.NumberFormat(locale).format(this.maxPaymentAmount),
            amountVariable: this.maxPaymentAmount.toString(),
            handleSaveAndContinue: false,
            voucherId: '',
            creditBalance: 0
        };
    }

    public async componentDidMount(): Promise<void> {
        when(
            () => this.isDataReady,
            async () => {
                await this.init();
            }
        );

        reaction(
            () => this.getRemainingAmountDue, // Observable or computed value
            async amountDue => {
                if (amountDue >= 0) {
                    const checkoutState = this.props.data.checkout.result;
                    if (!checkoutState) {
                        this.props.context.telemetry.error('checkout state not found');
                        return;
                    }
                    let paymentAmount = 0;
                    if (this.state.creditBalance <= this.getRemainingAmountDue) {
                        paymentAmount = this.state.creditBalance;
                    } else if (this.state.creditBalance >= this.getRemainingAmountDue) {
                        paymentAmount = this.getRemainingAmountDue;
                    }
                    storeCreditsService.setVoucherId(this.state.voucherId);
                    storeCreditsService.setVoucherAmount(this.state.creditBalance);
                    storeCreditsService.setAppliedAmount(paymentAmount);
                    await checkoutState.updateCustomerAccountAmount({ newAmount: paymentAmount });
                }
            }
        );

        // When the cart.TotalAmount gets updated (like if selecting the delivery option adds a charge) we need to update the amount based on the new total amount.
        reaction(
            () =>
                this.props.data.checkout.result &&
                this.props.data.checkout.result.checkoutCart.cart &&
                this.props.data.checkout.result.checkoutCart.cart.TotalAmount,
            totalAmount => {
                this.updateMaxAmount(this.maxPaymentAmount);
            }
        );

        if (this.props.data.checkout.result?.shouldEnableCheckoutErrorDisplayMessaging) {
            reaction(
                () => this.props.data.checkout.result?.checkoutError,
                checkoutError => {
                    if (
                        checkoutError &&
                        checkoutError.errorLocation === ErrorLocation.CheckoutCustomerAccountPayment &&
                        checkoutError.errorMessage
                    ) {
                        this._setErrorMessage(checkoutError.errorMessage);
                    }
                }
            );

            reaction(
                () => this.props.data.checkout.result?.checkoutErrorFocus,
                checkoutErrorFocus => {
                    if (checkoutErrorFocus === CheckoutModule.CheckoutCustomerAccountPayment) {
                        focusOnCheckoutError(this.checkoutErrorRef, this.props.context.actionContext);
                    }
                }
            );
        }
    }

    public shouldComponentUpdate(
        nextProps: ICheckoutCustomerAccountPaymentProps<ICheckoutCustomerAccountPaymentData>,
        nextState: ICheckoutCustomerAccountPaymentState
    ): boolean {
        if (this.state === nextState && this.props.data === nextProps.data) {
            return false;
        }
        return true;
    }

    public render(): JSX.Element | null {
        const customerInfo = this.props.data.customerInformation?.result;

        if (!this.isCustomerAccountPaymentEnabled) {
            this.props.context.telemetry.information(
                'customer account payments will not display, because the feature is disabled or not enabled for this type of customer'
            );
            return null;
        }

        const checkoutState = this.props.data.checkout.result;
        const cart = checkoutState ? checkoutState.checkoutCart.cart : undefined;
        const hasInvoiceLine = checkoutState?.checkoutCart.hasInvoiceLine;
        const creditBalances = this.props.data.creditBalances.result;

        if (!cart || hasInvoiceLine) {
            return null;
        }
        const resources = this.props.resources;
        const locale = get(this.props, 'context.request.locale') || this.defaultLocale;

        const customerSinceDate = new Date(customerInfo?.CreatedDateTime || 0).toLocaleDateString(locale);

        const hasError = this.props.moduleState.hasError;
        const errorMessage = this.state.errorMessage;

        const props = {
            ...this.props,
            checkoutErrorRef: this.checkoutErrorRef,
            checkoutCustomerAccount: {
                moduleProps: this.props,
                className: classnames(this.baseClassName)
            },
            alert: hasError && errorMessage && (
                <Alert
                    tag='span'
                    id='ms-checkout-gift-card__error'
                    className='ms-checkout-gift-card__input-error'
                    role='alert'
                    assertive={false}
                    fade={false}
                    includeAlertClass={false}
                    isOpen={!!errorMessage}
                >
                    {errorMessage}
                </Alert>
                // <ErrorComponent
                //     {...{ title: resources.errorMessageTitle, message: errorMessage, className: 'ms-checkout-customer-account' }}
                // />
            ),
            editView: getAccountPaymentFormEditMode({
                onAddPayment: this.addPayment,
                resources,
                customizedAmt: this.state.customizedAmt,
                amountVariable: this.state.amountVariable,
                amount: this.state.paymentAmount,
                onChangePaymentAmount: this.onChangePaymentAmount,
                maxAmount: this.maxPaymentAmount,
                customer: customerInfo,
                customerCreatedDate: customerSinceDate,
                availableCredit: this.props.context.cultureFormatter.formatCurrency(
                    this.getAvailableCredit(creditBalances),
                    this.currencyCode
                ),
                showCreditLimit: customerInfo?.MandatoryCreditLimit || false,
                errorMessage: this.errorMessage,
                onToggleCreditSection: this.toggleCreditSection,
                creditSectionIsExpanded: this.state.isCreditSectionExpanded,
                orderTotal: this.props.context.cultureFormatter.formatCurrency(this.orderTotal, this.currencyCode),
                excessCredit: this.formattedExcessCredit,
                onRemovePayment: this.removePayment,
                appliedAmount:
                    checkoutState && checkoutState.customerAccountAmount > 0
                        ? this.props.context.cultureFormatter.formatCurrency(checkoutState.customerAccountAmount, this.currencyCode)
                        : undefined,
                locale:
                    this.props.context && this.props.context.request && this.props.context.request.locale
                        ? this.props.context.request.locale
                        : this.defaultLocale,
                skipOnChangeLogic: this.props.context.request.features?.skipCheckoutOnChangeLogic,
                handleVoucherIdChange: this.handleVoucherIdChange,
                voucherId: this.state.voucherId,
                storeCreditsHeadingLabel: this.props.config.storeCreditsHeadingLabel || resources.inputAmountLabel
            }),
            summaryView: getAccountPaymentFormSummaryMode({
                resources,
                amount: this.state.paymentAmount,
                appliedAmount:
                    checkoutState && checkoutState.customerAccountAmount > 0
                        ? this.props.context.cultureFormatter.formatCurrency(checkoutState.customerAccountAmount, this.currencyCode)
                        : undefined
            })
        };

        return this.props.renderView(props) as React.ReactElement;
    }

    private readonly getAvailableCredit = (creditBalances: CustomerBalances | undefined) => {
        let availableCredit = 0;

        if (!creditBalances) {
            return 0;
        }

        if (creditBalances.InvoiceAccountCreditLimit === 0) {
            availableCredit = creditBalances.CreditLimit - creditBalances.Balance - creditBalances.PendingBalance;
        } else {
            availableCredit =
                creditBalances.InvoiceAccountCreditLimit -
                creditBalances.InvoiceAccountBalance -
                creditBalances.InvoiceAccountPendingBalance;
        }

        return availableCredit;
    };

    private readonly addPayment = async (): Promise<void> => {
        const checkoutState = this.props.data.checkout.result;

        if (!checkoutState) {
            this.props.context.telemetry.error('checkout state not found');
            return;
        }

        this.setState({ handleSaveAndContinue: true });

        const cRetailURL = this.props.context.request.apiSettings.baseUrl;
        const cRetailOUN = this.props.context.request.apiSettings.oun ? this.props.context.request.apiSettings.oun : '';

        const cKORGetVoucherBalanceRequestUrl = `${cRetailURL}commerce/KORStoreCreditVoucherEntity/KORGetVoucherBalanceRequest?$top=1&api-version=7.3`;
        const customerInfo = this.props.data.customerInformation?.result;

        try {
            const response = await fetch(cKORGetVoucherBalanceRequestUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    OUN: cRetailOUN,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'
                },
                body: JSON.stringify({
                    VoucherId: this.state.voucherId,
                    CustomerAccount: customerInfo?.AccountNumber
                })
            });

            if (response.status === 200) {
                const data = await response.json();
                const result = data.value[0];
                if (result) {
                    if (!result.Success) {
                        this._setErrorMessage(
                            this.props.config.voucherInvalidErrorMessage || this.props.resources.voucherInvalidErrorMessage
                        );
                    } else if (result.Applied && result.Success) {
                        this._setErrorMessage(
                            this.props.config.voucherAlreadyUsedErrorMessage || this.props.resources.voucherAlreadyUsedErrorMessage
                        );
                    } else if (!result.Applied && result.Success && result.Balance <= 0) {
                        result.Message && this._setErrorMessage(result.Message);
                    } else {
                        this._clearError();
                        this.setState({ creditBalance: result.Balance }, async () => {
                            let paymentAmount = 0;
                            if (this.state.creditBalance <= this.getRemainingAmountDue) {
                                paymentAmount = result.Balance;
                            } else if (this.state.creditBalance >= this.getRemainingAmountDue) {
                                paymentAmount = this.getRemainingAmountDue;
                            }
                            storeCreditsService.setVoucherId(this.state.voucherId);
                            storeCreditsService.setVoucherAmount(result.Balance);
                            storeCreditsService.setAppliedAmount(paymentAmount);
                            await checkoutState.updateCustomerAccountAmount({ newAmount: paymentAmount });
                            this.props.context.telemetry.information('customer account payment amount updated');
                        });
                    }
                }
            } else {
                this._setErrorMessage(this.props.resources.voucherApplyErrorMessage);
            }
        } catch (error) {
            console.error('place order error:', error);
        }
    };

    private readonly toggleCreditSection = (): void => {
        this.setState({
            isCreditSectionExpanded: !this.state.isCreditSectionExpanded
        });
    };

    private handleVoucherIdChange = (value: string) => {
        this.setState({ voucherId: value });
    };

    private readonly init = async (): Promise<void> => {
        this.props.moduleState.init({
            onCancel: this.handleCancelOrSubmit,
            onSubmit: this.handleCancelOrSubmit,
            onEdit: this.onEdit
        });

        if (this.props.data.checkout.result && this.props.data.checkout.result.customerAccountAmount !== 0) {
            this.props.moduleState.onReady();
        }
    };

    private readonly onChangePaymentAmount = (customizedAmt: string, paymentAmount: number, amountVariable: string): void => {
        this.setState({
            customizedAmt: customizedAmt,
            paymentAmount: paymentAmount,
            amountVariable: amountVariable
        });
    };

    private readonly updateMaxAmount = (newAmount: number): void => {
        // If the user has already set an amount, we should not override that in the UI because it will be confusing.
        if (this.props.data.checkout.result && this.props.data.checkout.result.customerAccountAmount === 0) {
            this.setState({
                // We should never allow a negative amount.
                paymentAmount: Math.max(0, newAmount),
                customizedAmt: Math.max(0, newAmount).toString()
            });
        }
    };

    private readonly onEdit = (): void => {
        this.props.telemetry.information('Payment section customer account payment onEdit is called.');

        this.props.moduleState.onUpdating();
    };

    private readonly handleCancelOrSubmit = () => {
        const checkoutState = this.props.data.checkout.result;
        if (checkoutState && checkoutState.customerAccountAmount > 0) {
            this.setState({ handleSaveAndContinue: false });
            this.props.telemetry.information('Payment section customer account payment onSubmit is called.');

            if (
                Msdyn365.isOboRequest(this.props.context.request) &&
                checkoutState?.customerAccountAmount !== checkoutState?.checkoutCart.cart.TotalAmount
            ) {
                this._setErrorMessage(this.props.resources.invalidAmountForOBOMessage);
            } else {
                this.props.moduleState.onReady();
            }
        } else if (
            checkoutState?.customerAccountAmount === 0 &&
            !this.state.handleSaveAndContinue &&
            this.props.config.isCheckoutCustomerAccountPaymentRequired
        ) {
            this._setErrorMessage(this.props.resources.customerAccountCreditErrorMessage);
        } else {
            this.props.telemetry.information('Payment section customer account payment onCancel is called.');

            // Skip the module
            this.props.moduleState.onSkip();
        }
    };

    private readonly removePayment = async (): Promise<void> => {
        const checkoutState = this.props.data.checkout.result;

        if (!checkoutState) {
            this.props.context.telemetry.error('checkout state not found');
            return;
        }

        this.setState({
            paymentAmount: 0,
            voucherId: ''
        });

        this.onChangePaymentAmount('', NaN, '0');

        this._clearError();
        await checkoutState.updateCustomerAccountAmount({ newAmount: 0 });
        this.props.context.telemetry.information('customer account payment removed');
    };

    @action
    private readonly _setErrorMessage = (errorMessage: string): void => {
        this.props.telemetry.error(errorMessage);
        this.props.moduleState.setHasError(true);
        this.props.moduleState.onUpdating();
        this.setState({
            errorMessage
        });
    };

    private readonly _clearError = (): void => {
        this.props.moduleState.setHasError(false);
        this.setState({
            errorMessage: ''
        });
    };
}

export default CheckoutCustomerAccountPayment;
