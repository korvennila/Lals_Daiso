/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { ICodOrderConfirmationViewProps } from './cod-order-confirmation';

export default (props: ICodOrderConfirmationViewProps) => {
    const { isLoading, isCod, orderId } = props;

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='row'>
            <div className='msc-cod-order-confirmation-container'>{isCod && orderId && <h2>Your Reference No: {orderId}</h2>}</div>
        </div>
    );
};
