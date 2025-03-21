/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { CheckoutModule, ErrorLocation, IGiftCardExtend } from '@msdyn365-commerce/global-state';
import {
    getGiftCardAsync,
    getTenderTypesAsync,
    resolveCardTypesAsync
} from '@msdyn365-commerce/retail-proxy/dist/DataActions/StoreOperationsDataActions.g';
import {
    CardType,
    CardTypeInfo,
    GiftCard,
    RetailOperation,
    TenderType
} from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import { IModuleStateProps, withModuleState, EnabledPaymentsForOBO } from '@msdyn365-commerce-modules/checkout-utilities';
import { IModuleProps } from '@msdyn365-commerce-modules/utilities';
import classname from 'classnames';
import { computed, reaction, when } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';

import { OPERATIONS } from '@msdyn365-commerce-modules/checkout';
import { ICheckoutGiftCardData } from './checkout-gift-card.data';
import { ICheckoutGiftCardProps } from './checkout-gift-card.props.autogenerated';
import { getForm, IForm } from './components/get-form';
import { getList, IList } from './components/get-list';
import TitleCompoent from './components/title';
import { focusOnCheckoutError } from '@msdyn365-commerce-modules/checkout';

export * from './components/get-form';
export * from './components/get-item';
export * from './components/get-list';

interface ICheckoutGiftCardState {
    isFetchingGiftCard: boolean;
    errorMessage: string;
    giftCardNumber: string;
    giftCardPin: string;
    giftCardExp: string;
}

enum SupportedGiftCardType {
    Internal = 'internal',
    External = 'external',
    Both = 'both'
}

export interface ICheckoutGiftCardModuleProps extends ICheckoutGiftCardProps<ICheckoutGiftCardData>, IModuleStateProps {}

export interface IShowResource {
    title: React.ReactNode;
    list?: IList;
}

export interface IAddResource {
    form: IForm;
    list?: IList;
}

export interface ICheckoutGiftCardViewProps extends ICheckoutGiftCardProps<{}>, ICheckoutGiftCardState {
    className?: string;

    showGiftCard?: IShowResource;
    addGiftCard?: IAddResource;

    checkoutGiftCardProps: IModuleProps;
    couldPaidByGiftCard?: boolean;
    isEnabled?: boolean;
    checkoutErrorRef?: React.RefObject<HTMLElement>;
    onEdit?(): void;
    onCancel?(): void;
    onSubmit?(): void;
    enterGiftCardNumber?(giftCardNumber: string): void;
    enterGiftCardPin?(giftCardNumber: string): void;
    enterGiftCardExp?(giftCardNumber: string): void;
    removeGiftCard?(giftCardNumber: string): void;
    applyGiftCard?(): void;
}

/**
 *
 * CheckoutGiftCard component.
 * @extends {React.Component<ICheckoutGiftCardProps<ICheckoutGiftCardData>, ICheckoutGiftCardState>}
 */
@observer
export class CheckoutGiftCard extends React.Component<ICheckoutGiftCardModuleProps, ICheckoutGiftCardState> {
    public state: ICheckoutGiftCardState = {
        isFetchingGiftCard: false,
        errorMessage: '',
        giftCardNumber: '',
        giftCardPin: '',
        giftCardExp: ''
    };

    private readonly inputRef: React.RefObject<HTMLInputElement> = React.createRef();

    private readonly inputPinRef: React.RefObject<HTMLInputElement> = React.createRef();

    private readonly inputExpRef: React.RefObject<HTMLInputElement> = React.createRef();

    private readonly checkoutErrorRef: React.RefObject<HTMLElement> = React.createRef();

    @computed get isDataReady(): boolean {
        return (this.props.data.checkout.result && this.props.data.checkout.status) === 'SUCCESS';
    }

    @computed get getLoyaltyAmount(): number {
        const checkoutState = this.props.data.checkout.result;
        if (!checkoutState || !checkoutState.loyaltyAmount) {
            return 0;
        }
        return checkoutState.loyaltyAmount;
    }

    @computed get getCustomerAccountAmount(): number {
        const checkoutState = this.props.data.checkout.result;
        return checkoutState && checkoutState.customerAccountAmount ? checkoutState.customerAccountAmount : 0;
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

    @computed get disableAddGiftCard(): boolean {
        const cart = this.props.data.checkout.result ? this.props.data.checkout.result.checkoutCart.cart : undefined;
        if (!cart) {
            return true;
        }
        return (cart.TotalAmount || 0) - this.getLoyaltyAmount - this.getGiftCardTotalAmount <= 0;
    }

    @computed get shouldPayGiftCard(): boolean {
        const cart = this.props.data.checkout.result ? this.props.data.checkout.result.checkoutCart.cart : undefined;
        if (!cart) {
            return false;
        }

        // Use gift card card when loyalty points do not cover the total amount
        // const amountDue = (cart.TotalAmount || 0) - this.getLoyaltyAmount - this.getCustomerAccountAmount;
        const amountDue = cart.TotalAmount || 0;
        return amountDue > 0;
    }

    @computed get hasSelectedItem(): boolean {
        const {
            data: { checkout }
        } = this.props;
        const giftCards = checkout.result && checkout.result.giftCardExtends;
        return !!giftCards && giftCards.length > 0;
    }

    public componentDidMount(): void {
        when(
            () => this.isDataReady,
            () => {
                this.init();
            }
        );

        if (this.props.data.checkout.result?.shouldEnableCheckoutErrorDisplayMessaging) {
            reaction(
                () => this.props.data.checkout.result?.checkoutError,
                checkoutError => {
                    if (checkoutError && checkoutError.errorLocation === ErrorLocation.CheckoutGiftCard && checkoutError.errorMessage) {
                        this.setError(checkoutError.errorMessage);
                    }
                }
            );

            reaction(
                () => this.props.data.checkout.result?.checkoutErrorFocus,
                checkoutErrorFocus => {
                    if (checkoutErrorFocus === CheckoutModule.CheckoutGiftCard) {
                        focusOnCheckoutError(this.checkoutErrorRef, this.props.context.actionContext);
                    }
                }
            );
        }
    }

    public shouldComponentUpdate(nextProps: ICheckoutGiftCardModuleProps, nextState: ICheckoutGiftCardState): boolean {
        if (this.state === nextState && this.props.data === nextProps.data) {
            return false;
        }
        return true;
    }

    public render(): JSX.Element | null {
        const {
            moduleState: { isReady },
            data: { checkout },
            config: { className, showAdditionalFields },
            resources
        } = this.props;
        const { errorMessage, giftCardNumber, giftCardPin, giftCardExp } = this.state;
        const giftCards = checkout.result && checkout.result.giftCardExtends;
        const additionalFields = showAdditionalFields;
        const supportedGiftCardType = this.props.context.app.config.giftCardSupported;

        if (!this.isEnabled() || (!this.shouldPayGiftCard && !isReady)) {
            this.props.context.telemetry.error('Checkout giftcard content is empty, module wont render');
            return null;
        }

        if (this.props.context.request.user.isOBORequest && EnabledPaymentsForOBO.GiftCard === 0) {
            this.props.context.telemetry.information('isOBORequest is enabled, Checkout gift card module wont render');
            return null;
        }

        const supportExternalGiftCard = supportedGiftCardType !== SupportedGiftCardType.Internal;

        const moduleClassName = classname('ms-checkout-gift-card', className, isReady ? 'show' : 'add');

        const viewProps: ICheckoutGiftCardViewProps = {
            ...this.props,
            ...this.state,
            className: moduleClassName,
            checkoutErrorRef: this.checkoutErrorRef,

            checkoutGiftCardProps: { moduleProps: this.props, className: moduleClassName },
            couldPaidByGiftCard: this.couldPaidByGiftCard(),
            isEnabled: this.isEnabled(),
            onEdit: this.onEdit,
            onCancel: this.onCancel,
            onSubmit: this.onSubmit,
            enterGiftCardNumber: this.enterGiftCardNumber,
            enterGiftCardPin: this.enterGiftCardPin,
            enterGiftCardExp: this.enterGiftCardExp,
            removeGiftCard: this.removeGiftCard,
            applyGiftCard: this.applyGiftCard,
            showGiftCard: isReady
                ? {
                      title: <TitleCompoent title={resources.giftCardFormLabel} />,
                      list: getList({
                          canRemove: false,
                          getFormattedPrice: this.getFormattedPrice,
                          giftCards: giftCards && [...giftCards], // Note: ReadOnly Checkout State GiftCard[] is not assignable to GiftCard[] type
                          onRemoveGiftCard: this.removeGiftCard,
                          resources
                      })
                  }
                : undefined,
            addGiftCard: !isReady
                ? {
                      form: getForm({
                          errorMessage,
                          giftCardNumber,
                          giftCardPin,
                          giftCardExp,
                          inputRef: this.inputRef,
                          inputPinRef: this.inputPinRef,
                          inputExpRef: this.inputExpRef,
                          resources,
                          onEnterGiftCardNumber: this.enterGiftCardNumber,
                          onEnterGiftCardPin: this.enterGiftCardPin,
                          onEnterGiftCardExp: this.enterGiftCardExp,
                          onApplyGiftCard: this.applyGiftCard,
                          supportExternalGiftCard,
                          additionalFields,
                          disableAddGiftCard: this.disableAddGiftCard
                      }),
                      list: getList({
                          canRemove: true,
                          getFormattedPrice: this.getFormattedPrice,
                          giftCards: giftCards && [...giftCards], // Note: ReadOnly Checkout State GiftCard[] is not assignable to GiftCard[] type
                          onRemoveGiftCard: this.removeGiftCard,
                          resources
                      })
                  }
                : undefined
        };

        return this.props.renderView(viewProps) as React.ReactElement;
    }

    private readonly init = (): void => {
        this.props.moduleState.init({
            onEdit: this.onEdit,
            onCancel: this.onCancel,
            onSubmit: this.onSubmit,
            isRequired: false,
            ...(!this.isEnabled() && { status: 'disabled' })
        });

        const giftCards = this.props.data.checkout.result?.giftCardExtends;
        if (giftCards && giftCards.length > 0) {
            this.props.moduleState.onReady();
        } else if (this.props.data.checkout.result?.isPaymentVerificationRedirection) {
            this.props.moduleState.onSkip();
        }
    };

    private readonly couldPaidByGiftCard = (): boolean => {
        const cart = this.props.data.checkout.result ? this.props.data.checkout.result.checkoutCart?.cart : undefined;
        if (!cart) {
            return false;
        }

        // Use gift card when it is not free
        return (cart.TotalAmount || 0) > 0;
    };

    private readonly isEnabled = (): boolean => {
        if (
            !this.props.context.request.user.isAuthenticated &&
            this.props.context.app.config.giftCardSupported !== SupportedGiftCardType.External &&
            !this.props.config.shouldBeEnabledForGuest
        ) {
            return false;
        }
        return this.couldPaidByGiftCard();
    };

    private readonly onEdit = (): void => {
        this.props.telemetry.information('Payment section gift card onEdit is called.');

        // Show add gift card form
        this.props.moduleState.onUpdating();
    };

    private readonly onCancel = (): void => {
        this.props.telemetry.information('Payment section gift card onCancel is called.');

        this.handleCancelOrSubmit();
    };

    private readonly onSubmit = (): void => {
        this.props.telemetry.information('Payment section gift card onSubmit is called.');

        this.handleCancelOrSubmit();
    };

    private readonly handleCancelOrSubmit = () => {
        if (this.hasSelectedItem) {
            // Show summary screen
            this.props.moduleState.onReady();
        } else {
            // Skip the module
            this.props.moduleState.onSkip();
        }
    };

    private readonly getFormattedPrice = (price: number = 0, currencyCode: string = 'USD'): string => {
        return this.props.context.cultureFormatter.formatCurrency(price, currencyCode);
    };

    private readonly enterGiftCardNumber = (giftCardNumber: string): void => {
        this.setState({
            giftCardNumber
        });
        this.clearError();
    };

    private readonly enterGiftCardPin = (giftCardPin: string): void => {
        this.setState({
            giftCardPin
        });
        this.clearError();
    };

    private readonly enterGiftCardExp = (giftCardExp: string): void => {
        this.setState({
            giftCardExp
        });
        this.clearError();
    };

    private readonly setError = (errorMessage: string): void => {
        this.props.telemetry.error('Error', errorMessage);
        this.props.telemetry.debug('Error', errorMessage);
        this.props.moduleState.setHasError(true);
        this.setState({
            errorMessage
        });
    };

    private readonly clearError = (): void => {
        this.props.moduleState.setHasError(false);
        this.setState({
            errorMessage: ''
        });
    };

    private readonly removeGiftCard = async (giftCardNumber: string): Promise<void> => {
        this.props.telemetry.information('Payment section gift card remove is called.');

        const checkoutState = this.props.data.checkout.result;
        if (!checkoutState) {
            return;
        }

        await checkoutState.removeGiftCard({ giftCardNumber });
    };

    private readonly applyGiftCard = async (): Promise<void> => {
        this.props.telemetry.information('Payment section gift card apply is called.');

        if (this.state.isFetchingGiftCard) {
            return;
        }
        this.setState({
            isFetchingGiftCard: true
        });

        const checkoutState = this.props.data.checkout.result;
        const giftCardNumber = this.state.giftCardNumber.trim();
        const giftCardPin = this.state.giftCardPin.trim();
        const giftCardExp = this.state.giftCardExp.trim();

        const giftCardTypes = await this.getGiftCardTypes(giftCardNumber);
        const giftCardType = giftCardTypes && giftCardTypes[0];
        const isPinRequired = giftCardType && giftCardType.IsPinRequired;
        const isExpRequired = giftCardType && giftCardType.IsExpirationDateRequired;
        const tenderTypeId = giftCardType && giftCardType.PaymentMethodId;
        const giftCard = await this.getGiftCard(giftCardNumber, giftCardPin, giftCardExp, isPinRequired, isExpRequired, tenderTypeId);

        if (checkoutState && giftCard) {
            await checkoutState.addGiftCard({
                giftCard,
                additionalProperties: { Pin: giftCardPin, ExpirationDate: giftCardExp, TenderTypeId: tenderTypeId }
            });
            this.clearError();
            this.setState({
                giftCardNumber: '',
                giftCardPin: '',
                giftCardExp: '',
                isFetchingGiftCard: false
            });
            return Promise.resolve();
        }
        const input = this.inputRef && this.inputRef.current && this.inputRef.current.focus && (this.inputRef.current as HTMLElement);
        input && input.focus();
        this.setState({
            isFetchingGiftCard: false
        });
        this.props.telemetry.information('Payment section fetching gift card is failed.');
    };

    private readonly findGiftcardTenderTypes = (
        tenderTypes: TenderType[],
        operationId: RetailOperation,
        giftcardType: string
    ): string[] | undefined => {
        let matchedTenderTypes: TenderType[] | undefined;

        switch (giftcardType) {
            case SupportedGiftCardType.Internal:
                matchedTenderTypes = tenderTypes.filter(
                    tenderType => tenderType.OperationId === operationId && tenderType.ConnectorId === ''
                );
                break;
            case SupportedGiftCardType.External:
                matchedTenderTypes = tenderTypes.filter(
                    tenderType => tenderType.OperationId === operationId && tenderType.ConnectorId !== ''
                );
                break;
            default:
                throw new Error('Invalid gift card type');
        }

        if (matchedTenderTypes) {
            return matchedTenderTypes.map(tenderType => tenderType.TenderTypeId || '');
        }
        return;
    };

    private readonly getGiftCard = async (
        giftCardNumber: string,
        giftCardPin: string,
        giftCardExp: string,
        isPinRequired: boolean | undefined,
        isExpRequired: boolean | undefined,
        tenderTypeId: string | undefined
    ): Promise<GiftCard | undefined> => {
        const {
            resources: { noBalanceError, invalidCardInfoError, invalidCardTypeError, noCardPinError, noCardExpError }
        } = this.props;

        const supportedGiftCardType = this.props.context.app.config.giftCardSupported;

        if (!tenderTypeId) {
            return undefined;
        }

        const tenderTypes = await getTenderTypesAsync({ callerContext: this.props.context.actionContext, queryResultSettings: {} }).catch(
            error => {
                throw error;
            }
        );

        if (!tenderTypes) {
            throw new Error('Fail to get gift card tender line');
        }
        const internalGiftcardTenderTypes = this.findGiftcardTenderTypes(
            tenderTypes,
            OPERATIONS.PayGiftCertificate,
            SupportedGiftCardType.Internal
        );
        const externalGiftcardTenderTypes = this.findGiftcardTenderTypes(
            tenderTypes,
            OPERATIONS.PayGiftCertificate,
            SupportedGiftCardType.External
        );

        switch (supportedGiftCardType) {
            case undefined:
            case SupportedGiftCardType.Internal:
                if (!internalGiftcardTenderTypes?.includes(tenderTypeId)) {
                    this.setError(invalidCardTypeError);
                    return undefined;
                }
                break;
            case SupportedGiftCardType.External:
                if (!externalGiftcardTenderTypes?.includes(tenderTypeId)) {
                    this.setError(invalidCardTypeError);
                    return undefined;
                }
                break;
            case SupportedGiftCardType.Both:
                if (!internalGiftcardTenderTypes?.includes(tenderTypeId) && !externalGiftcardTenderTypes?.includes(tenderTypeId)) {
                    this.setError(invalidCardTypeError);
                    return undefined;
                }
                break;
            default:
                throw new Error('Unsupported gift card type');
        }

        if (isPinRequired && giftCardPin === '') {
            this.setError(noCardPinError);
            return undefined;
        }

        if (isExpRequired && giftCardExp === '') {
            this.setError(noCardExpError);
            return undefined;
        }

        const month = Number.parseInt(giftCardExp.split('/')[0], 10);
        const year = Number.parseInt(giftCardExp.split('/')[1], 10);

        return getGiftCardAsync({ callerContext: this.props.context.actionContext }, giftCardNumber, tenderTypeId, giftCardPin, month, year)
            .then(activeGiftCard => {
                if (!activeGiftCard.Balance || activeGiftCard.Balance === 0) {
                    this.setError(noBalanceError);
                    return;
                }
                return activeGiftCard;
            })
            .catch(error => {
                this.setError(invalidCardInfoError);
                return undefined;
            });
    };

    private readonly getGiftCardTypes = async (giftCardNumber: string): Promise<CardTypeInfo[] | undefined> => {
        const {
            resources: { emptyInputError, duplicatedCodeError, invalidCodeError },
            data: { checkout }
        } = this.props;

        if (!giftCardNumber) {
            this.setError(emptyInputError);
            return undefined;
        }

        const isDuplicated = checkout.result && checkout.result.giftCardExtends.some((card: GiftCard) => card.Id === giftCardNumber);
        if (isDuplicated) {
            this.setError(duplicatedCodeError);
            return undefined;
        }

        return resolveCardTypesAsync({ callerContext: this.props.context.actionContext }, giftCardNumber, CardType.GiftCard)
            .then(giftCardTypes => {
                if (!giftCardTypes || giftCardTypes.length === 0 || giftCardTypes[0] === undefined) {
                    this.setError(invalidCodeError);
                    return;
                }
                return giftCardTypes;
            })
            .catch(error => {
                this.setError(invalidCodeError);
                return undefined;
            });
    };
}

export default withModuleState(CheckoutGiftCard);
