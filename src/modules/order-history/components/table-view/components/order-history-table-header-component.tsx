/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { IComponentProps, ICoreContext } from '@msdyn365-commerce/core';
import { isMobile, VariantType } from '@msdyn365-commerce-modules/utilities';
import React from 'react';

/**
 * Resources which are used in order history header.
 */
export interface IOrderHistoryTableHeaderResources {
    orderHistoryOrderNumberText: string;
    orderHistoryCreatedDateText: string;
    orderHistoryItemsText: string;
    orderHistoryTotalText: string;
    orderHistoryOriginText: string;
    orderPlacedByFullText?: string;
}

/**
 * Configuration of the component.
 */
export interface IOrderHistoryTableHeaderProps extends IComponentProps {
    context: ICoreContext;
    className: string;

    resources: IOrderHistoryTableHeaderResources;

    shouldShowChannelInfo: boolean;
    shouldShowOrderPlacedBy?: boolean;
}

/**
 * Renders desktop view cells.
 * @param props - Configuration of the module.
 * @returns List of cells for the header.
 */
const getDesktopHeaderCells = (props: IOrderHistoryTableHeaderProps) => {
    const { resources } = props;

    const columnWithNumberClassName = `${props.className}__row__column-with-number`;

    return (
        <>
            {props.shouldShowOrderPlacedBy && <th>{resources.orderPlacedByFullText}</th>}
            <th>{resources.orderHistoryOrderNumberText}</th>
            <th>{resources.orderHistoryCreatedDateText}</th>
            <th className={columnWithNumberClassName}>{resources.orderHistoryItemsText}</th>
            <th className={columnWithNumberClassName}>{resources.orderHistoryTotalText}</th>
            {props.shouldShowChannelInfo && <th>{resources.orderHistoryOriginText}</th>}
            <th />
        </>
    );
};

/**
 * Renders mobile view cells.
 * @param props - Configuration of the module.
 * @returns List of cells for the header.
 */
const getMobileHeaderCells = (props: IOrderHistoryTableHeaderProps) => {
    const { resources } = props;
    return (
        <>
            <th className={`${props.className}__row__mobile-cell`}>{resources.orderHistoryOrderNumberText}</th>
            <th />
        </>
    );
};

/**
 * Order history table header component.
 * @param props - Configuration of the component.
 * @returns React node with the header.
 */
export const OrderHistoryTableHeaderComponent: React.FC<IOrderHistoryTableHeaderProps> = (props: IOrderHistoryTableHeaderProps) => {
    const rowClassName = `${props.className}__row`;

    let headerCells: JSX.Element;
    const isMobileView = isMobile({ variant: VariantType.Viewport, context: props.context.request }) === 'xs';
    if (isMobileView) {
        headerCells = getMobileHeaderCells(props);
    } else {
        headerCells = getDesktopHeaderCells(props);
    }

    return (
        <thead className={props.className}>
            <tr className={rowClassName}>{headerCells}</tr>
        </thead>
    );
};
