/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import {
    CacheType,
    createObservableDataAction,
    IAction,
    IActionContext,
    IActionInput,
    ICommerceApiSettings,
    ICreateActionContext,
    isEmptyOrNullObject
} from '@msdyn365-commerce/core';
import { getCheckoutState, ICheckoutState } from '@msdyn365-commerce/global-state';
import { getCardPaymentAcceptPointAsync } from '@msdyn365-commerce/retail-proxy/dist/DataActions/CartsDataActions.g';
import { CardPaymentAcceptPoint } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import { buildCacheKey } from '@msdyn365-commerce-modules/retail-actions';
import get from 'lodash/get';

export interface IGetCardPaymentAcceptPointInput {
    showBillingAddress?: boolean;
    paymenTenderType?: string;
    apiSettings: ICommerceApiSettings;
    shouldEnableSinglePaymentAuthorizationCheckout?: boolean;
    amountDue?: number;
    shouldPassLocaleToiFrame?: boolean;
}

/**
 * GetCardPaymentAcceptPointInput - Input for create GetCardPaymentAcceptPoint.
 */
export class GetCardPaymentAcceptPointInput implements IActionInput {
    public showBillingAddress?: boolean;

    public paymenTenderType?: string;

    public shouldEnableSinglePaymentAuthorizationCheckout?: boolean;

    public amountDue?: number;

    public shouldPassLocaleToiFrame?: boolean;

    private readonly apiSettings: ICommerceApiSettings;

    constructor(input: IGetCardPaymentAcceptPointInput) {
        this.showBillingAddress = input.showBillingAddress;
        this.paymenTenderType = input.paymenTenderType;
        this.apiSettings = input.apiSettings;
        this.shouldEnableSinglePaymentAuthorizationCheckout = input.shouldEnableSinglePaymentAuthorizationCheckout;
        this.amountDue = input.amountDue;
        this.shouldPassLocaleToiFrame = input.shouldPassLocaleToiFrame;
    }

    public getCacheKey = () =>
        buildCacheKey(`CardPaymentAcceptPoint${this.paymenTenderType ? `-${this.paymenTenderType}` : ''}`, this.apiSettings);

    public getCacheObjectType = () => 'CardPaymentAcceptPoint';

    public dataCacheType = (): CacheType => 'none';
}

export const createCheckoutPaymentInstrumentInput = (inputData: ICreateActionContext<IGetCardPaymentAcceptPointInput>) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- keep existing name.
    const { showBillingAddress, paymenTenderType, shouldEnableSinglePaymentAuthorizationCheckout, amountDue, shouldPassLocaleToiFrame } =
        inputData.config ?? {};
    const getCardPaymentAcceptPointInput = {
        showBillingAddres: showBillingAddress,
        paymenTenderType,
        apiSettings: inputData.requestContext.apiSettings,
        shouldEnableSinglePaymentAuthorizationCheckout,
        amountDue,
        shouldPassLocaleToiFrame
    };

    return new GetCardPaymentAcceptPointInput(getCardPaymentAcceptPointInput);
};

/**
 * Calls the Retail API and returns a cart object based on the passed GetCartInput.
 * @param input
 * @param ctx
 */
export async function getCardPaymentAcceptPointAction(
    input: GetCardPaymentAcceptPointInput,
    ctx: IActionContext
): Promise<CardPaymentAcceptPoint> {
    // If no cart ID is provided in input, we need to create a cart object
    if (!input) {
        ctx.telemetry.exception(new Error('[getCardPaymentAcceptPointAction] No valid Input was provided, failing'));
        throw new Error('[getCardPaymentAcceptPointAction] No valid Input was provided, failing');
    }

    const { showBillingAddress, paymenTenderType, amountDue = 0, shouldPassLocaleToiFrame } = input;
    const checkoutState: ICheckoutState = await getCheckoutState(ctx).catch((error: Error) => {
        ctx.telemetry.exception(error);
        throw error;
    });

    if (
        isEmptyOrNullObject(checkoutState) ||
        isEmptyOrNullObject(checkoutState.checkoutCart) ||
        isEmptyOrNullObject(checkoutState.checkoutCart.cart)
    ) {
        ctx.telemetry.exception(new Error('[getCardPaymentAcceptPointAction] Unable to get cart'));
        throw new Error('[getCardPaymentAcceptPointAction] Unable to get cart');
    }

    if (!checkoutState.checkoutCart.cart.CartLines || checkoutState.checkoutCart.cart.CartLines.length === 0) {
        ctx.telemetry.exception(new Error('[getCardPaymentAcceptPointAction] Cart is empty'));
        throw new Error('[getCardPaymentAcceptPointAction] Cart is empty');
    }

    const requestUrl =
        typeof ctx.requestContext.url.requestUrl === 'string'
            ? new URL(ctx.requestContext.url.requestUrl)
            : ctx.requestContext.url.requestUrl;
    const origin = get(window, 'location.origin') || requestUrl.origin;

    const cardPaymentAcceptSettings = {
        '@odata.type': '#Microsoft.Dynamics.Commerce.Runtime.DataModel.CardPaymentAcceptSettings',
        HostPageOrigin: origin,
        AdaptorPath: `${origin}/Connectors/` || origin,
        CardPaymentEnabled: false,
        CardTokenizationEnabled: true,
        ...(!showBillingAddress && { HideBillingAddress: true }),
        ...(paymenTenderType && { TenderTypeId: paymenTenderType }),
        PaymentAmount: amountDue !== 0 ? amountDue : checkoutState.checkoutCart.cart.AmountDue ?? 0,
        Locale: shouldPassLocaleToiFrame ? ctx.requestContext.locale || 'en-us' : undefined
    };

    return getCardPaymentAcceptPointAsync(
        { callerContext: ctx, bypassCache: 'get' },
        checkoutState.checkoutCart.cart.Id,
        cardPaymentAcceptSettings,
        []
    )
        .then(cardPaymentAcceptPoint => {
            if (!cardPaymentAcceptPoint.AcceptPageUrl && !cardPaymentAcceptPoint.AcceptPageContent) {
                throw new Error(
                    '[getCardPaymentAcceptPointAction] Payment Accept Page has neither return AcceptPageUrl nor AcceptPageContent in updatePaymentAcceptPageData'
                );
            }
            return cardPaymentAcceptPoint;
        })
        .catch(error => {
            ctx.telemetry.exception(error);
            ctx.telemetry.debug('Unable to get Card Payment Accept Point');
            throw error;
        });
}

export const getCardPaymentAcceptPointActionDataAction = createObservableDataAction({
    id: '@msdyn365-commerce/checkout-payment-instrument/get-card-payment-accept-point',
    action: <IAction<CardPaymentAcceptPoint>>getCardPaymentAcceptPointAction,
    input: createCheckoutPaymentInstrumentInput
});

export default getCardPaymentAcceptPointActionDataAction;
