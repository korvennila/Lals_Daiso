/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import classnames from 'classnames';
import * as React from 'react';

import { wishlistStatus } from '../wishlist-items';

export interface IWishlistItemsStatusMessageProps {
    className?: string;
    errorType: wishlistStatus;
    text?: string;
}

export const WishlistItemsStatusMessage: React.FC<IWishlistItemsStatusMessageProps> = ({ className, errorType, text }) => {
    switch (errorType) {
        case 'EMPTY':
            return <p className={classnames('ms-wishlist-items__message-empty', className)}>{text}</p>;
        case 'FAILED':
            return <p className={classnames('ms-wishlist-items__message-failed', className)}>{text}</p>;
        case 'LOADING':
        default:
            return <p className={className ? 'ms-wishlist-items__message-exists-product' : 'ms-wishlist-items__message-waiting'}>{text}</p>;
    }
};
