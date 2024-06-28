/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { CartLineItemComponent, ICartlineResourceString } from '@msdyn365-commerce/components';
import MsDyn365, { ICoreContext, IGridSettings, IImageSettings, ITelemetry, isChannelTypeB2B } from '@msdyn365-commerce/core';
import { ICartState } from '@msdyn365-commerce/global-state';
import {
    CartLine,
    ChannelDeliveryOptionConfiguration,
    OrgUnitLocation,
    ProductAvailableQuantity,
    ProductDeliveryOptions,
    SimpleProduct
} from '@msdyn365-commerce/retail-proxy';
import { ProductCatalog, ReleasedProductType } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import { getProductUrlSync, IProductInventoryInformation } from '@msdyn365-commerce-modules/retail-actions';
import {
    Button,
    getPayloadObject,
    getTelemetryAttributes,
    ITelemetryContent,
    TelemetryConstant
} from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { getProductByProductId, getProductByProductIdAndWarehouse } from '@msdyn365-commerce-modules/cart';

export interface IFlyoutCartLineItemsProps {
    cartlines: CartLine[];
    cartState: ICartState | undefined;
    orgUnitLocations: OrgUnitLocation[] | undefined;
    resources: ICartlineResourceString;
    productAvailabilites: IProductInventoryInformation[] | undefined;
    products: SimpleProduct[] | undefined;
    productDeliveryOptions: ProductDeliveryOptions[] | undefined;
    pickupDeliveryModeCode?: string;
    catalogs?: ProductCatalog[];

    /**
     * GridSettings for the product image in cartline
     */
    gridSettings: IGridSettings;

    /**
     * ImageSettings for the product image in cartline
     */
    imageSettings: IImageSettings;
    id: string;
    typeName: string;
    context: ICoreContext;
    telemetry: ITelemetry;
    removeButtonText: string;
    outOfStockText: string;
    outOfRangeOneText: string;
    outOfRangeFormatText: string;
    maxCartlineQuantity: number;
    channelDeliveryOptionConfig?: ChannelDeliveryOptionConfiguration;
    isQuantityLimitsFeatureEnabled: boolean;

    outOfStockThreshold: number;
    isStockCheckEnabled: boolean;
    telemetryContent?: ITelemetryContent;
    removeItemClickHandler(cartlineToRemove: CartLine): void;
}

export interface IFlyoutCartLineItemViewProps {
    cartline: React.ReactNode;
    remove: React.ReactNode;
    storeLocation: React.ReactNode;
    hasError: boolean;

    data: {
        product: SimpleProduct;
        cartline: CartLine;
    };
}

const _getCartItemAvailableQuantity = (
    isStockCheckEnabled: boolean,
    outOfStockThreshold: number,
    productAvailability?: ProductAvailableQuantity
): number => {
    if (isStockCheckEnabled) {
        if (
            !productAvailability ||
            !productAvailability.AvailableQuantity ||
            productAvailability.AvailableQuantity <= 0 ||
            productAvailability.AvailableQuantity <= outOfStockThreshold
        ) {
            return 0;
        }
        return productAvailability.AvailableQuantity - outOfStockThreshold;
    }

    return 0;
};

const _getCartItemMaxQuantity = (
    maxQuantityByConfig: number,
    isStockCheckEnabled: boolean,
    availableQuantityInStock: number,
    isQuantityLimitsFeatureEnabled: boolean,
    maxByQuantityLimitsFeature: number
) => {
    if (isQuantityLimitsFeatureEnabled) {
        let maxByQuantityLimitsFeatureResult = maxByQuantityLimitsFeature;

        // If max by feature in not defined when feature is on then we suggest that there is no max by feature
        // and consider available qty if stock check enabled and max from config in site settings.
        if (!maxByQuantityLimitsFeature) {
            maxByQuantityLimitsFeatureResult = maxQuantityByConfig || 10;
        }

        return isStockCheckEnabled
            ? maxByQuantityLimitsFeatureResult < availableQuantityInStock
                ? maxByQuantityLimitsFeatureResult
                : availableQuantityInStock
            : maxByQuantityLimitsFeatureResult;
    }
    if (isStockCheckEnabled) {
        return availableQuantityInStock < maxQuantityByConfig ? availableQuantityInStock : maxQuantityByConfig;
    }
    return maxQuantityByConfig;
};

/**
 * On Remove Click functionality.
 * @param removeItemClickHandler -Remove item click function.
 * @param cartline -CartLine.
 * @returns Remove change value.
 */
const onRemoveClickFunction = (removeItemClickHandler: (cartlineToRemove: CartLine) => void, cartline: CartLine) => () => {
    removeItemClickHandler(cartline);
};
const _assembleNode = (
    cartline: CartLine,
    product: SimpleProduct,
    props: IFlyoutCartLineItemsProps,
    index: number,
    foundProductAvailability?: ProductAvailableQuantity,
    foundProductDeliveryOptions?: ProductDeliveryOptions
): IFlyoutCartLineItemViewProps => {
    const { imageSettings, gridSettings, id, typeName, context, resources, removeButtonText, removeItemClickHandler } = props;

    const availableQuantityInStock = _getCartItemAvailableQuantity(
        props.isStockCheckEnabled,
        props.outOfStockThreshold,
        foundProductAvailability
    );
    const maxQuantity =
        product &&
        _getCartItemMaxQuantity(
            props.maxCartlineQuantity,
            props.isStockCheckEnabled,
            availableQuantityInStock,
            props.isQuantityLimitsFeatureEnabled,
            product?.Behavior?.MaximumQuantity || 0
        );

    // Check if the product is service or not by product type
    const isServiceItem = product.ItemTypeValue === ReleasedProductType.Service;

    const onRemoveClickHandler = onRemoveClickFunction(removeItemClickHandler, cartline);
    const payLoad = getPayloadObject('click', props.telemetryContent!, TelemetryConstant.RemoveCartItem);
    const removeCartItemAttribute = getTelemetryAttributes(props.telemetryContent!, payLoad);

    let productUrl = getProductUrlSync(product, props.context.actionContext, undefined);
    if (MsDyn365.isBrowser && isChannelTypeB2B(props.context.actionContext.requestContext)) {
        const fullUrl = new URL(productUrl, window.location.href);
        fullUrl.searchParams.set('catalogid', `${cartline.CatalogId ?? 0}`);
        productUrl = fullUrl.href;
    }

    return {
        data: {
            product,
            cartline
        },
        hasError: !isServiceItem && props.isStockCheckEnabled ? cartline.Quantity! > maxQuantity : false,
        cartline: (
            <CartLineItemComponent
                data={{
                    cartLine: cartline,
                    product,
                    catalogs: props.catalogs
                }}
                currentQuantity={cartline.Quantity}
                maxQuantity={maxQuantity}
                isOutOfStock={!isServiceItem && props.isStockCheckEnabled ? availableQuantityInStock <= 0 : false}
                gridSettings={gridSettings}
                imageSettings={imageSettings}
                id={id}
                typeName={typeName}
                productUrl={productUrl}
                context={context}
                resources={resources}
                key={`${index}-${productUrl}`}
                isQuantityEditable={false}
                primaryImageUrl={product.PrimaryImageUrl}
                displayMode='COMPACT'
                telemetryContent={props.telemetryContent}
                channelDeliveryOptionConfig={props.channelDeliveryOptionConfig}
                deliveryLocation={_renderDeliveryLocation(cartline, props)}
            />
        ),
        remove: (
            <Button
                className='msc-cart-line__remove-item'
                onClick={onRemoveClickHandler}
                title={removeButtonText}
                {...removeCartItemAttribute}
            >
                {removeButtonText}
            </Button>
        ),
        storeLocation: _renderStoreLocation(cartline, props)
    };
};

const _renderDeliveryLocation = (cartLine: CartLine | null | undefined, props: IFlyoutCartLineItemsProps): string | undefined => {
    let deliverylocation;
    if (cartLine && cartLine.FulfillmentStoreId) {
        const orgUnitName = _getOrgUnitName(cartLine.FulfillmentStoreId, props.orgUnitLocations);

        let foundProductDeliveryOption;
        if (props.productDeliveryOptions && props.productDeliveryOptions.length > 0) {
            foundProductDeliveryOption = props.productDeliveryOptions.find(deliveryOption => {
                return deliveryOption && deliveryOption.ProductId === cartLine.ProductId;
            });
        }
        const delivery = foundProductDeliveryOption?.DeliveryOptions?.find(option => option.Code === cartLine.DeliveryMode);
        const location = delivery?.Description;

        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        if (location) {
            deliverylocation = `${location}, ${orgUnitName}`;
        } else {
            deliverylocation = `${orgUnitName}`;
        }
    } else {
        deliverylocation = props.resources.shippingText;
    }
    return deliverylocation;
};

const _renderStoreLocation = (cartLine: CartLine | null | undefined, props: IFlyoutCartLineItemsProps): JSX.Element | null => {
    if (cartLine && cartLine.FulfillmentStoreId) {
        const orgUnitName = _getOrgUnitName(cartLine.FulfillmentStoreId, props.orgUnitLocations);

        if (orgUnitName) {
            return (
                <div className='msc-cart-line__bopis-method'>
                    <span className='pick-up'>{orgUnitName}</span>
                </div>
            );
        }
    }

    return null;
};

const _getOrgUnitName = (fulfillmentStoreId: string | undefined, orgUnitLocations: OrgUnitLocation[] | undefined) => {
    if (!orgUnitLocations || !fulfillmentStoreId || orgUnitLocations.length === 0) {
        return '';
    }

    const foundLocation = orgUnitLocations.find(orgUnitLocation => {
        return orgUnitLocation.OrgUnitNumber === fulfillmentStoreId;
    });

    if (foundLocation) {
        return foundLocation.OrgUnitName;
    }
    return fulfillmentStoreId;
};

const _assembleCartlines = (
    cartlines: CartLine[],
    products: SimpleProduct[] | undefined,
    props: IFlyoutCartLineItemsProps
): IFlyoutCartLineItemViewProps[] | null => {
    const reactNodes: IFlyoutCartLineItemViewProps[] = [];

    if (!products || products.length === 0) {
        props.context.telemetry.error('Cartlines content is empty, module wont render');
        return null;
    }

    cartlines.map((cartline, index) => {
        let product;
        if (props.isQuantityLimitsFeatureEnabled) {
            // When feature is enabled the same products could have different quantity limits in Behavior so we need
            // to check productId and WarehouseId for identification.
            product = getProductByProductIdAndWarehouse(cartline.ProductId, products, cartline.WarehouseId, props.cartState);
        } else {
            product = getProductByProductId(cartline.ProductId, products);
        }
        let foundProductAvailability;
        if (props.productAvailabilites && props.productAvailabilites.length > 0) {
            foundProductAvailability = props.productAvailabilites.find(productAvailability => {
                return productAvailability.ProductAvailableQuantity?.ProductId! === cartline.ProductId;
            });
        }
        let foundProductDeliveryOption;
        if (props.productDeliveryOptions && props.productDeliveryOptions.length > 0) {
            foundProductDeliveryOption = props.productDeliveryOptions.find(deliveryOption => {
                return deliveryOption && deliveryOption.ProductId === cartline.ProductId;
            });
        }
        if (product) {
            reactNodes.push(
                _assembleNode(
                    cartline,
                    product,
                    props,
                    index,
                    foundProductAvailability?.ProductAvailableQuantity,
                    foundProductDeliveryOption
                )
            );
        }
    });

    return reactNodes;
};

/**
 * CartLineItems component.
 */

export const FlyoutCartLineItems = (props: IFlyoutCartLineItemsProps) => {
    const { products, cartlines } = props;
    return _assembleCartlines(cartlines, products, props);
};
