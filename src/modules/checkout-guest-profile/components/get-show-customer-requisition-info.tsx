/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { INodeProps } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface IShowPurchaseOrderInfoInput {
    canEdit: boolean;
    purchaseOrder: string;
    resources: {
        editBtnLabel: string;
    };
    onEdit(): void;
}

export interface IShowPurchaseOrderInfo {
    showInfoProps: INodeProps;
    purchaseOrder: React.ReactNode;
}

const getPurchaseOrderInfo = ({
    canEdit,
    purchaseOrder,
    resources: { editBtnLabel },
    onEdit
}: IShowPurchaseOrderInfoInput): IShowPurchaseOrderInfo => ({
    showInfoProps: { className: 'ms-checkout-guest-profile__selected-item' },
    purchaseOrder: <span className='ms-checkout-guest-profile__selected-po'>{purchaseOrder}</span>
});

export default getPurchaseOrderInfo;
