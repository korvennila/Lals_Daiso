/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Button, INodeProps } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import * as React from 'react';

export interface IAddCustomerRefInfoInput {
    inputRef?: React.RefObject<HTMLInputElement>;
    hasError: boolean;
    customerRef: string | undefined;
    resources: {
        customerRefLabel: string;
        customerRefErrortext: string;
        saveBtnLabel: string;
        cancelBtnLabel: string;
    };
    canSubmit: boolean;
    canCancel: boolean;
    onChange(email: string): void;
    onSubmit(): void;
    onCancel(): void;
}

export interface IAddCustomerRefInfo {
    addFormProps: INodeProps;
    submitButton: React.ReactNode;
    cancelButton: React.ReactNode;
    inputGroupProps: INodeProps;
    label: React.ReactNode;
    error: React.ReactNode;
    input: React.ReactNode;
}

/**
 * On Input change handler function.
 * @param onChange -On change input function.
 * @returns Call of onChange function.
 */
const onInputChangeHandler = (onChange: (customerRef: string) => void) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value || '');
};

const getAddCustomerRefInfo = ({
    hasError,
    inputRef,
    customerRef,
    canSubmit,
    canCancel,
    onChange,
    onSubmit,
    onCancel,
    resources: { customerRefLabel, customerRefErrortext, saveBtnLabel, cancelBtnLabel }
}: IAddCustomerRefInfoInput): IAddCustomerRefInfo => {
    const onInputChange = onInputChangeHandler(onChange);

    return {
        addFormProps: { className: 'ms-checkout-guest-profile__add-customer-reference-number' },
        submitButton: canSubmit && (
            <Button className='ms-checkout-guest-profile__btn-save' title={saveBtnLabel} color='primary' onClick={onSubmit}>
                {saveBtnLabel}
            </Button>
        ),
        cancelButton: canCancel && (
            <Button className='ms-checkout-guest-profile__btn-cancel' title={cancelBtnLabel} color='secondary' onClick={onCancel}>
                {cancelBtnLabel}
            </Button>
        ),
        inputGroupProps: { className: classnames('ms-checkout-guest-profile__input', { 'is-invalid': hasError }) },
        label: (
            <label id='ms-checkout-guest-profile__label' className='ms-checkout-guest-profile__input-label'>
                {customerRefLabel}
            </label>
        ),
        error: hasError && (
            <span id='ms-checkout-guest-profile__error' className='ms-checkout-guest-profile__input-error' role='alert' aria-live='polite'>
                {customerRefErrortext}
            </span>
        ),
        input: (
            <input
                ref={inputRef}
                type='text'
                maxLength={60}
                className='ms-checkout-guest-profile__input-text form-control'
                aria-label={customerRefLabel}
                onChange={onInputChange}
                value={customerRef}
                aria-labelledby='ms-checkout-guest-profile__label ms-checkout-guest-profile__error'
            />
        )
    };
};

export default getAddCustomerRefInfo;
