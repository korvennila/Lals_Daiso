/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as React from 'react';

export interface ICheckoutDeliveryOptionsErrorMessageProps {
    message?: string;
}

/**
 * AddPaymentForm SFC.
 * @param root0
 * @param root0.message
 * @extends {React.FC<ICheckoutDeliveryOptionsErrorMessageProps>}
 */
const CheckoutDeliveryOptionsErrorMessage: React.FC<ICheckoutDeliveryOptionsErrorMessageProps> = ({ message }) => {
    if (!message) {
        return null;
    }

    return <p className='ms-checkout-delivery-options__error-message'>{message}</p>;
};

export default CheckoutDeliveryOptionsErrorMessage;
