/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IAddContactInfo } from './components/get-add-contact-info';
import { IAddCustomerRefInfo } from './components/get-add-customer-reference-info';
import { IAddPurchaseOrderInfo } from './components/get-add-customer-requisition-info';
import { IShowContactInfo } from './components/get-show-contact-info';
import { IShowNoteInfo } from './components/get-show-note-info';
import { IShowCustomerRefInfo } from './components/get-show-customer-reference-info';
import { IShowPurchaseOrderInfo } from './components/get-show-customer-requisition-info';
import { IAddNoteInfo } from './components/get-add-note-info';
import { ICheckoutGuestProfileViewProps } from './checkout-guest-profile';

export const ShowContactInfo: React.FC<IShowContactInfo> = ({ showInfoProps, email, editButton }) => (
    <Node {...showInfoProps}>
        {email}
        {editButton}
    </Node>
);

export const ShowCustomerRefInfo: React.FC<IShowCustomerRefInfo> = ({ showInfoProps, customerRef }) => (
    <Node {...showInfoProps}>{customerRef}</Node>
);

export const ShowPurchaseOrderInfo: React.FC<IShowPurchaseOrderInfo> = ({ showInfoProps, purchaseOrder }) => (
    <Node {...showInfoProps}>{purchaseOrder}</Node>
);

export const ShowNoteInfo: React.FC<IShowNoteInfo> = ({ showInfoProps, noteDescription }) => (
    <Node {...showInfoProps}>{noteDescription}</Node>
);

export const AddContactInfo: React.FC<IAddContactInfo> = ({
    addFormProps,
    submitButton,
    cancelButton,
    inputGroupProps,
    label,
    error,
    input
}) => (
    <Node {...addFormProps}>
        <Node {...inputGroupProps}>
            {label}
            {error}
            {input}
        </Node>
        {submitButton}
        {cancelButton}
    </Node>
);

export const AddPurchaseOrderInfo: React.FC<IAddPurchaseOrderInfo> = ({
    addFormProps,
    submitButton,
    cancelButton,
    inputGroupProps,
    label,
    input
}) => (
    <Node {...addFormProps}>
        <Node {...inputGroupProps}>
            {label}
            {input}
        </Node>
        {submitButton}
        {cancelButton}
    </Node>
);

export const AddNoteInfo: React.FC<IAddNoteInfo> = ({ addFormProps, submitButton, cancelButton, inputGroupProps, label, input }) => (
    <Node {...addFormProps}>
        <Node {...inputGroupProps}>
            {label}
            {input}
        </Node>
        {submitButton}
        {cancelButton}
    </Node>
);

export const AddCustomerRefInfo: React.FC<IAddCustomerRefInfo> = ({
    addFormProps,
    submitButton,
    cancelButton,
    inputGroupProps,
    label,
    input
}) => (
    <Node {...addFormProps}>
        <Node {...inputGroupProps}>
            {label}
            {input}
        </Node>
        {submitButton}
        {cancelButton}
    </Node>
);

const CheckoutGuestProfileView: React.FC<ICheckoutGuestProfileViewProps> = ({
    moduleProps,
    checkoutErrorRef,
    alert,
    showContactInfo,
    showPurchaseOrderInfo,
    showCustomerRefInfo,
    showNoteInfo,
    addContactInfo,
    addPurchaseOrderInfo,
    addCustomerRefInfo,
    addNoteInfo
}) => {
    return (
        <Module {...moduleProps} ref={checkoutErrorRef}>
            {alert}
            {showContactInfo && <ShowContactInfo {...showContactInfo} />}
            {showCustomerRefInfo && <ShowCustomerRefInfo {...showCustomerRefInfo} />}
            {showPurchaseOrderInfo && <ShowPurchaseOrderInfo {...showPurchaseOrderInfo} />}
            {showNoteInfo && <ShowNoteInfo {...showNoteInfo} />}
            {addContactInfo && <AddContactInfo {...addContactInfo} />}
            {addCustomerRefInfo && <AddCustomerRefInfo {...addCustomerRefInfo} />}
            {addPurchaseOrderInfo && <AddPurchaseOrderInfo {...addPurchaseOrderInfo} />}
            {addNoteInfo && <AddNoteInfo {...addNoteInfo} />}
        </Module>
    );
};

export default CheckoutGuestProfileView;
