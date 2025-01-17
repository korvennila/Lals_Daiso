/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { IAny, IComponentProps, ICoreContext, IGeneric } from '@msdyn365-commerce/core';
import { isMobile, VariantType } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import React from 'react';

/**
 * Resources which are used in order details header.
 */
export interface IOrderDetailsTableHeaderResources {
    orderDetailsProductNumberText: string;
    orderDetailsProductText: string;
    orderDetailsUnitPriceText: string;
    orderDetailsModeOfDeliveryText: string;
    orderDetailsStatusText: string;
    orderDetailsQuantityText: string;
    orderDetailsUnitOfMeasureText: string;
    orderDetailsTotalText: string;
    orderDetailsActionsText: string;
    orderDetailsSelectAllRadioAriaLabelText: string;
    orderDetailsConfirmedShipDateTextForTableHeader: string;
}

/**
 * Configuration of the component.
 */
export interface IOrderDetailsTableHeaderProps extends IComponentProps {
    context: ICoreContext<IGeneric<IAny>>;
    className: string;

    resources: IOrderDetailsTableHeaderResources;

    isCashAndCarryTransaction: boolean;
    isSelectedAll: boolean;
    isSelectionModeEnabled: boolean;
    isChannelMultipleCatalogsFeatureEnabled?: boolean;
    onSelectAll(isSelected: boolean): void;
    confirmedShipDateAvailable?: boolean;
}

/**
 * Renders checkbox for order details lines selection.
 * @param props - Order detail table header props.
 * @returns React element.
 */
const OrderDetailsHeaderCheckboxComponent: React.FC<IOrderDetailsTableHeaderProps> = (props: IOrderDetailsTableHeaderProps) => {
    const switchCheckedState = React.useCallback(() => {
        props.onSelectAll(!props.isSelectedAll);
    }, [props]);

    return (
        <label className={classnames(`${props.className}__checkbox-container`, 'checkbox-container')}>
            <input
                className={classnames(`${props.className}__checkbox-input`, 'checkbox-input')}
                type='checkbox'
                aria-label={props.resources.orderDetailsSelectAllRadioAriaLabelText}
                aria-checked={props.isSelectedAll}
                checked={props.isSelectedAll}
                onChange={switchCheckedState}
            />
            <span className={classnames(`${props.className}__checkmark`, 'checkmark')} />
        </label>
    );
};

/**
 * Renders desktop view cells.
 * @param props - Configuration of the module.
 * @returns List of cells for the header.
 */
const OrderDetailsDesktopHeaderCellsComponent: React.FC<IOrderDetailsTableHeaderProps> = (props: IOrderDetailsTableHeaderProps) => {
    const { resources } = props;

    const columnWithNumberClassName = `${props.className}__row__column-with-number`;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- app configs are of generic type
    const shouldDisplayUnitOfMeasure =
        props.context.app.config.unitOfMeasureDisplayType && props.context.app.config.unitOfMeasureDisplayType !== 'none';

    return (
        <>
            {props.isSelectionModeEnabled ? (
                <th>
                    <OrderDetailsHeaderCheckboxComponent {...props} />
                </th>
            ) : (
                undefined
            )}
            <th />
            <th>{resources.orderDetailsProductNumberText}</th>
            <th>{resources.orderDetailsProductText}</th>
            <th className={columnWithNumberClassName}>{resources.orderDetailsUnitPriceText}</th>
            <th>{resources.orderDetailsModeOfDeliveryText}</th>
            {props.isCashAndCarryTransaction ? undefined : <th>{resources.orderDetailsStatusText}</th>}
            <th className={columnWithNumberClassName}>{resources.orderDetailsQuantityText}</th>
            {shouldDisplayUnitOfMeasure && <th>{resources.orderDetailsUnitOfMeasureText}</th>}

            <th className={columnWithNumberClassName}>{resources.orderDetailsTotalText}</th>
            <th className={columnWithNumberClassName}>{resources.orderDetailsConfirmedShipDateTextForTableHeader}</th>
            <th>{resources.orderDetailsActionsText}</th>
        </>
    );
};

/**
 * Renders mobile view cells.
 * @param props - Configuration of the module.
 * @returns List of cells for the header.
 */
const OrderDetailsMobileHeaderCellsComponent: React.FC<IOrderDetailsTableHeaderProps> = (props: IOrderDetailsTableHeaderProps) => {
    const { resources } = props;
    return (
        <>
            {props.isSelectionModeEnabled ? (
                <th>
                    <OrderDetailsHeaderCheckboxComponent {...props} />
                </th>
            ) : (
                undefined
            )}
            <th />
            <th className={`${props.className}__row`}>{resources.orderDetailsProductText}</th>
        </>
    );
};

/**
 * Order details table header component.
 * @param props - Configuration of the component.
 * @returns React node with the header.
 */
export const OrderDetailsTableHeaderComponent: React.FC<IOrderDetailsTableHeaderProps> = (props: IOrderDetailsTableHeaderProps) => {
    const rowClassName = `${props.className}__row`;

    let headerCells: JSX.Element;
    const isMobileView = isMobile({ variant: VariantType.Viewport, context: props.context.request }) === 'xs';
    if (isMobileView) {
        headerCells = <OrderDetailsMobileHeaderCellsComponent {...props} />;
    } else {
        headerCells = <OrderDetailsDesktopHeaderCellsComponent {...props} />;
    }

    return (
        <thead className={props.className}>
            <tr className={rowClassName}>{headerCells}</tr>
        </thead>
    );
};
