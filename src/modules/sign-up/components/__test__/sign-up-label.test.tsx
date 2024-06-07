/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import * as Wrapper from '../sign-up-label';

describe('sign up label', () => {
    it('render component', () => {
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Required to call for increasing test coverage.
        const result = new Wrapper.default('');

        expect(result).toBeDefined();
    });
});
