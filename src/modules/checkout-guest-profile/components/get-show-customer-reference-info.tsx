/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { INodeProps } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface IShowCustomerRefInfoInput {
    canEdit: boolean;
    customerRef: string;
    resources: {
        editBtnLabel: string;
    };
    onEdit(): void;
}

export interface IShowCustomerRefInfo {
    showInfoProps: INodeProps;
    customerRef: React.ReactNode;
}

const getCustomerRefInfo = ({
    canEdit,
    customerRef,
    resources: { editBtnLabel },
    onEdit
}: IShowCustomerRefInfoInput): IShowCustomerRefInfo => ({
    showInfoProps: { className: 'ms-checkout-guest-profile__selected-item' },
    customerRef: <span className='ms-checkout-guest-profile__selected-email'>{customerRef}</span>
});

export default getCustomerRefInfo;
