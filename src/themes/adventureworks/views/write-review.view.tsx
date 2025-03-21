/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { IImageSettings, Image, RichTextComponent } from '@msdyn365-commerce/core';
import { IWriteReviewData, IWriteReviewViewProps } from '@msdyn365-commerce-modules/ratings-reviews';
import { generateImageUrl } from '@msdyn365-commerce-modules/retail-actions';
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IWriteReviewProps } from '../definition-extensions/write-review.ext.props.autogenerated';

/**
 * Render Product Image.
 * @param props - WriteReview ViewProps.
 * @returns JSX Element.
 */
const renderProductImage = (props: IWriteReviewViewProps & IWriteReviewProps<IWriteReviewData>): JSX.Element => {
    const primaryImageSource = props.data.product.result?.PrimaryImageUrl;
    const imageUrl = generateImageUrl(primaryImageSource, props.context.request.apiSettings);
    const defaultImageSettings: IImageSettings = {
        viewports: {
            xs: { q: 'w=111&h=111&m=6', w: 111, h: 111 },
            sm: { q: 'w=130&h=130&m=6', w: 130, h: 130 },
            md: { q: 'w=130&h=130&m=6', w: 130, h: 130 },
            lg: { q: 'w=130&h=130&m=6', w: 130, h: 130 },
            xl: { q: 'w=130&h=130&m=6', w: 130, h: 130 }
        },
        lazyload: true,
        cropFocalRegion: true
    };

    return (
        <Image
            src={imageUrl ?? ''}
            fallBackSrc={primaryImageSource}
            loadFailureBehavior='empty'
            gridSettings={props.context.request.gridSettings!}
            imageSettings={props.config.imageSettings ? props.config.imageSettings : defaultImageSettings}
        />
    );
};

/**
 * Render Product Description.
 * @param props - WriteReview ViewProps.
 * @returns JSX Element.
 */
const renderProductDescription = (props: IWriteReviewViewProps & IWriteReviewProps<IWriteReviewData>): JSX.Element => {
    const product = props.data.product.result;
    return (
        <Node className='ms-review-product-description'>
            <div className='ms-review-product-image'>{renderProductImage(props)}</div>
            <div className='ms-review-product-details'>
                <div className='ms-review-product-title'>{product?.Name}</div>
                <div className='ms-review-product-sku-id'>{product?.ItemId}</div>
            </div>
        </Node>
    );
};

/**
 * Create Write Review Modal.
 * @param props - WriteReview ViewProps.
 * @returns JSX Element.
 */
const createReviewModal = (props: IWriteReviewViewProps & IWriteReviewProps<IWriteReviewData>): JSX.Element => {
    const { resources, moduleProps, reviewModal } = props;

    return (
        <Module {...reviewModal.modal} {...moduleProps}>
            {reviewModal.modalHeader}
            <Node {...reviewModal.modalBody}>
                <Node {...reviewModal.form}>
                    <Node className='ms-review-product'>
                        {renderProductDescription(props)}
                        <Node {...reviewModal.inputRow} className='ms-review-product__rating'>
                            <div className='ms-review-product__overallProductRatingLabel'>{resources.selectRatingLabel}</div>
                            {reviewModal.rating}
                        </Node>
                    </Node>
                    <Node {...reviewModal.inputRow} className='ms-review-product__title'>
                        {resources.reviewTitleLabel}
                        {reviewModal.titleInput}
                    </Node>
                    <Node {...reviewModal.inputRow} className='ms-review-product__write-review'>
                        {resources.reviewTextLabel}
                        {reviewModal.textInput}
                    </Node>
                    {reviewModal.privacyPolicyUrl}
                    {reviewModal.error}
                </Node>
            </Node>
            <Node {...reviewModal.modalFooter}>
                {reviewModal.submitButton}
                {reviewModal.cancelButton}
            </Node>
        </Module>
    );
};

/**
 * WriteReview view.
 * @param props - WriteReview ViewProps.
 * @returns WriteReview view module.
 */
const WriteReviewView: React.FC<IWriteReviewViewProps & IWriteReviewProps<IWriteReviewData>> = props => {
    const { config, heading, signInMessage, signInButton, modalToggle, moduleProps } = props;
    const { paragraph } = config;
    const isAuthenticated = props.context.request.user.isAuthenticated;
    const text = paragraph && <RichTextComponent text={paragraph} className='ms-write-review__text' />;

    return (
        <Module {...moduleProps}>
            {heading}
            {!isAuthenticated ? (
                <>
                    {signInMessage}
                    {signInButton}
                </>
            ) : (
                <>
                    {text}
                    {modalToggle}
                    {createReviewModal(props)}
                </>
            )}
        </Module>
    );
};

export default WriteReviewView;
