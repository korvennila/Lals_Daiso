/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import { PriceComponent } from '@msdyn365-commerce/components';
import { IAny, ICoreContext, IGeneric, IImageSettings, Image, ITelemetry, msdyn365Commerce } from '@msdyn365-commerce/core';
import {
    CommerceListLine,
    ProductPrice,
    ReleasedProductType,
    SimpleProduct
} from '@msdyn365-commerce/retail-proxy/dist/Entities/CommerceTypes.g';
import {
    convertProductDimensionTypeToDimensionTypes,
    getFallbackImageUrl,
    StringExtensions
} from '@msdyn365-commerce-modules/retail-actions';
import {
    // Alert,
    Button,
    getPayloadObject,
    getTelemetryAttributes,
    ITelemetryContent
} from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { IWishlistItemActionMessageState } from '../wishlist-items';
import { WishlistItemDimension } from './wishlist-items-dimensions';
import CustomPopup from '../../../themes/adventureworks/views/components/custom-popup';

export interface IWishlistItemProps extends CommerceListLine {
    product: SimpleProduct;
    wishlistState: IWishlistItemActionMessageState;
    price?: ProductPrice;
    context: ICoreContext<IGeneric<IAny>>;
    productUrl: string;
    imageSettings?: IImageSettings;
    removeFromWishlistText: string;
    isInStock: boolean;
    addToCartText: string;
    outOfStockText: string;
    index: number;
    itemKey: string;
    telemetry: ITelemetry;
    moduleId: string;
    moduleTypeName: string;
    enableImageProductLink?: boolean;
    inventoryInformationLabel?: string;
    inventoryLabelClassName?: string;
    telemetryContent?: ITelemetryContent;
    handlers: {
        onAddToCart(product: SimpleProduct, itemKey: string): void;
        onRemoveItem(productId: number): void | undefined;
        onDismiss(): void;
    };
    resources: {
        productDimensionTypeColor: string;
        productDimensionTypeSize: string;
        productDimensionTypeStyle: string;
        originalPriceText: string;
        currentPriceText: string;
        freePriceText: string;
    };
}

export interface IWishlistItemViewProps {
    key: string;
    productImage: React.ReactNode;
    productLink: React.ReactNode;
    productDimensions?: React.ReactNode[];
    productPrice?: React.ReactNode;
    addToCartButton?: React.ReactNode;
    removeButton?: React.ReactNode;
    productStatusMessage?: React.ReactNode;
    productName?: React.ReactNode;
    productAriaLabel?: string;
    entireProductLink?: string;
    inventoryInformation?: React.ReactNode;
    productUnitOfMeasure?: React.ReactNode;
}

const _addItemToCart = (props: IWishlistItemProps): void => {
    const { product, itemKey, handlers } = props;
    const { onAddToCart } = handlers;

    onAddToCart && product && itemKey && onAddToCart(product, itemKey);
};

const _removeItemFromWishlist = (props: IWishlistItemProps): void => {
    const { onRemoveItem } = props.handlers;
    const { RecordId } = props.product;

    onRemoveItem && RecordId && onRemoveItem(RecordId);
};

const WishListItemActions = {
    addToCart: _addItemToCart,
    removeItem: _removeItemFromWishlist
};

const _getFullProductLink = (props: IWishlistItemProps): string => {
    if (!msdyn365Commerce.isBrowser) {
        return '';
    }

    const fullUrl = new URL(props.productUrl, window.location.href);
    for (const dimension of props.product.Dimensions ?? []) {
        const dimensionValue = dimension.DimensionValue?.Value;
        if (!StringExtensions.isNullOrWhitespace(dimensionValue)) {
            const dimensionName = convertProductDimensionTypeToDimensionTypes(dimension.DimensionTypeValue);
            fullUrl.searchParams.set(dimensionName, dimensionValue!);
        }
    }
    return fullUrl.href;
    // return updateProductUrl(productUrl, context, swatch);
};

const _renderAriaLabel = (props: IWishlistItemProps): string => {
    const { product, price, context, resources } = props;

    const { Name, Dimensions } = product;
    const { productDimensionTypeColor, productDimensionTypeSize, productDimensionTypeStyle } = resources;

    let formattedPrice = 'Free';
    let dimensions = null;

    if (price) {
        formattedPrice =
            price.BasePrice === 0 ? resources.freePriceText : context.cultureFormatter.formatCurrency(price.BasePrice!, price.CurrencyCode);
    }

    if (Dimensions) {
        dimensions = Dimensions.map(productDimension => {
            switch (productDimension.DimensionTypeValue) {
                case 1:
                    return `${productDimensionTypeColor}${productDimension.DimensionValue && productDimension.DimensionValue.Value}`;
                case 3:
                    return `${productDimensionTypeSize}${productDimension.DimensionValue && productDimension.DimensionValue.Value}`;
                case 4:
                    return `${productDimensionTypeStyle}${productDimension.DimensionValue && productDimension.DimensionValue.Value}`;
                default:
                    return '';
            }
        });
    }

    return `${Name} ${formattedPrice} ${(dimensions && dimensions.join('')) || ''}`;
};

/**
 * Renders a link to a product based on the given props.
 * @param input - Wishlist item props with the info about the product.
 * @param productUrl - The url to the product.
 * @returns React component with a link to a product.
 */
const renderProductLink = (input: IWishlistItemProps, productUrl: string) => {
    const { telemetryContent } = input;
    const { RecordId: recordId, Name: productName } = input.product;
    const payLoad = getPayloadObject('click', telemetryContent!, '', recordId.toString());
    const productAttributes = getTelemetryAttributes(telemetryContent!, payLoad);
    const productPageUrlWithSwatch = productUrl;
    return (
        !StringExtensions.isNullOrWhitespace(productPageUrlWithSwatch) && (
            <a
                href={productPageUrlWithSwatch}
                className='ms-wishlist-items__product-link'
                {...productAttributes}
                aria-label={_renderAriaLabel(input)}
            >
                {productName}
            </a>
        )
    );
};

/**
 * Renders a product name box.
 * @param productName - The text to display.
 * @returns React component with a name of a product.
 */
const renderProductName = (productName: string) => {
    return <div className='ms-wishlist-items__product-title'>{productName}</div>;
};

/**
 * Renders inventory information.
 * @param inventoryInformationLabel - The text to display.
 * @param inventoryLabelClassName - The component class name.
 * @returns React component.
 */
const renderInventoryInformationLabel = (inventoryInformationLabel: string | undefined, inventoryLabelClassName: string | undefined) => {
    const inventoryCssName = inventoryLabelClassName
        ? `ms-wishlist-items__inventory-label ${inventoryLabelClassName}`
        : 'ms-wishlist-items__inventory-label';
    return (
        !StringExtensions.isNullOrWhitespace(inventoryInformationLabel) && (
            <span className={inventoryCssName}>{inventoryInformationLabel}</span>
        )
    );
};

/**
 * Renders add to cart button.
 * @param input - Wishlist item props with the configuration.
 * @returns React component.
 */
const WishlistItemAddToCartButtonComponent = (input: IWishlistItemProps) => {
    const { isInStock, addToCartText, outOfStockText } = input;

    // Check if the product is service or not by product type.
    const isServiceItem = input.product.ItemTypeValue === ReleasedProductType.Service;

    const addItemAction = React.useCallback(() => {
        WishListItemActions.addToCart(input);
    }, [input]);

    return (
        <Button
            className='ms-wishlist-items__product-add-button'
            title={((isServiceItem || isInStock) && addToCartText) || outOfStockText}
            onClick={addItemAction}
            disabled={!(isServiceItem || isInStock)}
        >
            {((isServiceItem || isInStock) && addToCartText) || outOfStockText}
        </Button>
    );
};

/**
 * Renders remove from wishlist button.
 * @param input - Wishlist item props with the configuration.
 * @returns React component.
 */
const WishlistItemRemoveFromWishlistButtonComponent = (input: IWishlistItemProps) => {
    const { removeFromWishlistText } = input;

    const removeItemAction = React.useCallback(() => {
        WishListItemActions.removeItem(input);
    }, [input]);

    return <button className='ms-wishlist-items__product-remove-button' aria-label={removeFromWishlistText} onClick={removeItemAction} />;
};

/**
 * Gets the react node for product unit of measure display.
 * @param  context - Module context.
 * @param unitOfMeasure - Product unit of measure.
 * @returns The node representing markup for unit of measure component.
 */
const renderUnitOfMeasure = (context: ICoreContext<IGeneric<IAny>>, unitOfMeasure?: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Do not need type check for appsettings
    if (context.app.config && (!context.app.config.unitOfMeasureDisplayType || context.app.config.unitOfMeasureDisplayType === 'none')) {
        return undefined;
    }

    if (!unitOfMeasure) {
        return undefined;
    }

    return (
        <div className='msc-wishlistitems__product-unit-of-measure'>
            <span>{unitOfMeasure}</span>
        </div>
    );
};

export const WishlistItem = (input: IWishlistItemProps): IWishlistItemViewProps | null => {
    const {
        product,
        price,
        context,
        imageSettings,
        wishlistState,
        itemKey,
        handlers,
        inventoryInformationLabel,
        enableImageProductLink,
        inventoryLabelClassName
    } = input;

    if (!product) {
        return null;
    }

    const { RecordId, Name, PrimaryImageUrl, Dimensions } = product;
    if (product.RecordId) {
        const fallbackImage = getFallbackImageUrl(
            product.ItemId,
            context.actionContext.requestContext.apiSettings,
            context.request.app?.config?.OmniChannelMedia
        );
        const productUrl = _getFullProductLink(input);
        return {
            key: `${RecordId}-item`,
            productImage:
                PrimaryImageUrl && Name && _renderProductImage(context, product.Name!, PrimaryImageUrl, fallbackImage, imageSettings),
            productLink: renderProductLink(input, productUrl),
            productDimensions: Dimensions && _renderProductDimensions(input),
            productPrice: price && _renderPrice(input),
            productUnitOfMeasure: product.DefaultUnitOfMeasure && renderUnitOfMeasure(context, product.DefaultUnitOfMeasure),
            entireProductLink: enableImageProductLink ? productUrl : undefined,
            productAriaLabel: enableImageProductLink ? _renderAriaLabel(input) : undefined,
            productName: enableImageProductLink && Name && renderProductName(Name),

            addToCartButton: <WishlistItemAddToCartButtonComponent {...input} />,
            inventoryInformation: renderInventoryInformationLabel(inventoryInformationLabel, inventoryLabelClassName),
            removeButton: <WishlistItemRemoveFromWishlistButtonComponent {...input} />,
            productStatusMessage: wishlistState &&
                wishlistState.isOpen &&
                wishlistState.productId === RecordId &&
                // wishlistState.itemKey === itemKey && (
                //     <div className='ms-wishlist-items__product-status'>
                //         <Alert color={wishlistState.statusCssString} isOpen={wishlistState.isOpen} toggle={handlers.onDismiss}>
                //             <span>{wishlistState.userMessage}</span>
                //         </Alert>
                //     </div>
                // )
                wishlistState.itemKey === itemKey && (
                    <CustomPopup
                        isVisible={wishlistState.isOpen}
                        onClose={handlers.onDismiss}
                        message={wishlistState.userMessage}
                    ></CustomPopup>
                )
        };
    }
    return null;
};

const _renderProductImage = (
    context: ICoreContext,
    heading: string,
    image?: string,
    fallbackImage?: string,
    imageSettings?: IImageSettings
): JSX.Element | null => {
    const defaultImageSettings: IImageSettings = {
        viewports: {
            xs: { q: 'w=315&h=315&m=6', w: 0, h: 0 },
            lg: { q: 'w=315&h=315&m=6', w: 0, h: 0 },
            xl: { q: 'w=315&h=315&m=6', w: 0, h: 0 }
        },
        lazyload: true,
        cropFocalRegion: true
    };

    if (imageSettings) {
        imageSettings.cropFocalRegion = true;
    }

    if (image) {
        return (
            <Image
                requestContext={context.actionContext.requestContext}
                className='ms-wishlist-items__product-image'
                altText={heading}
                title={heading}
                src={image}
                fallBackSrc={fallbackImage}
                gridSettings={context.request.gridSettings!}
                imageSettings={imageSettings || defaultImageSettings}
                loadFailureBehavior='empty'
            />
        );
    }
    return null;
};

const _renderPrice = (props: IWishlistItemProps): JSX.Element | null => {
    const { price, context, moduleId, moduleTypeName, resources } = props;

    if (price) {
        return (
            <PriceComponent
                id={moduleId}
                typeName={moduleTypeName}
                data={{ price }}
                className='ms-wishlist-items__product-price'
                freePriceText={resources.freePriceText}
                originalPriceText={resources.originalPriceText}
                currentPriceText={resources.currentPriceText}
                context={context}
            />
        );
    }
    return null;
};

const _renderProductDimensions = (props: IWishlistItemProps): (React.ReactNode | undefined)[] => {
    const { product, resources } = props;

    if (!product || !product.Dimensions) {
        return [];
    }

    return product.Dimensions.map((dimension, index) => {
        if (!dimension.DimensionValue || !dimension.DimensionValue.Value) {
            return undefined;
        }

        let type = '';

        switch (dimension.DimensionTypeValue) {
            case 1: {
                type = resources.productDimensionTypeColor;
                break;
            }
            case 3: {
                type = resources.productDimensionTypeSize;
                break;
            }
            case 4: {
                type = resources.productDimensionTypeStyle;
                break;
            }
            default:
                return undefined;
        }

        return (
            <WishlistItemDimension
                key={`${product.RecordId}-dimensions-${index}`}
                className='msc-price ms-wishlist-items__product-dimension'
                dimensionType={type}
                dimensionValue={dimension.DimensionValue.Value}
            />
        );
    });
};
