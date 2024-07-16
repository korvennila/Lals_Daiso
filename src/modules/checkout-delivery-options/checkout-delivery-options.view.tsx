/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import {
    ICheckoutDeliveryOption,
    ICheckoutDeliveryOptionEdit,
    ICheckoutDeliveryOptionsList,
    ICheckoutDeliveryOptionsViewProps
} from './checkout-delivery-options';

const DeliveryOptionList: React.FC<ICheckoutDeliveryOptionsList> = ({ DeliveryOptionsList, list }) => {
    if (!list || list.length === 0) {
        return null;
    }

    return (
        <Node {...DeliveryOptionsList}>
            {list.map((deliveryOption: ICheckoutDeliveryOptionEdit) => {
                return (
                    <Node {...deliveryOption.DeliveryOption} key={deliveryOption.code} aria-label='Please select a delivery option.'>
                        {deliveryOption.radioButton}
                        {deliveryOption.description}
                        {deliveryOption.price}
                    </Node>
                );
            })}
        </Node>
    );
};

const DeliveryOptionSelected: React.FC<ICheckoutDeliveryOption> = ({ DeliveryOption, description, price }) => {
    return (
        <Node {...DeliveryOption}>
            {description}
            {price}
        </Node>
    );
};

const CheckoutDeliveryOptionsView: React.FC<ICheckoutDeliveryOptionsViewProps> = props => {
    const {
        CheckoutDeliveryOptions,
        checkoutErrorRef,
        viewState,
        deliveryOptions,
        deliveryOptionSelected,
        alert,
        waiting,
        saveButton,
        editButton,
        cancelButton
    } = props;

    return (
        // TODO: All wrapper div should be provided by viewProps. Once SDK provide the sln, update markup.
        <Module {...CheckoutDeliveryOptions} ref={checkoutErrorRef}>
            {viewState.isLoading && waiting}
            {viewState.isError && alert}
            {viewState.isShowList && deliveryOptions && <DeliveryOptionList {...deliveryOptions} />}
            {viewState.isShowSelected && deliveryOptionSelected && <DeliveryOptionSelected {...deliveryOptionSelected} />}
            {viewState.isShowSaveButton && saveButton}
            {viewState.isShowEditButton && editButton}
            {viewState.isShowCancelButton && cancelButton}
        </Module>
    );
};

export default CheckoutDeliveryOptionsView;
