/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IGiftCardBalanceCheck contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export const enum showAdditionalFields {
    pin = 'pin',
    expirationDate = 'expirationDate',
    pinAndExpirationDate = 'pinAndExpirationDate'
}

export interface IGiftCardBalanceCheckConfig extends Msdyn365.IModuleConfig {
    showAdditionalFields?: showAdditionalFields;
    shouldBeEnabledForGuest?: boolean;
    className?: string;
    clientRender?: boolean;
}

export interface IGiftCardBalanceCheckResources {
    emptyInputError: string;
    invalidCodeError: string;
    invalidCardInfoError: string;
    invalidCardTypeError: string;
    noCardPinError: string;
    noCardExpError: string;
    noBalanceError: string;
    giftCardFormLabel: string;
    giftCardNumberLabel: string;
    giftCardPinLabel: string;
    giftCardExpLabel: string;
    giftCardPinPlaceholderText: string;
    giftCardExpPlaceholderText: string;
    giftCardAlertLabel: string;
    balanceCheckButton: string;
    giftCardAvailableBalanceLabel: string;
    enteredGiftCardLabel: string;
}

export interface IGiftCardBalanceCheckProps<T> extends Msdyn365.IModule<T> {
    resources: IGiftCardBalanceCheckResources;
    config: IGiftCardBalanceCheckConfig;
}
