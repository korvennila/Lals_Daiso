/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { buildMockModuleProps } from '@msdyn365-commerce/core';
import { render } from 'enzyme';
import * as React from 'react';

import RatingsHistogramView from '../views/ratings-histogram.view';

const mockData = {
    ratingsSummary: {},
    ratingsReviewsState: {}
};

const mockData1 = {
    ratingsSummary: { result: { reviewsCount: 10, averageRating: 7 } },
    ratingsReviewsState: {}
};

const mockResources = {
    numberOfReviewsString: '4 reviews'
};

const mockString = 'stars';
const createItem = (stars: number) => {
    return {
        starLabel: (
            <div>
                {stars} {` `} {mockString}
            </div>
        ),
        bar: (
            <div>
                {stars} {` `} {mockString}
            </div>
        ),
        percentage: (
            <div>
                {stars} {` `} {mockString}
            </div>
        ),
        buttonProps: { className: 'foo' }
    };
};

const items = [createItem(5), createItem(4), createItem(3), createItem(2), createItem(1)];

let mockProps = {};

describe('ratings-histogram unit tests - View', () => {
    it('renders correctly', () => {
        const moduleProps = buildMockModuleProps({}, {});
        const selectFilterBy = jest.fn();
        mockProps = {
            ...moduleProps,
            className: 'className',
            data: mockData,
            moduleProps: {
                moduleProps,
                className: 'className'
            },
            resources: mockResources,
            histogramItems: items,
            averageRating: '<div>ratings</div>',
            heading: '<h2>heading</h2>',
            averageNumber: '<p>3</p>',
            totalReviews: '<p>30</p>',
            ratingsSummaryProps: { className: 'ms-ratings-histogram__summary' },
            histogramProps: { className: 'ms-ratings-histogram__histogram' },
            callbacks: {
                selectFilterBy
            }
        };

        // @ts-expect-error
        const component = render(<RatingsHistogramView {...mockProps} />);
        expect(component).toMatchSnapshot();
    });

    it('renders correctly -- review count', () => {
        const moduleProps = buildMockModuleProps({}, {});
        const selectFilterBy = jest.fn();
        mockProps = {
            ...moduleProps,
            className: 'className',
            data: mockData1,
            moduleProps: {
                moduleProps,
                className: 'className'
            },
            resources: mockResources,
            histogramItems: items,
            averageRating: '<div>ratings</div>',
            heading: '<h2>heading</h2>',
            averageNumber: '<p>3</p>',
            totalReviews: '<p>30</p>',
            ratingsSummaryProps: { className: 'ms-ratings-histogram__summary' },
            histogramProps: { className: 'ms-ratings-histogram__histogram' },
            callbacks: {
                selectFilterBy
            }
        };

        // @ts-expect-error
        const component = render(<RatingsHistogramView {...mockProps} />);
        expect(component).toMatchSnapshot();
    });
});
