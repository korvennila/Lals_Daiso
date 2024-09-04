/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IAddResource, ICheckoutGiftCardViewProps, IForm, IItem, IList, IShowResource } from './checkout-cod-option';
import MobileModal from './components/mobile-modal';
import { isEmpty } from '@msdyn365-commerce/retail-proxy';

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
    config,
    codChargeAmount,
    error
}) => (
    <Node {...formProps}>
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
            <Node className='msc-cod-titleContainer'>
                {label}
                <span className='msc-cod-accordion-toggle'>
                    <i className='msc-toggle-icon'></i>
                </span>
            </Node>
            <Node className={`msc-cod-charges-container ${!isEmpty(error!) ? 'disabled' : ''}`}>
                {alert}
                {inputNumber}
                {codChargeAmount && codChargeAmount > 0 ? (
                    <Node className='msc-cod-charges-label'>
                        {`${resources?.codChargesLabel} `}
                        {codChargeAmount?.toFixed(2)}
                    </Node>
                ) : (
                    undefined
                )}
            </Node>
        </>
        {/* )} */}
        {/* {applyButton} */}
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

export const AddResource: React.FC<IAddResource> = ({ form, list, resources, config, codChargeAmount, error }) => (
    <>
        {form && <From {...form} resources={resources} config={config} codChargeAmount={codChargeAmount} error={error} />}
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
        isAuthenticated,
        codChargeAmount,
        errorMessage
    } = props;

    return (
        <Module {...checkoutGiftCardProps} ref={checkoutErrorRef}>
            {addGiftCard && (
                <AddResource
                    {...addGiftCard}
                    resources={resources}
                    config={config}
                    codChargeAmount={codChargeAmount}
                    error={errorMessage}
                />
            )}
            {isMobileModalOpen && !isAuthenticated && (
                <MobileModal isOpen={isMobileModalOpen} resources={resources} props={props} codMobileNumber={codMobileNumber} />
            )}
        </Module>
    );
};

export default CheckoutGiftCardView;
