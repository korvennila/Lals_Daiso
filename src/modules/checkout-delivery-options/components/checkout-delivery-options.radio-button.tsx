/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { getPayloadObject, getTelemetryAttributes, ITelemetryContent, TelemetryConstant } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface ICheckoutDeliveryOptionsRadioButtonProps {
    isChecked: boolean;
    value?: string;
    ariaSetSize: number;
    ariaPosInSet: number;
    ariaLabel?: string;
    telemetryContent?: ITelemetryContent;
    onChange(event: React.ChangeEvent<HTMLInputElement>): void;
}

/**
 * AddPaymentForm SFC.
 * @param root0
 * @param root0.isChecked
 * @param root0.value
 * @param root0.ariaSetSize
 * @param root0.ariaPosInSet
 * @param root0.ariaLabel
 * @param root0.telemetryContent
 * @param root0.onChange
 * @extends {React.FC<ICheckoutDeliveryOptionsRadioButtonProps>}
 */
const CheckoutDeliveryOptionsRadioButton: React.FC<ICheckoutDeliveryOptionsRadioButtonProps> = ({
    isChecked,
    value,
    ariaSetSize,
    ariaPosInSet,
    ariaLabel,
    telemetryContent,
    onChange
}) => {
    if (!value) {
        return null;
    }

    const payLoad = getPayloadObject('click', telemetryContent!, TelemetryConstant.DeliveryOptions);
    const attributes = getTelemetryAttributes(telemetryContent!, payLoad);

    return (
        <input
            className='ms-checkout-delivery-options__input-radio'
            checked={isChecked}
            aria-checked={isChecked}
            type='radio'
            aria-setsize={ariaSetSize}
            aria-posinset={ariaPosInSet}
            aria-label={payLoad.contentAction.etext && ariaLabel ? `${ariaLabel} ${payLoad.contentAction.etext}` : ariaLabel}
            value={value}
            name='deliveryOptions'
            {...attributes}
            onChange={onChange}
        />
    );
};

export default CheckoutDeliveryOptionsRadioButton;
