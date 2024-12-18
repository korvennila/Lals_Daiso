/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IAccountProfile contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IAccountProfileConfig extends Msdyn365.IModuleConfig {
    heading: IHeadingData;
    nameSectionHeading?: INameSectionHeadingData;
    emailAddressSectionHeading?: IEmailAddressSectionHeadingData;
    showPhone?: boolean;
    phoneSectionHeading?: IPhoneSectionHeadingData;
    showVatNumber?: boolean;
    vatNumberSectionHeading?: IVatNumberSectionHeadingData;
    preferencesSectionHeading?: IPreferencesSectionHeadingData;
    personalizationSectionHeading?: IPersonalizationSectionHeadingData;
    webTrackingSectionHeading?: IWebTrackingSectionHeadingData;
    showAttributes?: string;
    additionalInformationSectionHeading?: IAdditionalInformationSectionHeadingData;
    className?: string;
    clientRender?: boolean;
}

export interface IAccountProfileResources {
    accountProcessingPendingInfoMessage: string;
    attributeInputValueExceedsMaximumErrorText: string;
    attributeInputValueExceedsMinimumErrorText: string;
    attributeInputStringMaxLengthErrorText: string;
    attributeInputMandatoryErrorText: string;
    attributeInputRangeErrorText: string;
    attributeInputTypeErrorText: string;
    attributesCancelButtonAriaLabel: string;
    attributesCancelButtonText: string;
    attributesEditButtonAriaLabel: string;
    attributesEditButtonText: string;
    attributesSaveButtonAriaLabel: string;
    attributesSaveButtonText: string;
    attributesSaveExceptionMessage: string;
    attributeToggleButtonAriaLabel: string;
    editButtonText: string;
    editButtonAriaLabel: string;
    toggleEnableText: string;
    toggleDisableText: string;
    personalizationDescription: string;
    personalizationEnableButtonAriaLabel: string;
    personalizationDisableButtonAriaLabel: string;
    webTrackingDescription: string;
    webTrackingEnableButtonAriaLabel: string;
    webTrackingDisableButtonAriaLabel: string;
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

export const enum NameSectionHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface INameSectionHeadingData {
    text: string;
    tag?: NameSectionHeadingTag;
}

export const enum EmailAddressSectionHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IEmailAddressSectionHeadingData {
    text: string;
    tag?: EmailAddressSectionHeadingTag;
}

export const enum PhoneSectionHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IPhoneSectionHeadingData {
    text: string;
    tag?: PhoneSectionHeadingTag;
}

export const enum VatNumberSectionHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IVatNumberSectionHeadingData {
    text: string;
    tag?: VatNumberSectionHeadingTag;
}

export const enum PreferencesSectionHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IPreferencesSectionHeadingData {
    text: string;
    tag?: PreferencesSectionHeadingTag;
}

export const enum PersonalizationSectionHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IPersonalizationSectionHeadingData {
    text: string;
    tag?: PersonalizationSectionHeadingTag;
}

export const enum WebTrackingSectionHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IWebTrackingSectionHeadingData {
    text: string;
    tag?: WebTrackingSectionHeadingTag;
}

export const enum AdditionalInformationSectionHeadingTag {
    h1 = 'h1',
    h2 = 'h2',
    h3 = 'h3',
    h4 = 'h4',
    h5 = 'h5',
    h6 = 'h6'
}

export interface IAdditionalInformationSectionHeadingData {
    text: string;
    tag?: AdditionalInformationSectionHeadingTag;
}

export interface IAccountProfileProps<T> extends Msdyn365.IModule<T> {
    resources: IAccountProfileResources;
    config: IAccountProfileConfig;
}
