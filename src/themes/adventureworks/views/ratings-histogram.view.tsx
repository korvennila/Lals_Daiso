/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { RatingComponent } from '@msdyn365-commerce/components';
import { ICoreContext } from '@msdyn365-commerce/core';
import { IHistogramItemViewProps, IRatingsHistogramData, IRatingsHistogramViewProps } from '@msdyn365-commerce-modules/ratings-reviews';
import { format, Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IRatingsHistogramProps, IRatingsHistogramResources } from '../definition-extensions/ratings-histogram.ext.props.autogenerated';

/**
 * Histogram item.
 * @param props - Histogram Item ViewProps.
 * @returns Histogram Item node.
 */
const histogramItem = (props: IHistogramItemViewProps) => {
    return (
        <Node {...props.buttonProps}>
            {props.starLabel}
            {props.bar}
        </Node>
    );
};

/**
 * Average ratings.
 * @param data - Props data.
 * @param context - Histogram Item ViewProps.
 * @param typeName - Histogram Item ViewProps.
 * @param componentId - Histogram Item ViewProps.
 * @param resources - Module resource strings.
 * @returns Average ratings.
 */
const averageRating = (
    data: IRatingsHistogramData,
    context: ICoreContext,
    typeName: string,
    componentId: string,
    resources: IRatingsHistogramResources
) => {
    const defaultAverageRating: number = 0;
    const reviewsCount = data.ratingsSummary.result?.reviewsCount ?? defaultAverageRating;
    const reviewsCountString = resources.numberOfReviewsString
        ? format(resources.numberOfReviewsString, reviewsCount)
        : `${reviewsCount} reviews`;

    return (
        <div className='ms-ratings-histogram__ratings'>
            <div className='ms-ratings-histogram__ratings__heading'>{data.ratingsSummary.result?.averageRating}</div>
            <div>
                <RatingComponent
                    context={context}
                    id={componentId}
                    typeName={typeName}
                    avgRating={data.ratingsSummary.result?.averageRating ?? defaultAverageRating}
                    readOnly
                    ariaLabel={format(resources.averageRatingAriaLabel, data.ratingsSummary.result?.averageRating, '5')}
                    data={{}}
                />
            </div>
            <div className='ms-ratings-histogram__ratings__reviews'>{reviewsCountString}</div>
        </div>
    );
};

/**
 * Histogram view.
 * @param props - Ratings HistogramV iewProps.
 * @returns Histogram view module.
 */
const RatingsHistogramView: React.FC<IRatingsHistogramViewProps & IRatingsHistogramProps<{}>> = props => {
    const { heading, histogramItems, histogramProps, moduleProps, data, resources } = props;
    const context = props.context;
    const typeName = props.typeName;
    const moduleId = props.id;

    return (
        <Module {...moduleProps}>
            {heading}
            <div className='ms-ratings-histogram__container'>
                {averageRating(data, context, typeName, moduleId, resources)}
                <Node {...histogramProps}>
                    {histogramItems.map(item => {
                        return histogramItem(item);
                    })}
                </Node>
            </div>
        </Module>
    );
};

export default RatingsHistogramView;
