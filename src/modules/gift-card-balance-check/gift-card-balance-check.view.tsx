/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IForm, IItem, IGiftCardBalanceCheckViewProps } from './index';

export const Form: React.FC<IForm> = ({
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
        {alert}
        {supportExternalGiftCard ? (
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
        {applyButton}
    </Node>
);

export const Item: React.FC<IItem> = ({ itemProps, selectedGiftCard }) => <Node {...itemProps}>{selectedGiftCard}</Node>;

const GiftCardBalanceCheckView: React.FC<IGiftCardBalanceCheckViewProps> = props => {
    const { giftCardBalanceCheckProps, form, item } = props;
    return (
        <Module {...giftCardBalanceCheckProps}>
            {form && <Form {...form} />}
            {item && <Item {...item} />}
        </Module>
    );
};

export default GiftCardBalanceCheckView;
