/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { CartLineItemComponent } from '@msdyn365-commerce/components';
import MsDyn365, * as Msdyn365 from '@msdyn365-commerce/core';
import { isChannelTypeB2B } from '@msdyn365-commerce/core';
import { CartLine, OrgUnitLocation, SimpleProduct } from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import { getProductUrlSync, StringExtensions } from '@msdyn365-commerce-modules/retail-actions';
import {
    Button,
    getPayloadObject,
    getTelemetryAttributes,
    INodeProps,
    ITelemetryContent,
    TelemetryConstant
} from '@msdyn365-commerce-modules/utilities';
import classnames from 'classnames';
import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import * as React from 'react';

import { ICheckoutData } from '../checkout.data';
import { ICheckoutProps } from '../checkout.props.autogenerated';

type deliveryType = 'pickup' | 'ship' | 'email';

export interface IPickUpAtStore {
    PickUpAtStore: INodeProps;
    label: React.ReactNode;
    location: React.ReactNode;
}

export interface IEmailDelivery {
    EmailDelivery: INodeProps;
    label: React.ReactNode;
}

export interface ILineItem {
    LineId: string;
    LineItem: INodeProps;
    item?: React.ReactNode;
    pickUpAtStore?: IPickUpAtStore;
    emailDelivery?: IEmailDelivery;
}

export interface ILineItemDeliveryGroup {
    LineItemDeliveryGroup: INodeProps;
    LineItemList: INodeProps;
    heading: React.ReactNode;
    lineItemWraper?: React.ReactNode;
    lineItemWraperIcon?: React.ReactNode;
    lineItems: ILineItem[];
}

export interface ILineItems {
    LineItems: INodeProps;
    Header: INodeProps;
    heading: React.ReactNode;
    editLink: React.ReactNode;
    itemsForPickup?: ILineItemDeliveryGroup;
    itemsForShip?: ILineItemDeliveryGroup;
    itemsForEmail?: ILineItemDeliveryGroup;
    itemsGroupWithMulitplePickupMode?: ILineItemDeliveryGroup[];
}

export const getLineItems = (input: ICheckoutProps<ICheckoutData>, telemetryContent?: ITelemetryContent): ILineItems | undefined => {
    const pickupDeliveryModeCode = get(input, 'context.request.channel.PickupDeliveryModeCode');
    const emailDeliveryModeCode = get(input, 'context.request.channel.EmailDeliveryModeCode');
    const multiplePickupStoreSwitchName = 'Dynamics.AX.Application.RetailMultiplePickupDeliveryModeFeature';
    const { channelDeliveryOptionConfig, featureState } = input.data;
    const retailMultiplePickUpOptionEnabled = featureState?.result?.find(feature => feature.Name === multiplePickupStoreSwitchName)
        ?.IsEnabled;

    const _getDeliveryLocation = (cartLine: CartLine): string => {
        const orgUnitLocations = get(input, 'data.orgUnitLocations.result');
        if (!cartLine.FulfillmentStoreId || !orgUnitLocations) {
            return '';
        }

        const locationMatch = (orgUnitLocations || []).find((location: OrgUnitLocation): boolean => {
            return location.OrgUnitNumber === cartLine.FulfillmentStoreId;
        });

        return locationMatch && locationMatch.OrgUnitName;
    };

    const _getProduct = (productId: number): SimpleProduct | undefined => {
        const products = get(input, 'data.products.result') || [];
        return products.find((_product: SimpleProduct) => {
            return productId === _product.RecordId;
        });
    };

    const _getLineItemComponent = (cartLine: CartLine): JSX.Element | undefined => {
        const product = cartLine.ProductId && _getProduct(cartLine.ProductId);
        const {
            id,
            typeName,
            context,
            config: { imageSettings, showShippingChargesForLineItems },
            resources: {
                quantityDisplayString,
                productDimensionTypeColor,
                productDimensionTypeSize,
                productDimensionTypeStyle,
                productDimensionTypeAmount,
                configString,
                inputQuantityAriaLabel,
                discountStringText,
                shippingCharges
            },
            context: {
                request: { gridSettings }
            }
        } = input;
        const catalogs = input.data.catalogs?.result;
        if (!product) {
            return;
        }

        let productUrl = getProductUrlSync(product, context.actionContext, undefined);
        if (MsDyn365.isBrowser && isChannelTypeB2B(context.actionContext.requestContext)) {
            const fullUrl = new URL(productUrl, window.location.href);
            fullUrl.searchParams.set('catalogid', `${cartLine.CatalogId ?? 0}`);
            productUrl = fullUrl.href;
        }
        const currencyCode = get(input, 'context.request.channel.Currency');
        return (
            <CartLineItemComponent
                id={id}
                typeName={typeName}
                context={context}
                resources={{
                    sizeString: productDimensionTypeSize,
                    colorString: productDimensionTypeColor,
                    styleString: productDimensionTypeStyle,
                    amountString: productDimensionTypeAmount,
                    quantityDisplayString,
                    configString,
                    inputQuantityAriaLabel,
                    discountStringText,
                    originalPriceText: '',
                    currentPriceText: '',
                    shippingChargesText: shippingCharges,
                    salesAgreementPricePrompt: 'Contract price applied'
                }}
                isQuantityEditable={false}
                imageSettings={imageSettings as Msdyn365.IImageSettings}
                gridSettings={gridSettings as Msdyn365.IGridSettings}
                productUrl={productUrl}
                primaryImageUrl={product.PrimaryImageUrl}
                data={{
                    cartLine,
                    product,
                    catalogs
                }}
                showShippingChargesForLineItems={showShippingChargesForLineItems}
                telemetryContent={telemetryContent}
                channelDeliveryOptionConfig={channelDeliveryOptionConfig?.result}
                priceCurrency={currencyCode}
            />
        );
    };

    const _getPickUpAtStoreComponents = (pickupDeliveryLocation: string): IPickUpAtStore => {
        const {
            resources: { pickUpAtStoreWithLocationText }
        } = input;

        return {
            PickUpAtStore: { className: 'ms-checkout__pick-up-at-store' },
            label: <span className='ms-checkout__store-label'>{pickUpAtStoreWithLocationText}</span>,
            location: <div className='ms-checkout__store-location'>{pickupDeliveryLocation}</div>
        };
    };

    const _getEmailDeliveryComponents = (): IEmailDelivery => {
        const {
            resources: { emailDeliveryText }
        } = input;

        return {
            EmailDelivery: { className: 'ms-checkout__email-delivery' },
            label: <span className='ms-checkout__email-label'>{emailDeliveryText}</span>
        };
    };

    const _getLineItemsComponents = (items: CartLine[]): ILineItem[] => {
        return items.map(cartLine => {
            const pickupDeliveryLocation = _getDeliveryLocation(cartLine);
            const isPickUp = _getCartPickDeliveryMode(cartLine);
            const isEmailDelivery =
                cartLine.DeliveryMode && cartLine.DeliveryMode !== '' ? cartLine.DeliveryMode === emailDeliveryModeCode : false;
            return {
                LineId: cartLine.LineId || '',
                LineItem: { className: 'ms-checkout__line-item' },
                item: _getLineItemComponent(cartLine),
                pickUpAtStore: isPickUp ? _getPickUpAtStoreComponents(pickupDeliveryLocation) : undefined,
                emailDelivery: isEmailDelivery ? _getEmailDeliveryComponents() : undefined
            };
        });
    };

    const _getCartPickDeliveryMode = (cartLineItem: CartLine): boolean => {
        return !StringExtensions.isNullOrWhitespace(cartLineItem.DeliveryMode)
            ? retailMultiplePickUpOptionEnabled
                ? cartLineItem.DeliveryMode ===
                  channelDeliveryOptionConfig?.result?.PickupDeliveryModeCodes?.find(
                      deliveryMode => deliveryMode === cartLineItem.DeliveryMode
                  )
                : cartLineItem.DeliveryMode === pickupDeliveryModeCode
            : false;
    };

    const _getCartShipDeliveryMode = (cartLineItem: CartLine): boolean => {
        return !StringExtensions.isNullOrWhitespace(cartLineItem.DeliveryMode)
            ? retailMultiplePickUpOptionEnabled
                ? cartLineItem.DeliveryMode !==
                  channelDeliveryOptionConfig?.result?.PickupDeliveryModeCodes?.find(
                      deliveryMode => deliveryMode === cartLineItem.DeliveryMode
                  )
                : cartLineItem.DeliveryMode !== pickupDeliveryModeCode
            : false;
    };

    const _getGroupTitleComponent = (count: number, type: deliveryType): string => {
        const {
            resources: { itemLabel, itemsLabel, inStorePickUpLabel, shippingCountCheckoutLineItem }
        } = input;

        let emailDeliveryModeDesc: string = '';

        input.data.deliveryOptions.result?.find(productDeliveryOptions => {
            emailDeliveryModeDesc = emailDeliveryModeDesc
                ? emailDeliveryModeDesc
                : productDeliveryOptions.DeliveryOptions?.find(deliveryOption => deliveryOption.Code === emailDeliveryModeCode)
                      ?.Description!;
        });

        const suffix = count > 1 ? itemsLabel : itemLabel;
        const title =
            type === 'ship'
                ? shippingCountCheckoutLineItem
                : type === 'pickup'
                ? inStorePickUpLabel
                : `${emailDeliveryModeDesc} (${count} ${suffix})`;
        return title.replace('{count}', count.toString()).replace('{suffix}', suffix);
    };

    const _countItems = (items: CartLine[]): number => {
        return items.reduce((count, item) => {
            return count + (item.Quantity || 0);
        }, 0);
    };

    const _filterItemsByDiliveryType = (type: deliveryType): CartLine[] => {
        const cart = get(input, 'data.checkout.result.checkoutCart.cart');
        if (type === 'ship') {
            return cart.CartLines.filter((cartLine: CartLine) =>
                cartLine.DeliveryMode && cartLine.DeliveryMode !== ''
                    ? _getCartShipDeliveryMode(cartLine) && cartLine.DeliveryMode !== emailDeliveryModeCode
                    : cartLine
            );
        } else if (type === 'pickup') {
            return cart.CartLines.filter((cartLine: CartLine) =>
                cartLine.DeliveryMode && cartLine.DeliveryMode !== '' ? _getCartPickDeliveryMode(cartLine) : null
            );
        }
        return cart.CartLines.filter((cartLine: CartLine) => cartLine.DeliveryMode === emailDeliveryModeCode);
    };

    const _getLineItemsByDeliveryType = (type: deliveryType): ILineItemDeliveryGroup | undefined => {
        if ((pickupDeliveryModeCode === '' || pickupDeliveryModeCode === undefined) && (type === 'pickup' || type === 'email')) {
            return;
        }

        const items = _filterItemsByDiliveryType(type);

        if (items.length === 0) {
            return undefined;
        }

        const count = _countItems(items);
        const title = _getGroupTitleComponent(count, type);

        return {
            LineItemDeliveryGroup: { className: classnames('ms-checkout__line-items-delivery-group', type) },
            LineItemList: { className: 'ms-checkout__line-items-list' },
            heading: <div className='ms-checkout__line-items-group-title'>{title}</div>,
            lineItems: _getLineItemsComponents(items)
        };
    };

    const _getLineItems = (): ILineItems | undefined => {
        const {
            context,
            config: { lineItemsHeading },
            data: { products },
            resources: { editCartText }
        } = input;

        const payLoad = getPayloadObject('click', telemetryContent!, TelemetryConstant.EditCart);
        const attribute = getTelemetryAttributes(telemetryContent!, payLoad);
        const cart = get(input, 'data.checkout.result.checkoutCart.cart');
        const groupClass = retailMultiplePickUpOptionEnabled ? ' multiple-pickup-enabled' : '';
        if (!cart || !cart.CartLines || cart.CartLines.length === 0 || !products) {
            return undefined;
        }

        return {
            LineItems: { className: `ms-checkout__line-items${groupClass}` },
            Header: { className: 'ms-checkout__line-items-header' },
            heading: lineItemsHeading && lineItemsHeading.text && (
                <Msdyn365.Text
                    className='ms-checkout__line-items-heading'
                    {...lineItemsHeading}
                    tag={lineItemsHeading.tag || 'h2'}
                    text={lineItemsHeading.text}
                    editProps={{ onEdit: handleLineItemHeadingChange, requestContext: context.request }}
                />
            ),
            editLink: (
                <Button
                    className='ms-checkout__line-items-edit-cart-link'
                    title={editCartText}
                    color='link'
                    href={Msdyn365.getUrlSync('cart', context.actionContext) || ''}
                    {...attribute}
                >
                    {editCartText}
                </Button>
            ),
            itemsForPickup: _getLineItemsByDeliveryType('pickup'),
            itemsForShip: _getLineItemsByDeliveryType('ship'),
            itemsForEmail: _getLineItemsByDeliveryType('email'),
            itemsGroupWithMulitplePickupMode: retailMultiplePickUpOptionEnabled
                ? _getLineItemsByDeliveryTypeWithMulitplePickupMode()
                : undefined
        };
    };

    const handleLineItemHeadingChange = (event: Msdyn365.ContentEditableEvent) => {
        const {
            config: { lineItemsHeading }
        } = input;
        if (lineItemsHeading) {
            lineItemsHeading.text = event.target.value;
        }
    };

    const _getGroupTitleComponentWithMultiplePickUp = (
        count: number,
        type: deliveryType,
        deliveryMode?: string,
        fulFillmentStoreId?: string
    ): string => {
        const {
            resources: { itemLabel, itemsLabel }
        } = input;

        let emailDeliveryModeDesc: string = '';
        let pickupDeliveryModeDesc: string = '';

        input.data.deliveryOptions.result?.find(productDeliveryOptions => {
            emailDeliveryModeDesc = emailDeliveryModeDesc
                ? emailDeliveryModeDesc
                : productDeliveryOptions.DeliveryOptions?.find(deliveryOption => deliveryOption.Code === emailDeliveryModeCode)
                      ?.Description!;
        });

        input.data.deliveryOptions.result?.find(productDeliveryOptions => {
            pickupDeliveryModeDesc = pickupDeliveryModeDesc
                ? pickupDeliveryModeDesc
                : productDeliveryOptions.DeliveryOptions?.find(deliveryOption => deliveryOption.Code === deliveryMode)?.Description!;
        });

        const pickupTitle: string = `${pickupDeliveryModeDesc}, ${fulFillmentStoreId}`;
        const suffix = count > 1 ? itemsLabel : itemLabel;
        const title =
            type === 'ship'
                ? `(${count} ${suffix})`
                : type === 'pickup'
                ? `${pickupTitle} (${count} ${suffix})`
                : `${emailDeliveryModeDesc} (${count} ${suffix})`;
        return title.replace('{count}', count.toString()).replace('{suffix}', suffix);
    };

    const _filterItemsByMultiplePickupMode = (): CartLine[][] => {
        const cart = get(input, 'data.checkout.result.checkoutCart.cart');
        const getGroupByStorePickup = (items: CartLine[]) => groupBy(items, item => item.FulfillmentStoreId);
        const getGroupByDelivery = (items: CartLine[]) => groupBy(items, item => item.DeliveryMode);
        const groupDelivery = getGroupByDelivery(cart.CartLines);
        const cartLinesGroup: CartLine[] = [];
        const cartLinesGrp: CartLine[][] = [];

        // 1) Group by store and pick up mode
        Object.entries(groupDelivery).forEach(([deliveryMode, groupByDeliveryType]) => {
            // @ts-expect-error
            groupDelivery[deliveryMode] = getGroupByStorePickup(groupByDeliveryType);
            cartLinesGroup.push(getGroupByStorePickup(groupByDeliveryType));
        });

        Object.keys(cartLinesGroup).forEach(key => {
            const cartLines = cartLinesGroup[key];
            Object.keys(cartLines).forEach(index => {
                const cartLine = cartLines[index];
                cartLinesGrp.push(cartLine);
            });
        });

        return cartLinesGrp;
    };

    const _getLineItemsByDeliveryTypeWithMulitplePickupMode = (): ILineItemDeliveryGroup[] | undefined => {
        if (pickupDeliveryModeCode === '' || pickupDeliveryModeCode === undefined) {
            return;
        }

        const {
            resources: { multiplePickUpLabel, shippingLable }
        } = input;

        const items = _filterItemsByMultiplePickupMode();

        if (items.length === 0) {
            return undefined;
        }

        const lineItemDeliveryGroup: ILineItemDeliveryGroup[] = [];
        items.map(item => {
            const count = _countItems(item);
            const cartLine = item[0];
            const pickupDeliveryLocation = _getDeliveryLocation(cartLine);
            const type: deliveryType =
                cartLine.FulfillmentStoreId && cartLine.DeliveryMode
                    ? 'pickup'
                    : cartLine.FulfillmentStoreId === '' &&
                      cartLine.DeliveryMode === emailDeliveryModeCode &&
                      !StringExtensions.isNullOrEmpty(emailDeliveryModeCode)
                    ? 'email'
                    : 'ship';
            const title = _getGroupTitleComponentWithMultiplePickUp(count, type, cartLine.DeliveryMode, pickupDeliveryLocation);
            const groupTitle = type === 'pickup' ? multiplePickUpLabel : type === 'ship' ? shippingLable : 'email';
            const iconClass = `ms-checkout__line-items-group-title-multiple-pickup-${type}icon`;
            lineItemDeliveryGroup.push({
                LineItemDeliveryGroup: { className: classnames('ms-checkout__line-items-delivery-group multiple-pickup', type) },
                LineItemList: { className: 'ms-checkout__line-items-list' },
                lineItemWraperIcon: <div className={iconClass} />,
                lineItemWraper: <div className='ms-checkout__line-items-group-title-multiple-pickup-heading'>{groupTitle}</div>,
                heading: <div className='ms-checkout__line-items-group-title-multiple-pickup-subheading'>{title}</div>,
                lineItems: _getLineItemsComponents(item)
            });
        });

        return lineItemDeliveryGroup;
    };

    return _getLineItems();
};
