/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Button, INodeProps } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface IShowContactInfoInput {
    canEdit: boolean;
    email: string;
    resources: {
        editBtnLabel: string;
    };
    onEdit(): void;
}

export interface IShowContactInfo {
    showInfoProps: INodeProps;
    email: React.ReactNode;
    editButton?: React.ReactNode;
}

const getContactInfo = ({ canEdit, email, resources: { editBtnLabel }, onEdit }: IShowContactInfoInput): IShowContactInfo => ({
    showInfoProps: { className: 'ms-checkout-guest-profile__selected-item' },
    email: <span className='ms-checkout-guest-profile__selected-email'>{email}</span>,
    editButton: canEdit && (
        <Button className='ms-checkout-guest-profile__btn-edit' title={editBtnLabel} color='link' onClick={onEdit}>
            {editBtnLabel}
        </Button>
    )
});

export default getContactInfo;
