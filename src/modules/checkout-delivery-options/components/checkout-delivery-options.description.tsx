/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as React from 'react';

export interface ICheckoutDeliveryOptionsDescriptionProps {
    description?: string;
}

/**
 * AddPaymentForm SFC.
 * @param root0
 * @param root0.description
 * @extends {React.FC<ICheckoutDeliveryOptionsDescriptionProps>}
 */
const CheckoutDeliveryOptionsDescription: React.FC<ICheckoutDeliveryOptionsDescriptionProps> = ({ description }) => {
    if (!description) {
        return null;
    }

    return <span className='ms-checkout-delivery-options__description'>{description}</span>;
};

export default CheckoutDeliveryOptionsDescription;
