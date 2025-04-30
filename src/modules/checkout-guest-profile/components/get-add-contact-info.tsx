/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Button, INodeProps } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import * as React from 'react';

export interface IAddContactInfoInput {
    inputRef?: React.RefObject<HTMLInputElement>;
    hasError: boolean;
    email: string;
    resources: {
        emailLabel: string;
        emailErrortext: string;
        saveBtnLabel: string;
        cancelBtnLabel: string;
    };
    canSubmit: boolean;
    canCancel: boolean;
    onChange(email: string): void;
    onSubmit(): void;
    onCancel(): void;
}

export interface IAddContactInfo {
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
const onInputChangeHandler = (onChange: (email: string) => void) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value || '');
};

const getAddContactInfo = ({
    hasError,
    inputRef,
    email,
    canSubmit,
    canCancel,
    onChange,
    onSubmit,
    onCancel,
    resources: { emailLabel, emailErrortext, saveBtnLabel, cancelBtnLabel }
}: IAddContactInfoInput): IAddContactInfo => {
    const onInputChange = onInputChangeHandler(onChange);

    return {
        addFormProps: { className: 'ms-checkout-guest-profile__add-contact-info' },
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
                {emailLabel}
            </label>
        ),
        error: hasError && (
            <span id='ms-checkout-guest-profile__error' className='ms-checkout-guest-profile__input-error' role='alert' aria-live='polite'>
                {emailErrortext}
            </span>
        ),
        input: (
            <input
                ref={inputRef}
                type='text'
                className='ms-checkout-guest-profile__input-text form-control'
                aria-label={emailLabel}
                onChange={onInputChange}
                value={email}
                aria-labelledby='ms-checkout-guest-profile__label ms-checkout-guest-profile__error'
            />
        )
    };
};

export default getAddContactInfo;
