/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ICheckoutStoreGiftCard contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export const enum showAdditionalFields {
    pin = 'pin',
    expirationDate = 'expirationDate',
    pinAndExpirationDate = 'pinAndExpirationDate'
}

export interface ICheckoutStoreGiftCardConfig extends Msdyn365.IModuleConfig {
    showAdditionalFields?: showAdditionalFields;
    shouldBeEnabledForGuest?: boolean;
    className?: string;
    clientRender?: boolean;
}

export interface ICheckoutStoreGiftCardResources {
    emptyInputError: string;
    invalidCodeError: string;
    invalidCardInfoError: string;
    invalidCardTypeError: string;
    noCardPinError: string;
    noCardExpError: string;
    duplicatedCodeError: string;
    noBalanceError: string;
    giftCardFormLabel: string;
    giftCardNumberLabel: string;
    giftCardPinLabel: string;
    giftCardExpLabel: string;
    giftCardPinPlaceholderText: string;
    giftCardExpPlaceholderText: string;
    giftCardAlertLabel: string;
    applyGiftCardButton: string;
    removeGiftCardButton: string;
    enteredGiftCardLabel: string;
    giftCardAvailableBalanceLabel: string;
}

export interface ICheckoutStoreGiftCardProps<T> extends Msdyn365.IModule<T> {
    resources: ICheckoutStoreGiftCardResources;
    config: ICheckoutStoreGiftCardConfig;
}
