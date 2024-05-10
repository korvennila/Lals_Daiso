/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { ArrayExtensions, ObjectExtensions } from '@msdyn365-commerce-modules/retail-actions';
import { Module, Node } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IProductSpecificationViewProps } from './product-specification';

const ProductSpecificationView: React.FC<IProductSpecificationViewProps> = props => {
    const { ProductSpecification, ProductSpecificationTableProps, ProductSpecificationTableBodyProps, productSpecificationResult } = props;
    const rowdata =
        productSpecificationResult &&
        ArrayExtensions.hasElements(productSpecificationResult) &&
        productSpecificationResult.filter(row => !ObjectExtensions.isNullOrUndefined(row));

    return rowdata && ArrayExtensions.hasElements(rowdata) ? (
        <Module {...ProductSpecification}>
            {props.title}
            <Node {...ProductSpecificationTableProps}>
                <Node {...ProductSpecificationTableBodyProps}>{rowdata}</Node>
            </Node>
        </Module>
    ) : null;
};

export default ProductSpecificationView;
