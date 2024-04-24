/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { RatingsSummary, Review, Reviews } from '@msdyn365-commerce/commerce-entities';
import { buildHydratedMockActionContext, buildMockCoreContext, buildMockModuleProps, ICoreContext } from '@msdyn365-commerce/core';
import { AsyncResult, SimpleProduct } from '@msdyn365-commerce/retail-proxy';
import { IRatingsReviewsState, IReviewsListData, IReviewsListProps } from '@msdyn365-commerce-modules/ratings-reviews';
import * as RetailActions from '@msdyn365-commerce-modules/retail-actions';
import { INodeProps, Modal, ModalBody, ModalFooter, ModalHeader } from '@msdyn365-commerce-modules/utilities';
import { render } from 'enzyme';
import * as React from 'react';

import ReviewsListview from '../views/reviews-list.view';

const mockActionContext = buildHydratedMockActionContext();

const mockCoreContext = buildMockCoreContext({ app: { config: { hideRating: false } } }) as ICoreContext;
mockCoreContext.request.apiSettings.baseUrl = 'https://comme2e-tie-ring1f9397e098fb7bd4fret.cloud.retail.test.dynamics.com/';
mockCoreContext.request.apiSettings.baseImageUrl =
    'https://cms-ppe-imageresizer-mr.trafficmanager.net/cms/api/gfhwnkhdlh/imageFileData/search?fileName=/';
mockCoreContext.request.apiSettings.rnr = { id: 'rnrId', url: 'rnrUrl', proxyUrl: 'proxyUrl' };
const resources = {
    nextButtonText: 'Next',
    previousButtonText: 'Previous',
    pageReviewCountText: 'Showing {0}-{1} out of {2} reviews',
    pageReviewAriaLabel: 'Show {0}-{1} out of {2} reviews',
    publisherResponseBadgeText: '{0} responded on {1}',
    mostHelpfulSortOptionText: 'Most helpful',
    mostRecentSortOptionText: 'Most recent',
    highestRatedSortOptionText: 'Highest rated',
    lowestRatedSortOptionText: 'Lowest rated',
    fiveStarFilterByOptionText: '5 stars',
    fourStarFilterByOptionText: '4 stars',
    threeStarFilterByOptionText: '3 stars',
    twoStarFilterByOptionText: '2 stars',
    oneStarFilterByOptionText: '1 star',
    allRatinsFilterByOptionText: 'All ratings',
    filterByDropdownText: 'Filter by:',
    sortByDropdownText: 'Sort by:',
    noReviewsMessage: 'No one has reviewed this product yet.',
    noReviewsWithSelectedFilterMessage: 'Showing 0 reviews.',
    wasReviewHelpfulText: 'Was this helpful?',
    yesButtonText: 'Yes',
    noButtonText: 'No',
    cancelReportReviewText: 'Cancel',
    okReportReviewText: 'Ok',
    feedbackThankYouText: 'Thank you for your feedback.',
    profanityContentText: 'Contains profanity',
    offensiveContentText: 'Contains offensive content',
    reportSpamText: 'Contains spam or advertising',
    feedbackErrorText: 'Something went wrong. Please try again.',
    reportConcernText: 'Report a concern:',
    reviewRatingNarratorText: 'User Rating: {0} out of 5',
    editReviewCardText: 'Edit',
    reportedText: 'reported',
    reportModalMessage: 'message',
    reportSubmittedMessage: 'sucesfully submitted, we are taking a look',
    privacyPolicyTextFormat: 'By clicking submit, you accept our {0}.',
    privacyPolicyTitle: 'Privacy Policy',
    reviewTextLabel: 'Review',
    reviewTitleLabel: 'Title',
    selectRatingAriaLabel: 'Set ratings as {0} out of {1} stars',
    selectRatingLabel: 'Choose a rating',
    writeReviewModalTitle: 'Write a review',
    editReviewModalTitle: 'Edit your review',
    discardReviewButtonText: 'Discard',
    errorMessageText: 'Something went wrong, please try again',
    submitReviewButtonText: 'Submit',
    reportReviewButtonText: 'Report',
    averageRatingAriaLabel: '{0} stars, {1}'
};

const mockActions = {};

const mockAuthenticatedContextSignedIn: ICoreContext = {
    // @ts-expect-error
    request: {
        user: {
            optOutWebActivityTracking: false,
            token: 'Dummy token',
            isAuthenticated: true
        }
    },
    app: {
        config: {}
    },
    actionContext: mockActionContext
};

const modalProps = {
    modal: {
        className: 'ms-nav',
        tag: Modal
    } as INodeProps,
    modalHeader: {
        className: 'ms-nav',
        tag: ModalHeader
    } as INodeProps,
    modalFooter: {
        className: 'ms-nav',
        tag: ModalFooter
    } as INodeProps,
    modalBody: {
        className: 'ms-nav',
        tag: ModalBody
    }
};
const mockConfig = {
    reviewsShownOnEachPage: 1
};

const ratingsSummary = RetailActions.wrapInResolvedAsyncResult({
    tenantId: 'ATenant',
    productId: '1234',
    market: 'US',
    averageRating: 3.5,
    totalRatingsCount: 200,
    reviewsCount: 2,
    star5Count: 50,
    star4Count: 45,
    star3Count: 5,
    star2Count: 10,
    star1Count: 90,
    star5ReviewCount: 1,
    star4ReviewCount: 0,
    star3ReviewCount: 0,
    star2ReviewCount: 0,
    star1ReviewCount: 1
} as RatingsSummary);

const mockSimpleProduct: SimpleProduct = {
    Name: 'Crew neck server',
    RecordId: 123,
    MasterProductId: 123,
    BasePrice: 25,
    Price: 25,
    AdjustedPrice: 25,
    ProductTypeValue: 1,
    PrimaryImageUrl: 'Products/93048_000_001.png',
    Dimensions: [
        {
            DimensionTypeValue: 3,
            DimensionValue: {
                RecordId: 1,
                Value: 'S'
            }
        },
        {
            DimensionTypeValue: 4,
            DimensionValue: {
                RecordId: 3,
                Value: 'Large'
            }
        }
    ]
};

const mockData = {
    userReview: RetailActions.wrapInResolvedAsyncResult<Review>({ rating: 4, title: 'my title', reviewText: 'my text' }),
    ratingsSummary,
    product: RetailActions.wrapInResolvedAsyncResult<SimpleProduct>(mockSimpleProduct),
    ratingsReviewsState: RetailActions.wrapInResolvedAsyncResult<IRatingsReviewsState>(undefined),
    reviewsList: AsyncResult.resolve({
        items: [
            {
                reviewId: 'Review-1',
                productId: 'product1',
                userName: 'user1',
                rating: 3.5,
                market: 'US',
                locale: 'en',
                thoughtfulnessScore: 0,
                helpfulPositive: 50,
                helpfulNegative: 10,
                reviewText:
                    'Lorem ipsum dolor sit amet, cu fugit copiosae quo, nam illud docendi iudicabit ex. ' +
                    'Menandri expetendis dissentiunt ut per, mea cu error adipiscing. At solum causae bonorum vis, pri dictas praesent ut. ' +
                    'Per ea eruditi indoctum omittantur, sea ad exerci salutandi laboramus. Dico noluisse maiestatis in vel.',
                title: 'Some title to test reviews card layout',
                submittedDateTime: new Date('2019-03-04T19:52:10.044Z'),
                isTakenDown: false,
                violationsFound: false,
                userResponse: {
                    responseId: 'Response-1',
                    reviewId: 'Review-1',
                    responderName: 'Microsoft Store',
                    responseText:
                        'Hi there, Thanks you for taking the time to leave a review. Let us know how your experience at the Microsoft Store goes.',
                    isTakenDown: false,
                    violationsFound: false,
                    market: 'US',
                    locale: 'en',
                    submittedDateTime: new Date('2019-03-05T14:02:55.070Z'),
                    isPublic: true
                },
                isPublished: true,
                isRevised: false,
                updatedSinceResponse: false
            },
            {
                reviewId: 'Review-2',
                productId: 'product1',
                userName: 'user1',
                rating: 2,
                market: 'US',
                locale: 'en',
                thoughtfulnessScore: 0,
                helpfulPositive: 50,
                helpfulNegative: 10,
                reviewText:
                    'Lorem ipsum dolor sit amet, cu fugit copiosae quo, nam illud docendi iudicabit ex. ' +
                    'Menandri expetendis dissentiunt ut per, mea cu error adipiscing. At solum causae bonorum vis, pri dictas praesent ut. ' +
                    'Per ea eruditi indoctum omittantur, sea ad exerci salutandi laboramus. Dico noluisse maiestatis in vel.',
                title: 'Some title to test reviews card layout',
                submittedDateTime: new Date('2019-03-04T19:52:10.044Z'),
                isTakenDown: false,
                violationsFound: false,
                userResponse: {
                    responseId: 'Response-2',
                    reviewId: 'Review-2',
                    responderName: 'Microsoft Store',
                    responseText:
                        'Hi there, Thanks you for taking the time to leave a review. Let us know how your experience at the Microsoft Store goes.',
                    isTakenDown: false,
                    violationsFound: false,
                    market: 'US',
                    locale: 'en',
                    submittedDateTime: new Date('2019-03-05T14:02:55.070Z'),
                    isPublic: true
                },
                isPublished: true,
                isRevised: false,
                updatedSinceResponse: false
            }
        ],
        pagingInfo: {
            continuousToken: 'continuousToken',
            totalItems: 2
        }
    } as Reviews)
};

describe('Reviews list', () => {
    it('Render correctly.', () => {
        const moduleProps: IReviewsListProps<IReviewsListData> = {
            ...(buildMockModuleProps(mockData, mockActions, mockConfig, mockAuthenticatedContextSignedIn) as IReviewsListProps<
                IReviewsListData
            >),
            resources,
            renderModuleAttributes: jest.fn()
        };
        const viewProps = {
            resources,
            context: mockCoreContext,
            config: mockConfig,
            data: mockData,
            moduleProps: { moduleProps },
            filterByDropdown: <div />,
            sortByDropdown: <div />,
            userReview: [{ rating: 4, title: 'my title', reviewText: 'my text' }],
            reviewCards: [{ rating: 4, title: 'my title', reviewText: 'my text' }],
            state: { isFilterApplied: true },
            noReviewsWithFilterMessage: <div />,
            reviewModal: modalProps,
            reportReviewModal: modalProps,
            refineReviewsProps: { className: 'ms-reviews-list__refiners' },
            reviewsListProps: { className: 'ms-reviews-list__reviews' }
        };

        // @ts-expect-error
        const component = render(<ReviewsListview {...viewProps} />);
        expect(component).toMatchSnapshot();
    });
    it('Render correctly with userReview and zero card', () => {
        const moduleProps: IReviewsListProps<IReviewsListData> = {
            ...(buildMockModuleProps(mockData, mockActions, {}, mockAuthenticatedContextSignedIn) as IReviewsListProps<IReviewsListData>),
            resources,
            renderModuleAttributes: jest.fn()
        };
        const viewProps = {
            resources,
            context: mockCoreContext,
            config: mockConfig,
            data: mockData,
            moduleProps: { moduleProps },
            userReview: [{ rating: 4, title: 'my title', reviewText: 'my text' }],
            reviewCards: [],
            state: { isFilterApplied: true, reported: true },
            noReviewsWithFilterMessage: <div />,
            reportReviewModal: {
                modal: <div />,
                modalHeader: <div />,
                modalFooter: <div />,
                modalBody: <div />,
                header: <div />,
                headerSubmitted: <div />,
                cancelButton: <div />,
                submitButton: <div />,
                succesfulButton: <div />,
                reportMessage: <div />,
                reportSubmittedMessage: <div />,
                radioButtons: <div />,
                error: <div />
            },
            reviewModal: {
                modal: <div />,
                modalHeader: <div />,
                modalFooter: <div />,
                modalBody: <div />,
                header: <div />,
                headerSubmitted: <div />,
                cancelButton: <div />,
                submitButton: <div />,
                succesfulButton: <div />,
                reportMessage: <div />,
                reportSubmittedMessage: <div />,
                radioButtons: <div />,
                error: <div />
            }
        };

        // @ts-expect-error
        const component = render(<ReviewsListview {...viewProps} />);
        expect(component).toMatchSnapshot();
    });
    it('Render correctly with cards', () => {
        const moduleProps: IReviewsListProps<IReviewsListData> = {
            ...(buildMockModuleProps(mockData, mockActions, {}, mockAuthenticatedContextSignedIn) as IReviewsListProps<IReviewsListData>),
            resources,
            renderModuleAttributes: jest.fn()
        };
        const viewProps = {
            moduleProps: { moduleProps },
            reviewCards: [],
            state: { isFilterApplied: false }
        };

        // @ts-expect-error
        const component = render(<ReviewsListview {...viewProps} />);
        expect(component).toMatchSnapshot();
    });
});
