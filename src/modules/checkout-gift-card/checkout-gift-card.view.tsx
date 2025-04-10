/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IAddResource, ICheckoutGiftCardViewProps, IForm, IItem, IList, IShowResource } from './checkout-gift-card';

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
    alertFieldLabel
}) => (
    <Node {...formProps}>
        {supportExternalGiftCard ? (
            <Node {...inputProps}>
                <Node {...inputNumProps}>
                    <Node className='msc-gift-card-titleContainer'>
                        {label}
                        <span className='msc-gift-card-accordion-toggle'>
                            <i className='msc-toggle-icon'></i>
                        </span>
                    </Node>
                    <Node className='msc-gift-card-container'>
                        {inputNumber}
                        {applyButton}
                        {alert}
                    </Node>
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
                <Node className='msc-gift-card-titleContainer'>
                    {label}
                    <span className='msc-gift-card-accordion-toggle'>
                        <i className='msc-toggle-icon'></i>
                    </span>
                </Node>
                <Node className='msc-gift-card-container'>
                    {inputNumber}
                    {applyButton}
                    {alert}
                </Node>
            </>
        )}
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

export const AddResource: React.FC<IAddResource> = ({ form, list }) => (
    <>
        {form && <From {...form} />}
        {list && <GiftCardList {...list} />}
    </>
);

export const ShowResource: React.FC<IShowResource> = ({ title, list }) => (
    <>
        {title}
        {list && <GiftCardList {...list} />}
    </>
);

const CheckoutGiftCardView: React.FC<ICheckoutGiftCardViewProps> = props => {
    const { checkoutGiftCardProps, checkoutErrorRef, showGiftCard, addGiftCard } = props;
    return (
        <Module {...checkoutGiftCardProps} ref={checkoutErrorRef}>
            {showGiftCard && <ShowResource {...showGiftCard} />}
            {addGiftCard && <AddResource {...addGiftCard} />}
        </Module>
    );
};

export default CheckoutGiftCardView;
