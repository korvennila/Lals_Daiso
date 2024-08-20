/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Button } from '@msdyn365-commerce-modules/utilities';
import React from 'react';

interface ICheckoutCODPlaceOrderButtonProps {
    disableCashOnDelivery?: boolean;
    resources: {
        placeOrderText: string;
    };
    handlePreCheckout(): Promise<any>;
    isCodSelected: boolean;
    isPlaceOrderLoading?: boolean;
}

/**
 * On place order function.
 * @param isBusy -Check is busy.
 * @param canPlaceOrder -Check can place order.
 * @param placeOrder -Place order function.
 * @returns Set state of button.
 */
/**
 * On Apply Function.
 * @param onApplyGiftCard -On Apply Gift Card Function.
 * @returns Call of Apply Gift Card Function.
 */
const onApplyHandler = (handlePreCheckout: () => Promise<void>) => async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault();
    await handlePreCheckout();
};

const CheckoutCODPlaceOrderButton: React.FC<ICheckoutCODPlaceOrderButtonProps> = ({
    disableCashOnDelivery,
    resources: { placeOrderText },
    handlePreCheckout,
    isCodSelected,
    isPlaceOrderLoading
}) => {
    return (
        <Button
            className={`ms-checkout__btn-place-order ${isPlaceOrderLoading ? 'is-busy' : ''}`}
            onClick={onApplyHandler(handlePreCheckout)}
            aria-label={placeOrderText}
            disabled={disableCashOnDelivery || !isCodSelected || isPlaceOrderLoading}
        >
            {placeOrderText}
        </Button>
    );
};

export default CheckoutCODPlaceOrderButton;
