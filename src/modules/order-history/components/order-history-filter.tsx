/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { IComponentProps, msdyn365Commerce } from '@msdyn365-commerce/core';
import { Customer } from '@msdyn365-commerce/retail-proxy';
import { EnumExtensions } from '@msdyn365-commerce-modules/retail-actions';
import { Button, Popover } from '@msdyn365-commerce-modules/utilities';
import React from 'react';

export interface IOrderHistoryFilterResources {
    orderHistoryFilterYourOrderHistory: string;
    orderHistoryFilterOrganizationWide: string;
}

export interface IOrderHistoryFilterData {
    customerInformation: Customer;
}

export interface IOrderHistoryFilterProps extends IComponentProps<IOrderHistoryFilterData> {
    className: string;

    resources: IOrderHistoryFilterResources;

    currentState: OrderHistoryFilterState;
    onFilterStateChanged(state: OrderHistoryFilterState): void;
}

export enum OrderHistoryFilterState {
    CurrentUser,
    OrganizationWide
}

const getOrderHistoryFilterStateResources = (filterState: OrderHistoryFilterState, resources: IOrderHistoryFilterResources): string => {
    switch (filterState) {
        case OrderHistoryFilterState.CurrentUser:
            return resources.orderHistoryFilterYourOrderHistory;
        case OrderHistoryFilterState.OrganizationWide:
            return resources.orderHistoryFilterOrganizationWide;
        default:
            throw new Error('Failed to retrieve resource description for unknown order history filter state.');
    }
};

/**
 * On Click functionality.
 * @param onStateClick -Filter state function.
 * @param filterState -Order history filter state.
 * @returns On state click functionality.
 */
const onClickHandler = (onStateClick: (filterState: OrderHistoryFilterState) => void, filterState: OrderHistoryFilterState) => () => {
    onStateClick(filterState);
};

const renderFilterStateItem = (
    filterState: OrderHistoryFilterState,
    resources: IOrderHistoryFilterResources,
    className: string,
    onStateClick: (filterState: OrderHistoryFilterState) => void
): React.ReactNode => {
    const stateStringRepresentation = OrderHistoryFilterState[filterState];

    return (
        <button className={`${className}__item__${stateStringRepresentation}`} onClick={onClickHandler(onStateClick, filterState)}>
            {getOrderHistoryFilterStateResources(filterState, resources)}
        </button>
    );
};

/**
 * On Toggle Popover functionality.
 * @param setPopoverState -Set popover state function.
 * @param isPopoverState -Boolean value.
 * @returns Set toggle popover state functionality.
 */
const togglePopoverHandler = (setPopoverState: React.Dispatch<React.SetStateAction<boolean>>, isPopoverState: boolean) => () => {
    setPopoverState(!isPopoverState);
};

const OrderHistoryFilter: React.FC<IOrderHistoryFilterProps> = (props: IOrderHistoryFilterProps) => {
    // Current version of filter doesn't include functionality for non b2b users or non-admin b2b users.
    if (!props.data.customerInformation.IsB2bAdmin) {
        return <div className={props.className} />;
    }

    const popoverRef = React.createRef<HTMLButtonElement>();
    const [popoverState, setPopoverState] = React.useState(false);

    const [filterState, setFilterState] = React.useState(props.currentState);

    const onFilterStateClick = (clickedState: OrderHistoryFilterState) => {
        setFilterState(clickedState);
        setPopoverState(false);
        props.onFilterStateChanged(clickedState);
    };

    return (
        <div className={props.className}>
            <Button
                className={`${props.className}__expand-filter-button`}
                innerRef={popoverRef}
                aria-expanded={popoverState}
                aria-describedby={props.className}
                onClick={togglePopoverHandler(setPopoverState, popoverState)}
            >
                {getOrderHistoryFilterStateResources(filterState, props.resources)}
            </Button>
            <Popover
                id={props.className}
                placement='bottom-end'
                isOpen={popoverState}
                target={popoverRef}
                toggle={togglePopoverHandler(setPopoverState, popoverState)}
            >
                {EnumExtensions.getEnumValues<OrderHistoryFilterState>(OrderHistoryFilterState).map(state => {
                    return renderFilterStateItem(state, props.resources, props.className, onFilterStateClick);
                })}
            </Popover>
        </div>
    );
};

export const OrderHistoryFilterComponent: React.FunctionComponent<IOrderHistoryFilterProps> = msdyn365Commerce.createComponent<
    // @ts-expect-error
    IOrderHistoryFilterProps
>('OrderHistoryFilterComponent', { component: OrderHistoryFilter });
