/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { getRichTextHtml } from '@msdyn365-commerce/core';
import * as React from 'react';

/**
 * Product specification table row.
 */
export interface IProductSpecificationTableRow {
    productName?: string;
    cellData?: React.ReactNode;
    className?: string;
}

/**
 * Product specification table row component.
 * @param props - For product specification table row.
 * @param props.productName - Product name.
 * @param props.cellData - Cell data.
 * @param props.className - Class name.
 * @returns - Returns JSX element.
 */
export const ProductSpecificationTableRow: React.FC<IProductSpecificationTableRow> = ({ productName, cellData, className }) => (
    <tr className={className}>
        <th scope='row'>
            {/* eslint-disable-next-line react/no-danger */}
            <span dangerouslySetInnerHTML={getRichTextHtml(productName)} />
        </th>
        <td>{cellData}</td>
    </tr>
);
