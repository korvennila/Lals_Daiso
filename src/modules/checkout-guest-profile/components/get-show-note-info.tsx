/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { INodeProps } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

export interface IShowNoteInfoInput {
    noteDescription?: string;
}

export interface IShowNoteInfo {
    showInfoProps: INodeProps;
    noteDescription: React.ReactNode;
}

const getNoteInfo = ({ noteDescription }: IShowNoteInfoInput): IShowNoteInfo => ({
    showInfoProps: { className: 'ms-checkout-guest-profile__selected-item' },
    noteDescription: <span className='ms-checkout-guest-profile__selected-email'>{noteDescription}</span>
});

export default getNoteInfo;
