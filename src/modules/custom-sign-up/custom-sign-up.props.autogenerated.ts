/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ICustomSignUp contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface ICustomSignUpConfig extends Msdyn365.IModuleConfig {
    heading: IHeadingData;
    disclaimer?: Msdyn365.RichText;
    className?: string;
    clientRender?: boolean;
}

export interface ICustomSignUpResources {
    firstNameLabelText: string;
    firstNameMaxLength: string;
    lastNameLabelText: string;
    lastNameMaxLength: string;
    emailAddressLabelText: string;
    verificationCodeLabelText: string;
    phoneVerificationLabelText: string;
    passwordLabelText: string;
    confirmPasswordLabelText: string;
    phoneNumberLabelText: string;
    signUpButtonText: string;
    signUpButtonArialabel: string;
    cancelButtonText: string;
    cancelButtonArialabel: string;
    sendCodeButtonText: string;
    sendCodeButtonAriaLabel: string;
    resendCodeButtonText: string;
    resendCodeButtonAriaLabel: string;
    verifyCodeButtonText: string;
    verifyCodeButtonAriaLabel: string;
    changeEmailButtonText: string;
    changeEmailButtonAriaLabel: string;
    verificationCodeSendSuccess: string;
    emailAddressVerifiedSuccess: string;
    phoneNumberVerifiedSuccess: string;
    passwordEntryMismatchError: string;
    requiredFieldMissingSummaryError: string;
    requiredFieldMissingError: string;
    fieldIncorrectError: string;
    invalidEmailAddressError: string;
    invalidMobileError: string;
    invalidPasswordError: string;
    invalidEmailError: string;
    retryError: string;
    retryNotAllowedError: string;
    throttledError: string;
    codeExpiredError: string;
    serverError: string;
    loadingMessage: string;
}

export const enum HeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IHeadingData {
    text: string;
    tag?: HeadingTag;
}

export interface ICustomSignUpProps<T> extends Msdyn365.IModule<T> {
    resources: ICustomSignUpResources;
    config: ICustomSignUpConfig;
}
