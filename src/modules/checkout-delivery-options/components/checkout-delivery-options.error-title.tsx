/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as React from 'react';

export interface ICheckoutDeliveryOptionsErrorTitleProps {
    title?: string;
}

/**
 * AddPaymentForm SFC.
 * @param root0
 * @param root0.title
 * @extends {React.FC<ICheckoutDeliveryOptionsErrorTitleProps>}
 */
const CheckoutDeliveryOptionsErrorTitle: React.FC<ICheckoutDeliveryOptionsErrorTitleProps> = ({ title }) => {
    if (!title) {
        return null;
    }

    return <p className='ms-checkout-delivery-options__error-title'>{title}</p>;
};

export default CheckoutDeliveryOptionsErrorTitle;
