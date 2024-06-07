/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { PropsWithChildren } from 'react';

import SignUpInput, { ISignUpInputProps } from '../sign-up-input';

describe('sign up input', () => {
    it('render component', () => {
        const result = SignUpInput({
            id: '2',
            type: 'test',
            value: 'test',
            pattern: 'test',
            className: 'test',
            maxLength: '6',
            onChange: jest.fn
        } as PropsWithChildren<ISignUpInputProps>);

        expect(result).toBeDefined();
    });

    it('render component with incomplete data', () => {
        const result = SignUpInput({
            id: '2',
            type: 'test',
            value: 'test',
            pattern: '',
            className: 'test',
            onChange: jest.fn
        } as PropsWithChildren<ISignUpInputProps>);

        expect(result).toBeDefined();
    });
});
