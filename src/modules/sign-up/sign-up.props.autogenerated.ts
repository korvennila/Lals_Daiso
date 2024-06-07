/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ISignUp contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface ISignUpConfig extends Msdyn365.IModuleConfig {
    heading: IHeadingData;
    disclaimer?: Msdyn365.RichText;
    className?: string;
    clientRender?: boolean;
}

export interface ISignUpResources {
    firstNameLabelText: string;
    firstNameMaxLength: string;
    lastNameLabelText: string;
    lastNameMaxLength: string;
    emailAddressLabelText: string;
    verificationCodeLabelText: string;
    passwordLabelText: string;
    confirmPasswordLabelText: string;
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
    passwordEntryMismatchError: string;
    requiredFieldMissingSummaryError: string;
    requiredFieldMissingError: string;
    fieldIncorrectError: string;
    invalidEmailAddressError: string;
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

export interface ISignUpProps<T> extends Msdyn365.IModule<T> {
    resources: ISignUpResources;
    config: ISignUpConfig;
}
