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
            <h2>Config Value: {props.config.showText}</h2>
            <h2>Resource Value: {props.resources.resourceKey}</h2>
            {isCod && orderId && <h2>Order ID: {orderId}</h2>}
        </div>
    );
};
