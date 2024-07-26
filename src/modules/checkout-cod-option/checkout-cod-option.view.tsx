/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IAddResource, ICheckoutGiftCardViewProps, IForm, IItem, IList, IShowResource } from './checkout-cod-option';
import MobileModal from './components/mobile-modal';

export const From: React.FC<IForm> = ({
    formProps,
    label,
    // inputPinLabel,
    // inputExpLabel,
    alert,
    // inputProps,
    // inputNumProps,
    // inputPinProps,
    // inputExpProps,
    inputNumber,
    // inputPin,
    // inputExp,
    applyButton,
    // supportExternalGiftCard,
    // showGiftCardPinInput,
    // showGiftCardExpInput,
    // alertFieldLabel
    resources,
    config
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
        ) : ( */}
        <>
            {label}
            <Node className='msc-cod-charges-container'>
                {inputNumber}
                <Node className='msc-cod-charges-label'>
                    {`${resources?.codChargesLabel} `}
                    {parseFloat(config?.codChargesAmount!).toFixed(2)}
                </Node>
            </Node>
        </>
        {/* )} */}
        {applyButton}
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

export const AddResource: React.FC<IAddResource> = ({ form, list, resources, config }) => (
    <>
        {form && <From {...form} resources={resources} config={config} />}
        {/* {list && <GiftCardList {...list} />} */}
    </>
);

export const ShowResource: React.FC<IShowResource> = ({ title, list }) => (
    <>
        {title}
        {list && <GiftCardList {...list} />}
    </>
);

const CheckoutGiftCardView: React.FC<ICheckoutGiftCardViewProps> = props => {
    const {
        checkoutGiftCardProps,
        checkoutErrorRef,
        addGiftCard,
        isMobileModalOpen,
        resources,
        codMobileNumber,
        config,
        isAuthenticated
    } = props;

    return (
        <Module {...checkoutGiftCardProps} ref={checkoutErrorRef}>
            {addGiftCard && <AddResource {...addGiftCard} resources={resources} config={config} />}
            {isMobileModalOpen && !isAuthenticated && (
                <MobileModal isOpen={isMobileModalOpen} resources={resources} props={props} codMobileNumber={codMobileNumber} />
            )}
        </Module>
    );
};

export default CheckoutGiftCardView;
