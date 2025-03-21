/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * ICustomSignIn contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface ICustomSignInConfig extends Msdyn365.IModuleConfig {
    signInHeading: ISignInHeadingData;
    signUpHeading: ISignUpHeadingData;
    signInDisclaimer?: Msdyn365.RichText;
    facebookIcon?: Msdyn365.IImageData;
    microsoftIcon?: Msdyn365.IImageData;
    googleIcon?: Msdyn365.IImageData;
    className?: string;
    clientRender?: boolean;
    displayB2bAccountManagerSignin?: boolean;
}

export interface ICustomSignInResources {
    signUpDescriptionText: string;
    facebookButtonText: string;
    facebookButtonAriaLabel: string;
    microsoftButtonText: string;
    microsoftButtonAriaLabel: string;
    googleButtonText: string;
    googleButtonAriaLabel: string;
    b2bButtonText: string;
    b2bButtonAriaLabel: string;
    emailAddressLabelText: string;
    emailAddressAriaLabel: string;
    emailOrPhoneLabelText: string;
    emailOrPhoneAriaLabel: string;
    passwordLabelText: string;
    loginButtonText: string;
    loginButtonAriaLabel: string;
    signUpButtonText: string;
    signUpButtonAriaLabel: string;
    forgotPasswordButtonText: string;
    forgotPasswordButtonAriaLabel: string;
    requriedEmailError: string;
    requriedPasswordError: string;
    invalidEmailError: string;
    invalidPhoneError: string;
    invalidPasswordError: string;
    unknownError: string;
    loadingMessage: string;
}

export const enum SignInHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface ISignInHeadingData {
    text: string;
    tag?: SignInHeadingTag;
}

export const enum SignUpHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface ISignUpHeadingData {
    text: string;
    tag?: SignUpHeadingTag;
}

export interface ICustomSignInProps<T> extends Msdyn365.IModule<T> {
    resources: ICustomSignInResources;
    config: ICustomSignInConfig;
}
