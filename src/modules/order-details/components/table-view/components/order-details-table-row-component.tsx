/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { OrderDetailsProduct } from '@msdyn365-commerce/components';
import MsDyn365, { IAny, IComponentProps, ICoreContext, IGeneric, IImageSettings, Image, isChannelTypeB2B } from '@msdyn365-commerce/core';
import { ChannelDeliveryOptionConfiguration, format, ProductDeliveryOptions, SalesOrder } from '@msdyn365-commerce/retail-proxy';
import { getFallbackImageUrl, getProductPageUrlSync, ObjectExtensions, StringExtensions } from '@msdyn365-commerce-modules/retail-actions';
import { Button, isMobile, VariantType } from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import React, { useState } from 'react';

import { BuySelectedComponent } from '@msdyn365-commerce-modules/order-management';
import {
    getDeliveryDescriptionByProductId,
    getDeliveryType,
    getDeliveryTypeString,
    IDeliveryTypeStringMap,
    ISalesStatusStringMap
} from '@msdyn365-commerce-modules/order-management';
import { defaultImageSettings, getSalesStatusCode } from '@msdyn365-commerce-modules/order-management';

/**
 * Data required to render each order details row.
 */
export interface IOrderDetailsTableRowData {
    salesOrder: SalesOrder;
    product: OrderDetailsProduct;
    deliveryOptions: ProductDeliveryOptions[];
    channelDeliveryOptionConfig?: ChannelDeliveryOptionConfiguration;
}

/**
 * Resources for order details table rows.
 */
export interface IOrderDetailsTableRowResources {
    orderDetailsProductDimensionsSeparator: string;
    orderDetailsQuantityMobileText: string;
    orderDetailsViewDetailsButtonText: string;
    orderDetailsViewDetailsButtonAriaLabel: string;
    pickedUpSalesLines: string;
    deliveredSalesLines: string;
    carryOutSalesLines: string;
    emailSalesLines: string;
    orderStatusReadyForPickup: string;
    orderStatusProcessing: string;
    orderStatusShipped: string;
    orderStatusPickedUp: string;
    orderStatusCanceled: string;
    orderStatusEmailed: string;

    orderDetailsSelectRadioAriaLabelText: string;

    orderDetailsBuyItAgainButtonText: string;
    orderDetailsBuyItAgainButtonAriaLabel: string;
    orderDetailsBuySelectedAddingToCartErrorNotificationTitle: string;
    orderDetailsBuySelectedAddingToCartErrorNotificationCloseAriaLabel: string;
    orderDetailsUnavailableProductText?: string;
}

/**
 * Configuration for the order details rows.
 */
export interface IOrderDetailsTableRowProps extends IComponentProps<IOrderDetailsTableRowData> {
    context: ICoreContext<IGeneric<IAny>>;
    className: string;

    imageSettings?: IImageSettings;
    isCashAndCarryTransaction: boolean;
    isReorderingEnabled?: boolean;
    isRetailMultiplePickUpOptionEnabled?: boolean;
    isSelectionModeEnabled: boolean;

    resources: IOrderDetailsTableRowResources;
    isChannelMultipleCatalogsFeatureEnabled?: boolean;
}

/**
 * Formats amount.
 * @param context - Core context.
 * @param amount - Amount to display.
 * @param currencyCode - Currency for the amount.
 * @returns String value.
 */
const formatAmount = (context: ICoreContext, amount: number | undefined, currencyCode: string | undefined) => {
    if (amount === undefined) {
        return '';
    }
    return context.cultureFormatter.formatCurrency(amount, currencyCode);
};

/**
 * Renders checkbox for order details line selection.
 * @param props - Order detail table row props.
 * @returns React element.
 */
const OrderDetailsRowCheckboxComponent: React.FC<IOrderDetailsTableRowProps> = (props: IOrderDetailsTableRowProps) => {
    const product = props.data.product;

    const checkboxRowAriaLabel = format(props.resources.orderDetailsSelectRadioAriaLabelText, product.salesLine.ProductId);
    const onSelectLine = React.useCallback(() => {
        product.isSelected = !product.isSelected;
    }, [product]);

    return (
        <label className={classnames(`${props.className}__checkbox-container`, 'checkbox-container')}>
            <input
                className={classnames(`${props.className}__checkbox-input`, 'checkbox-input')}
                type='checkbox'
                checked={product.isProductAvailable && product.isSelected}
                aria-label={checkboxRowAriaLabel}
                aria-checked={product.isProductAvailable && product.isSelected}
                onChange={onSelectLine}
                disabled={!product.isProductAvailable}
            />
            <span className={classnames(`${props.className}__checkmark`, 'checkmark')} />
        </label>
    );
};

/**
 * Renders product image for order details line.
 * @param props - Order detail table row props.
 * @returns React element.
 */
const OrderDetailsRowProductImageComponent: React.FC<IOrderDetailsTableRowProps> = (props: IOrderDetailsTableRowProps) => {
    const product = props.data.product;
    const fallbackImageUrl = getFallbackImageUrl(
        product.simpleProduct?.ItemId,
        props.context.actionContext.requestContext.apiSettings,
        props.context.request.app?.config?.OmniChannelMedia
    );

    const containerClassName = `${props.className}__product-image-container`;

    const productName = product.simpleProduct?.Name ?? product.salesLine.Description;

    return (
        <div className={containerClassName}>
            <Image
                requestContext={props.context.actionContext.requestContext}
                className={`${containerClassName}__product-image`}
                altText={productName}
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Need to set empty by default.
                src={product.simpleProduct?.PrimaryImageUrl || 'empty'}
                fallBackSrc={fallbackImageUrl}
                gridSettings={props.context.request.gridSettings!}
                imageSettings={props.imageSettings ?? defaultImageSettings}
                loadFailureBehavior='empty'
            />
        </div>
    );
};

/**
 * Renders rows for desktop view.
 * @param props - Configuration for the rows.
 * @returns A react node with a list of order details rows for desktop view.
 */
export const OrderDetailsDesktopTableRowCellComponent: React.FC<IOrderDetailsTableRowProps> = (props: IOrderDetailsTableRowProps) => {
    const {
        data: { product, salesOrder, deliveryOptions }
    } = props;
    const salesLine = product.salesLine;

    const pickupMode = getDeliveryDescriptionByProductId(salesLine.ProductId, salesLine.DeliveryMode, deliveryOptions);
    const pickupDeliveryModeCode = props.context.request.channel?.PickupDeliveryModeCode;
    const emailDeliveryModeCode = props.context.request.channel?.EmailDeliveryModeCode;
    const deliveryType = getDeliveryType(
        pickupMode,
        salesLine,
        salesLine.DeliveryMode,
        pickupDeliveryModeCode,
        props.isRetailMultiplePickUpOptionEnabled,
        props.data.channelDeliveryOptionConfig,
        emailDeliveryModeCode
    );
    const deliveryTypeStringMap: IDeliveryTypeStringMap = {
        pickUp: props.resources.pickedUpSalesLines,
        ship: props.resources.deliveredSalesLines,
        carryOut: props.resources.carryOutSalesLines,
        email: props.resources.emailSalesLines
    };
    const deliveryTypeString = getDeliveryTypeString(deliveryType, deliveryTypeStringMap, props.isRetailMultiplePickUpOptionEnabled);

    const salesStatusStringMap: ISalesStatusStringMap = {
        canceled: props.resources.orderStatusCanceled,
        readyForPickup: props.resources.orderStatusReadyForPickup,
        pickedUp: props.resources.orderStatusPickedUp,
        processing: props.resources.orderStatusProcessing,
        shipped: props.resources.orderStatusShipped,
        unknown: undefined,
        emailed: props.resources.orderStatusEmailed
    };

    const salesStatus = getSalesStatusCode(deliveryType, salesLine.SalesStatusValue, pickupMode);
    const salesStatusString = salesStatusStringMap[salesStatus];

    const columnWithNumberClassName = `${props.className}__column-with-number`;

    const productName = product.simpleProduct?.Name ?? salesLine.Description;

    let productUrl = '';
    if (!ObjectExtensions.isNullOrUndefined(productName) && !ObjectExtensions.isNullOrUndefined(salesLine.ProductId)) {
        productUrl = getProductPageUrlSync(productName, salesLine.ProductId, props.context.actionContext);

        if (MsDyn365.isBrowser && isChannelTypeB2B(props.context.actionContext.requestContext)) {
            const fullUrl = new URL(productUrl, window.location.href);
            fullUrl.searchParams.set('catalogid', `${salesLine.CatalogId ?? 0}`);
            productUrl = fullUrl.href;
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- app configs are of generic type
    const shouldDisplayUnitOfMeasure =
        props.context.app.config.unitOfMeasureDisplayType && props.context.app.config.unitOfMeasureDisplayType !== 'none';

    const confirmedShipDateAvailable = salesLine.ConfirmedShipDate === undefined || salesLine.ConfirmedShipDate === null;

    const currentProduct = new OrderDetailsProduct(product.salesLine, product.simpleProduct, productUrl);

    return (
        <>
            {props.isSelectionModeEnabled ? (
                <td>
                    <OrderDetailsRowCheckboxComponent {...props} />
                </td>
            ) : (
                undefined
            )}
            <td>
                <OrderDetailsRowProductImageComponent {...props} />
            </td>
            <td>{salesLine.ItemId}</td>
            <td>
                <div className={`${props.className}__product-info`}>
                    <a className={`${props.className}__product-name`} href={productUrl}>
                        {productName}
                    </a>
                    <span className={`${props.className}__product-dimensions`}>
                        {product.simpleProduct?.Dimensions?.map(dimension => dimension.DimensionValue?.Value)
                            .filter(dimensionValue => !StringExtensions.isNullOrWhitespace(dimensionValue))
                            .join(props.resources.orderDetailsProductDimensionsSeparator)}
                    </span>
                    {!product.isProductAvailable && (
                        <div className='msc-alert-danger'>{props.resources.orderDetailsUnavailableProductText}</div>
                    )}
                </div>
            </td>
            <td className={columnWithNumberClassName}>{formatAmount(props.context, salesLine.Price, salesOrder.CurrencyCode)}</td>
            <td>{deliveryTypeString}</td>
            {props.isCashAndCarryTransaction ? undefined : <td>{salesStatusString}</td>}
            <td className={columnWithNumberClassName}>{salesLine.Quantity}</td>
            {shouldDisplayUnitOfMeasure && <td>{salesLine.UnitOfMeasureSymbol}</td>}

            <td className={columnWithNumberClassName}>{formatAmount(props.context, salesLine.TotalAmount, salesOrder.CurrencyCode)}</td>
            {!confirmedShipDateAvailable && <td className={columnWithNumberClassName}>{salesLine.ConfirmedShipDate}</td>}
            <td>
                <BuySelectedComponent
                    {...props}
                    className={`${props.className}__buy-again msc-btn`}
                    data={{ products: [currentProduct] }}
                    resources={{
                        ...props.resources,
                        orderDetailsBuySelectedButtonText: props.resources.orderDetailsBuyItAgainButtonText,
                        orderDetailsBuySelectedButtonAriaLabel: format(
                            props.resources.orderDetailsBuyItAgainButtonAriaLabel,
                            productName ?? ''
                        )
                    }}
                    isReorderingEnabled={props.isReorderingEnabled}
                    isIcon
                />
            </td>
        </>
    );
};

let setShowPreviousActions: React.Dispatch<React.SetStateAction<boolean>> | undefined;

/**
 * Renders actions popup for the mobile view.
 * @param props - Configuration for popup.
 * @returns A react node with actions..
 */
const OrderDetailsExtraActionsPopupComponent: React.FC<IOrderDetailsTableRowProps> = (
    props: IOrderDetailsTableRowProps
): JSX.Element | null => {
    const {
        resources: { orderDetailsViewDetailsButtonAriaLabel, orderDetailsViewDetailsButtonText }
    } = props;

    const [shouldShowActions, setShowActions] = useState(false);

    const salesLine = props.data.product.salesLine;

    const productName = props.data.product.simpleProduct?.Name ?? salesLine.Description;
    let productUrl = '';
    if (!ObjectExtensions.isNullOrUndefined(productName) && !ObjectExtensions.isNullOrUndefined(salesLine.ProductId)) {
        productUrl = getProductPageUrlSync(productName, salesLine.ProductId, props.context.actionContext);

        if (MsDyn365.isBrowser && isChannelTypeB2B(props.context.actionContext.requestContext)) {
            const fullUrl = new URL(productUrl, window.location.href);
            fullUrl.searchParams.set('catalogid', `${salesLine.CatalogId ?? 0}`);
            productUrl = fullUrl.href;
        }
    }
    const currentProduct = new OrderDetailsProduct(props.data.product.salesLine, props.data.product.simpleProduct, productUrl);

    const onClickViewDetails = React.useCallback(() => {
        if (MsDyn365.isBrowser) {
            window.location.href = productUrl;
        }
    }, [productUrl]);

    const toggle = React.useCallback(() => {
        const shouldShowActionsNewValue = !shouldShowActions;
        if (shouldShowActionsNewValue) {
            if (setShowPreviousActions) {
                setShowPreviousActions(false);
            }
            setShowActions(shouldShowActionsNewValue);
            setShowPreviousActions = setShowActions;
        } else {
            setShowPreviousActions = undefined;
            setShowActions(shouldShowActionsNewValue);
        }
    }, [shouldShowActions, setShowActions]);

    if (StringExtensions.isNullOrWhitespace(productUrl)) {
        return null;
    }

    const className = `${props.className}__extra-actions-cell`;
    const actionsContainerClassName = `${className}__actions-container`;

    return (
        <div className={className}>
            <Button className={`${className}__toggle`} onClick={toggle} />
            {shouldShowActions && (
                <div className={actionsContainerClassName}>
                    <Button
                        className={`${actionsContainerClassName}__view-details`}
                        onClick={onClickViewDetails}
                        aria-label={orderDetailsViewDetailsButtonAriaLabel}
                    >
                        {orderDetailsViewDetailsButtonText}
                    </Button>
                    <BuySelectedComponent
                        {...props}
                        className={`${actionsContainerClassName}__buy-again`}
                        data={{ products: [currentProduct] }}
                        resources={{
                            ...props.resources,
                            orderDetailsBuySelectedButtonText: props.resources.orderDetailsBuyItAgainButtonText,
                            orderDetailsBuySelectedButtonAriaLabel: format(
                                props.resources.orderDetailsBuyItAgainButtonAriaLabel,
                                productName ?? ''
                            )
                        }}
                        isReorderingEnabled={props.isReorderingEnabled}
                    />
                </div>
            )}
        </div>
    );
};

/**
 * Renders rows for mobile view.
 * @param props - Configuration for the rows.
 * @returns A react node with a list of order details rows for mobile view.
 */
export const OrderDetailsMobileTableRowCellComponent: React.FC<IOrderDetailsTableRowProps> = (props: IOrderDetailsTableRowProps) => {
    const {
        data: { product }
    } = props;
    const salesLine = product.salesLine;
    const productName = product.simpleProduct?.Name ?? salesLine.Description;

    return (
        <>
            {props.isSelectionModeEnabled ? (
                <td>
                    <OrderDetailsRowCheckboxComponent {...props} />
                </td>
            ) : (
                undefined
            )}
            <td>
                <OrderDetailsRowProductImageComponent {...props} />
            </td>
            <td>
                <div className={`${props.className}__product-info`}>
                    <span className={`${props.className}__product-name`}>{productName}</span>
                    <span className={`${props.className}__product-quantity`}>
                        {format(props.resources.orderDetailsQuantityMobileText, salesLine.Quantity)}
                    </span>
                </div>
            </td>
            <td>
                <OrderDetailsExtraActionsPopupComponent {...props} />
            </td>
        </>
    );
};

/**
 * Renders order details rows.
 * @param props - Configuration for the rows.
 * @returns A react node with a list of order details rows.
 */
export const OrderDetailsTableRowComponent: React.FC<IOrderDetailsTableRowProps> = (props: IOrderDetailsTableRowProps) => {
    const isMobileView = isMobile({ variant: VariantType.Viewport, context: props.context.request }) === 'xs';
    const className = classnames(
        props.className,
        props.data.product.isProductAvailable ? `${props.className}__available-product` : `${props.className}__unavailable-product`,
        props.className,
        props.data.product.isSelected ? `${props.className}__selected` : `${props.className}__unselected`
    );

    return (
        <tr className={className}>
            {isMobileView ? (
                <OrderDetailsMobileTableRowCellComponent {...props} />
            ) : (
                <OrderDetailsDesktopTableRowCellComponent {...props} />
            )}
        </tr>
    );
};
