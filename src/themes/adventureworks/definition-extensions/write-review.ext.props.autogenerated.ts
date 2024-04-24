/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IWriteReview contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IWriteReviewConfig extends Msdyn365.IModuleConfig {
    heading?: IHeadingData;
    id?: string;
    className?: string;
    clientRender?: boolean;
    paragraph?: Msdyn365.RichText;
    imageSettings?: Msdyn365.IImageSettings;
}

export interface IWriteReviewResources {
    signInLabel: string;
    signInAriaLabel: string;
    reviewButtonLabel: string;
    selectRatingAriaLabel: string;
    selectRatingLabel: string;
    reviewTitleLabel: string;
    reviewTextLabel: string;
    privacyPolicyTitle: string;
    privacyPolicyTextFormat: string;
    writeReviewModalTitle: string;
    editReviewModalTitle: string;
    submitReviewButtonText: string;
    editReviewButtonText: string;
    discardReviewButtonText: string;
    errorMessageText: string;
    signInMessage: string;
    reviewTitleAriaLabel: string;
    reviewAriaLabel: string;
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

export interface IWriteReviewProps<T> extends Msdyn365.IModule<T> {
    resources: IWriteReviewResources;
    config: IWriteReviewConfig;
}
