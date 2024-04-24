/**
 * Copyright (c) Microsoft Corporation
 * All rights reserved. See License.txt in the project root for license information.
 * IReviewsList contentModule Interface Properties
 * THIS FILE IS AUTO-GENERATED - MANUAL MODIFICATIONS WILL BE LOST
 */

import * as Msdyn365 from '@msdyn365-commerce/core';

export interface IReviewsListConfig extends Msdyn365.IModuleConfig {
    heading?: IHeadingData;
    reviewsShownOnEachPage: number;
    className?: string;
    clientRender?: boolean;
    imageSettings?: Msdyn365.IImageSettings;
}

export interface IReviewsListResources {
    nextButtonText: string;
    previousButtonText: string;
    publisherResponseBadgeText: string;
    pageReviewCountText: string;
    pageReviewAriaLabel: string;
    mostHelpfulSortOptionText: string;
    mostRecentSortOptionText: string;
    highestRatedSortOptionText: string;
    lowestRatedSortOptionText: string;
    allRatinsFilterByOptionText: string;
    fiveStarFilterByOptionText: string;
    fourStarFilterByOptionText: string;
    threeStarFilterByOptionText: string;
    twoStarFilterByOptionText: string;
    oneStarFilterByOptionText: string;
    sortByDropdownText: string;
    filterByDropdownText: string;
    noReviewsMessage: string;
    noReviewsWithSelectedFilterMessage: string;
    wasReviewHelpfulText: string;
    yesButtonText: string;
    noButtonText: string;
    cancelReportReviewText: string;
    reportReviewButtonText: string;
    okReportReviewText: string;
    reportModalMessage: string;
    reportSubmittedMessage: string;
    reportedText: string;
    feedbackThankYouText: string;
    feedbackErrorText: string;
    reportSpamText: string;
    offensiveContentText: string;
    profanityContentText: string;
    editReviewCardText: string;
    reportConcernText: string;
    reviewRatingNarratorText: string;
    selectRatingAriaLabel: string;
    selectRatingLabel: string;
    reviewTitleLabel: string;
    reviewTextLabel: string;
    privacyPolicyTitle: string;
    privacyPolicyTextFormat: string;
    writeReviewModalTitle: string;
    editReviewModalTitle: string;
    submitReviewButtonText: string;
    discardReviewButtonText: string;
    errorMessageText: string;
    averageRatingAriaLabel: string;
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

export interface IReviewsListProps<T> extends Msdyn365.IModule<T> {
    resources: IReviewsListResources;
    config: IReviewsListConfig;
}
