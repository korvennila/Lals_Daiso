/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import * as React from 'react';
import { IOrderHistoryTrackingViewProps } from './order-history-tracking';

export default (props: IOrderHistoryTrackingViewProps) => {
    const { config, handleTrackOrder, orderHistory, orderIdInputRef, resources, errorMessage, progressTracker } = props;

    return (
        <div className='order-history-tracking'>
            <h2>{config.showText}</h2>
            <input type='text' ref={orderIdInputRef} name='order-number' placeholder={resources.textBoxPlaceholder} />
            {errorMessage && <div className='orderHistory-error-message'>{errorMessage}</div>}
            {orderHistory && <div className='orderHistoryResponse'>{orderHistory}</div>}
            {progressTracker && <div className='orderHistory-progress-tracker'>{progressTracker}</div>}
            <button onClick={handleTrackOrder}>{resources.submitButtonText}</button>
        </div>
    );
};
