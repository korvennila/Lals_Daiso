/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { Button, INodeProps } from '@msdyn365-commerce-modules/utilities';
import { Note } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import classnames from 'classnames';
import * as React from 'react';

export interface IAddNoteInfoInput {
    inputRef?: React.RefObject<HTMLInputElement>;
    hasError: boolean;
    note?: Note;
    onChange(note: string): void;
    resources: {
        noteLabel: string;
        noteErrortext: string;
        saveBtnLabel: string;
        cancelBtnLabel: string;
    };
    canSubmit: boolean;
    canCancel: boolean;
    onSubmit(): void;
    onCancel(): void;
}

export interface IAddNoteInfo {
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
const onInputChangeHandler = (onChange: (note: string) => void) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value || '');
};

const getAddNoteInfo = ({
    hasError,
    inputRef,
    note,
    canSubmit,
    canCancel,
    onSubmit,
    onCancel,
    onChange,
    resources: { noteLabel, noteErrortext, saveBtnLabel, cancelBtnLabel }
}: IAddNoteInfoInput): IAddNoteInfo => {
    const onInputChange = onInputChangeHandler(onChange);
    return {
        addFormProps: { className: 'ms-checkout-guest-profile__add-notes-info' },
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
                {noteLabel}
            </label>
        ),
        error: hasError && (
            <span id='ms-checkout-guest-profile__error' className='ms-checkout-guest-profile__input-error' role='alert' aria-live='polite'>
                {noteErrortext}
            </span>
        ),
        input: (
            <input
                ref={inputRef}
                type='text'
                onChange={onInputChange}
                className='ms-checkout-guest-profile__input-text form-control notes-input'
                aria-label={noteLabel}
                value={note?.Description || ''}
                aria-labelledby='ms-checkout-guest-profile__label ms-checkout-guest-profile__error'
            />
        )
    };
};

export default getAddNoteInfo;
