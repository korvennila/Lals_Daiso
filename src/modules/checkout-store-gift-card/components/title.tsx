/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as React from 'react';

interface IGiftCardTitleProps {
    title: string;
}

const GiftCardTitle: React.FC<IGiftCardTitleProps> = ({ title }) => <label className='ms-checkout-gift-card__title'>{title}</label>;

export default GiftCardTitle;
