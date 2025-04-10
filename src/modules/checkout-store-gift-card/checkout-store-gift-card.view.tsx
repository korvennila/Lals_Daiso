/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IAddResource, ICheckoutGiftCardViewProps, IForm, IItem, IList, IShowResource } from './checkout-store-gift-card';

export const From: React.FC<IForm> = ({
    formProps,
    label,
    inputPinLabel,
    inputExpLabel,
    alert,
    inputProps,
    inputNumProps,
    inputPinProps,
    inputExpProps,
    inputNumber,
    inputPin,
    inputExp,
    applyButton,
    supportExternalGiftCard,
    showGiftCardPinInput,
    showGiftCardExpInput,
    alertFieldLabel,
    paymentGatewayRadio,
    error
}) => (
    <Node {...formProps}>
        {alert}
        {/* {supportExternalGiftCard ? (
            <Node {...inputProps}>
                <Node {...inputNumProps}>
                    {label}
                    {inputNumber}
                </Node>
                {showGiftCardPinInput && (
                    <Node {...inputPinProps}>
                        {inputPinLabel}
                        {inputPin}
                    </Node>
                )}
                {showGiftCardExpInput && (
                    <Node {...inputExpProps}>
                        {inputExpLabel}
                        {inputExp}
                    </Node>
                )}
                {(showGiftCardPinInput || showGiftCardExpInput) && alertFieldLabel}
            </Node>
        ) : (
            <>
                {label}
                {inputNumber}
            </>
        )}
        {applyButton} */}
        {paymentGatewayRadio}
    </Node>
);

export const SelectedGiftCard: React.FC<IItem> = ({ itemProps, selectedGiftCard, removeButton }) => (
    <Node role='alert' aria-live='assertive' {...itemProps}>
        {selectedGiftCard}
        {removeButton}
    </Node>
);

export const GiftCardList: React.FC<IList> = ({ listProps, list }) => (
    <Node {...listProps}>
        {list.map(({ id, ...item }) => (
            <SelectedGiftCard key={id} {...item} />
        ))}
    </Node>
);

export const AddResource: React.FC<IAddResource> = ({ form, list, error }) => (
    <>
        {form && <From {...form} error={error} />}
        {/* {list && <GiftCardList {...list} />} */}
    </>
);

export const ShowResource: React.FC<IShowResource> = ({ title, list }) => (
    <>
        {title}
        {list && <GiftCardList {...list} />}
    </>
);

const checkoutPaymentGatewayView: React.FC<ICheckoutGiftCardViewProps> = props => {
    const {
        checkoutGiftCardProps,
        checkoutErrorRef, // showGiftCard,
        addGiftCard,
        errorMessage
    } = props;
    return (
        <Module {...checkoutGiftCardProps} ref={checkoutErrorRef}>
            {/* {showGiftCard && <ShowResource {...showGiftCard} />} */}
            {addGiftCard && <AddResource {...addGiftCard} error={errorMessage} />}
        </Module>
    );
};

export default checkoutPaymentGatewayView;
