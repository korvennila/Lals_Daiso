/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as React from 'react';

export interface IWishlistItemDimension {
    key: string;
    className?: string;
    dimensionType: string;
    dimensionValue: string;
}

export const WishlistItemDimension: React.FC<IWishlistItemDimension> = ({ key, className, dimensionType, dimensionValue }) => (
    <div key={key} className={className}>
        <span className='msc-wishlist-dimension__label'>{dimensionType}:</span>
        <span className='msc-wishlist-dimension__value'>{dimensionValue}</span>
    </div>
);
