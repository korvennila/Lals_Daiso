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
    applyButton
    // removeButton
    // supportExternalGiftCard,
    // showGiftCardPinInput,
    // showGiftCardExpInput,
    // alertFieldLabel
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
            {inputNumber}
        </>
        {/* )} */}
        {applyButton}
        {/* {removeButton} */}
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
        //showGiftCard,
        addGiftCard,
        isMobileModalOpen,
        closeModal,
        resources
    } = props;

    const cAthenticated = props.context.request.user.isAuthenticated ? props.context.request.user.isAuthenticated : false;

    return (
        <Module {...checkoutGiftCardProps} ref={checkoutErrorRef}>
            {addGiftCard && <AddResource {...addGiftCard} />}
            {isMobileModalOpen && !cAthenticated && (
                <MobileModal isOpen={isMobileModalOpen} onClose={closeModal} resources={resources} props={props} />
            )}
        </Module>
    );
};

export default CheckoutGiftCardView;
