/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ICheckoutCodOption contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export const enum showAdditionalFields {
    pin = 'pin',
    expirationDate = 'expirationDate',
    pinAndExpirationDate = 'pinAndExpirationDate'
}

export interface ICheckoutCodOptionConfig extends Msdyn365.IModuleConfig {
    showAdditionalFields?: showAdditionalFields;
    shouldBeEnabledForGuest?: boolean;
    className?: string;
    clientRender?: boolean;
    mobileNumberOTPImage?: Msdyn365.IImageData;
    codChargesAmount?: string;
    otpVerificationImage?: Msdyn365.IImageData;
    codOrderConfirmationLink?: ICodOrderConfirmationLinkData;
    codOrderFailureLink?: ICodOrderFailureLinkData;
}

export interface ICheckoutCodOptionResources {
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
    mobileNumberHeadingLabel: string;
    mobileNumberHeadingDescription: string;
    mobileNumberInputLabel: string;
    mobileNumberCodeMessage: string;
    mobileNumberGetOTPText: string;
    enterValidMobileNumber: string;
    minMobileNumberLimit: string;
    otpVerificationHeadingLabel: string;
    otpVerificationChangePhoneLabel: string;
    otpVerificationValidationMessage: string;
    otpVerificationSuccessMessage: string;
    otpVerificationConfirmOtpLabel: string;
    otpResendButton: string;
    otpVerificationResendLabel: string;
    codChargesLabel: string;
}

export interface ICodOrderConfirmationLinkData {
    linkText?: string;
    linkUrl: Msdyn365.ILinkData;
    ariaLabel?: string;
    openInNewTab?: boolean;
}

export interface ICodOrderFailureLinkData {
    linkText?: string;
    linkUrl: Msdyn365.ILinkData;
    ariaLabel?: string;
    openInNewTab?: boolean;
}

export interface ICheckoutCodOptionProps<T> extends Msdyn365.IModule<T> {
    resources: ICheckoutCodOptionResources;
    config: ICheckoutCodOptionConfig;
}
