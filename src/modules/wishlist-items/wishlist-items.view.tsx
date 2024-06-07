/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import {
    getPayloadObject,
    getTelemetryAttributes,
    INodeProps,
    ITelemetryContent,
    Module,
    Node
} from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import * as React from 'react';

import { IWishlistItemViewProps } from '@msdyn365-commerce-modules/wishlist';
import { IWishlistItemsViewProps } from './wishlist-items';
import Button from 'reactstrap/lib/Button';

const WishlistItemsView: React.FC<IWishlistItemsViewProps> = props => {
    const {
        WishlistItems,
        status,
        statusMessage,
        heading,
        Products,
        products,
        Product,
        ProductDetails,
        ProductDimensions,
        telemetryContent,
        statusNotExistsMessage
    } = props;

    return (
        <Module {...WishlistItems}>
            {heading}
            {statusNotExistsMessage}
            {status !== 'SUCCESS' && statusMessage}
            {status === 'EMPTY' && (
                <Node className='add-favourites_btn'>
                    <Button>Add Favourites</Button>
                </Node>
            )}
            {Products && products && products.length > 0 && (
                <Node {...Products}>
                    {products &&
                        products.map(product => {
                            return product && _renderItem(product, Product, ProductDimensions, ProductDetails, telemetryContent);
                        })}
                </Node>
            )}
        </Module>
    );
};

const _renderItem = (
    product: IWishlistItemViewProps,
    Product?: INodeProps,
    ProductDimensions?: INodeProps,
    ProductDetails?: INodeProps,
    telemetryContent?: ITelemetryContent
): JSX.Element | null => {
    const {
        key,
        productImage,
        productLink,
        productPrice,
        productDimensions,
        addToCartButton,
        removeButton,
        productStatusMessage,
        entireProductLink,
        productName,
        productAriaLabel,
        inventoryInformation,
        productUnitOfMeasure
    } = product;
    const payLoad = getPayloadObject('click', telemetryContent!, '', key);
    const productAttributes = getTelemetryAttributes(telemetryContent!, payLoad);
    if (entireProductLink) {
        return (
            <Node key={key} className={Product!.className} {...Product}>
                <Node
                    href={entireProductLink}
                    className={classnames('entire-product-link ', ProductDetails!.className)}
                    {...productAttributes}
                    aria-label={productAriaLabel}
                    tag={ProductDetails!.tag}
                >
                    {productImage}
                    {productName}
                    {productDimensions && ProductDimensions && (
                        <Node {...ProductDimensions}>
                            {productDimensions.map(dimension => {
                                return dimension;
                            })}
                        </Node>
                    )}
                    {productPrice}
                    {productUnitOfMeasure}
                </Node>
                {inventoryInformation}
                {addToCartButton}
                {removeButton}
                {productStatusMessage}
            </Node>
        );
    }
    return (
        <Node key={key} className={Product!.className} {...Product}>
            {productImage}
            {productLink}
            {productDimensions && ProductDimensions && (
                <Node {...ProductDimensions}>
                    {productDimensions.map(dimension => {
                        return dimension;
                    })}
                </Node>
            )}
            {productPrice}
            {addToCartButton}
            {removeButton}
            {productStatusMessage}
        </Node>
    );
};

export default WishlistItemsView;
