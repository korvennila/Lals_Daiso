/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

import { CartLinePriceEditor, ICartLinePriceEditorResources, PriceComponent } from '@msdyn365-commerce/components';
import MsDyn365, {
    IComponentProps,
    IGridSettings,
    IImageSettings,
    Image,
    isChannelTypeB2B,
    msdyn365Commerce
} from '@msdyn365-commerce/core';
import { ICartState } from '@msdyn365-commerce/global-state';
import {
    CartLine,
    ChannelDeliveryOptionConfiguration,
    DiscountLine,
    DiscountLineType,
    ProductCatalog,
    ProductDimensionType,
    SalesLine,
    SimpleProduct
} from '@msdyn365-commerce/retail-proxy';
import { ArrayExtensions, StringExtensions, getFallbackImageUrl, validateCatalogId } from '@msdyn365-commerce-modules/retail-actions';
import { getPayloadObject, getTelemetryAttributes, IncrementalQuantity, ITelemetryContent } from '@msdyn365-commerce-modules/utilities';
import classNames from 'classnames';
import * as React from 'react';

/**
 * ICartlineResourceString: Interface for specifying the
 * resource strings that the component needs.
 */
export interface ICartlineResourceString {
    /**
     * Display string for discount label.
     */
    discountStringText: string;

    /**
     * String for size key.
     */
    sizeString: string;

    /**
     * String for color key.
     */
    colorString: string;

    /**
     * String associated with the configuration product dimension.
     */
    configString: string;

    /**
     * String for style key.
     */
    styleString: string;

    /**
     * String for amount key.
     */
    amountString?: string;

    /**
     * Display string for quantity label.
     */
    quantityDisplayString: string;

    /**
     * Display string for quantity label.
     */
    inputQuantityAriaLabel: string;

    /**
     * Aria label for the decrement button in quantity component.
     */
    decrementButtonAriaLabel: string;

    /**
     * Aria label for the increment button in quantity component.
     */
    incrementButtonAriaLabel: string;

    /**
     * Original text screenreader.
     */
    originalPriceText: string;

    /**
     * Current text screenreader.
     */
    currentPriceText: string;

    /**
     * Shipping Charges Text.
     */
    shippingChargesText: string;

    /**
     * Price Editor Charges Text.
     */
    priceEditorResources?: ICartLinePriceEditorResources;

    /**
     * Sales agreement price prompt text.
     */
    salesAgreementPricePrompt?: string;

    /**
     * Shipping text.
     */
    shippingText?: string;

    /**
     * Confirmed Ship Date Label.
     */
    confirmedShipDateLabel?: string;
}

/**
 * Represents cart line data interface.
 */
interface ICartLineData {
    cartLine: CartLine | SalesLine;
    cartState?: ICartState;
    product?: SimpleProduct;
    catalogs?: ProductCatalog[];
}

/**
 * ICartLineProps: The props required to render cartLineitem.
 */
export interface ICartLineProps extends IComponentProps<ICartLineData> {
    /**
     * The flag to change the quantity component from interactible to static.
     */
    disableQuantityInteractivity?: boolean;

    /**
     * The primary image url.
     */
    primaryImageUrl?: string;

    /**
     * The product url.
     */
    productUrl?: string;

    /**
     * GridSettings for the product image in cartLine.
     */
    gridSettings: IGridSettings;

    /**
     * ImageSettings for the product image in cartLine.
     */
    imageSettings: IImageSettings;

    /**
     * Boolean flag to indicate if the item is out of stock.
     */
    isOutOfStock?: boolean;

    /**
     * Flag to make quantity section editable.
     */
    isQuantityEditable?: boolean;

    /**
     * Max quantity for line item.
     */
    maxQuantity?: number;

    /**
     * Current quantity for line item.
     */
    currentQuantity?: number;

    /**
     * Resource string for the component.
     */
    resources: ICartlineResourceString;

    /**
     * SalesLine flag.
     */
    isSalesLine?: boolean;

    /**
     * Error message to show in place of quantity.
     */
    errorMessage?: string;

    /**
     * Inventory information label.
     */
    inventoryInformationLabel?: string;

    /**
     * Inventory information class name.
     */
    inventoryLabelClassName?: string;

    /**
     * Flag to show/hide shipping charges for line items.
     */
    showShippingChargesForLineItems?: boolean;

    /**
     * Boolean flag to indicate if cart state status is ready.
     */
    isCartStateReady?: boolean;

    /**
     * Chanel Delivery Option configuration is from api.
     */
    channelDeliveryOptionConfig?: ChannelDeliveryOptionConfiguration;

    /**
     * The telemetry content.
     */
    telemetryContent?: ITelemetryContent;

    /**
     * The cart line delivery location.
     */
    deliveryLocation?: string;

    /**
     * Quantity onChange callback.
     */
    quantityOnChange?(cartLine: CartLine, newQuantity: number): boolean;
    priceCurrency?: string;

    /**
     * Sales line confirmed ship date.
     */
    confirmedShipDate?: string;
}

/**
 * Represents dimensions strings.
 */
interface IDimensionStrings {
    /**
     * String for size key.
     */
    sizeString: string;

    /**
     * String for color key.
     */
    colorString: string;

    /**
     * String associated with the configuration product dimension.
     */
    configString: string;

    /**
     * String for style key.
     */
    styleString: string;

    /**
     * String for amount key.
     */
    amountString?: string;
}

/**
 * Renders catalog label for the cart line.
 * @param props - Cart line props.
 * @returns Catalog label.
 */
const CatalogLabelComponent: React.FC<ICartLineProps> = (props: ICartLineProps) => {
    const catalogId = props.data.cartLine.CatalogId;
    validateCatalogId(catalogId);

    if (!isChannelTypeB2B(props.context.actionContext.requestContext) || !catalogId || !ArrayExtensions.hasElements(props.data.catalogs)) {
        return null;
    }

    const catalog = props.data.catalogs.find(item => item.RecordId === catalogId);

    if (!catalog || !catalog.Name) {
        return null;
    }

    return <div className='msc-cart-line__catalog-label'>{catalog.Name}</div>;
};

const cartLineItemFunctions = {
    /**
     * Render product dimensions.
     * @param product - Product data.
     * @param dimensionStrings - Dimension strings interface.
     * @returns JSX Element.
     */
    renderProductDimensions: (product: SimpleProduct, dimensionStrings: IDimensionStrings) => {
        if (!product.Dimensions) {
            return [];
        }

        return product.Dimensions.map(productDimension => {
            if (productDimension.DimensionTypeValue === ProductDimensionType.Color) {
                return (
                    <div key={`${product.RecordId}ProductDimensions1`} className='msc-cart-line__product-variant-item'>
                        <span className='msc-cart-line__product-variant-color'>
                            {dimensionStrings.colorString}
                            {': '}
                            <span className='name'>{productDimension.DimensionValue?.Value}</span>
                        </span>
                    </div>
                );
            }

            if (productDimension.DimensionTypeValue === ProductDimensionType.Configuration) {
                return (
                    <div key={`${product.RecordId}ProductDimensions2`} className='msc-cart-line__product-variant-item'>
                        <span className='msc-cart-line__product-configuration'>
                            {dimensionStrings.configString}
                            {': '}
                            <span className='name'>{productDimension.DimensionValue?.Value}</span>
                        </span>
                    </div>
                );
            }

            if (productDimension.DimensionTypeValue === ProductDimensionType.Size) {
                return (
                    <div key={`${product.RecordId}ProductDimensions3`} className='msc-cart-line__product-variant-item'>
                        <span className='msc-cart-line__product-variant-size'>
                            {dimensionStrings.sizeString}
                            {': '}
                            <span className='name'>{productDimension.DimensionValue?.Value}</span>
                        </span>
                    </div>
                );
            }

            if (productDimension.DimensionTypeValue === ProductDimensionType.Style) {
                return (
                    <div key={`${product.RecordId}ProductDimensions4`} className='msc-cart-line__product-variant-item'>
                        <span className='msc-cart-line__product-variant-style'>
                            {product.IsGiftCard ? dimensionStrings.amountString : dimensionStrings.styleString}
                            {': '}
                            <span className='name'>{productDimension.DimensionValue?.Value}</span>
                        </span>
                    </div>
                );
            }
            return null;
        });
    },

    /**
     * Gets the react node for product unit of price display.
     * @param props - The cart line props.
     * @returns The node representing markup for unit of measure component.
     */
    renderProductUnitPrice: (props: ICartLineProps) => {
        if (!props.data.cartLine.Price) {
            return null;
        }
        const zeroQuantity: number = 0;
        return (
            <div className='msc-cart-line__product-unit-price'>
                <span>
                    <PriceComponent
                        data={
                            props.data.cartLine.Quantity && props.data.cartLine.Quantity > zeroQuantity
                                ? {
                                      price: {
                                          CustomerContextualPrice: props.data.cartLine.Price
                                      }
                                  }
                                : {
                                      price: {
                                          CustomerContextualPrice: props.data.cartLine.Price
                                      }
                                  }
                        }
                        context={props.context}
                        id={props.id}
                        typeName={props.typeName}
                        currencyCode={props.priceCurrency}
                    />
                </span>
            </div>
        );
    },

    /**
     * Render discount lines.
     * @param props - The cart line props.
     * @returns JSX element.
     */
    renderDiscountLines: (props: ICartLineProps) => {
        if (!props.data.cartLine.DiscountLines || !ArrayExtensions.hasElements(props.data.cartLine.DiscountLines)) {
            return null;
        }

        /**
         * Get the updated discount percentage.
         * @param discountLine - The discount line.
         * @param cartLine - The cart line.
         * @returns The updated discount percentage.
         */
        const discountPercent = (discountLine: DiscountLine, cartLine: CartLine): number => {
            const numberZero = 0;
            const decimalPrecision = 2;
            const fullPercentage = 100;
            let updatedPercent: number = discountLine.Percentage ?? numberZero;

            if (
                (discountLine.Percentage === numberZero ||
                    (discountLine.DiscountLineTypeValue && discountLine.DiscountLineTypeValue === DiscountLineType.TenderTypeDiscount)) &&
                cartLine.Price &&
                cartLine.Price > numberZero &&
                cartLine.Quantity &&
                cartLine.Quantity !== numberZero
            ) {
                const effectiveAmount = discountLine.EffectiveAmount ?? numberZero;
                updatedPercent = Number(
                    ((effectiveAmount / (cartLine.Price * cartLine.Quantity)) * fullPercentage).toFixed(decimalPrecision)
                );
            }

            return updatedPercent;
        };

        return props.data.cartLine.DiscountLines.map((discountLine, index) => {
            return (
                <div key={discountLine.OfferId ?? index} className='msc-cart-line__product-discount'>
                    <span>{discountLine.OfferName ? discountLine.OfferName : ''}</span>
                    <span className='msc-cart-line-item-product-discount-price'>
                        <PriceComponent
                            data={
                                props.isSalesLine
                                    ? {
                                          price: {
                                              // @ts-expect-error -- Auto suppressed.
                                              CustomerContextualPrice: props.data.cartLine.PeriodicDiscount
                                          }
                                      }
                                    : {
                                          price: {
                                              CustomerContextualPrice: discountLine.EffectiveAmount,
                                              BasePrice: discountLine.EffectiveAmount
                                          }
                                      }
                            }
                            context={props.context}
                            id={props.id}
                            typeName={props.typeName}
                            currencyCode={props.priceCurrency}
                        />
                    </span>
                    <span className='msc-cart-line__product-discount-percentage'>
                        {` (${discountLine.Percentage !== undefined ? discountPercent(discountLine, props.data.cartLine) : ''}%)`}
                    </span>
                </div>
            );
        });
    },

    /**
     * Render inventory label.
     * @param props - The cart line props.
     * @returns JSX element.
     */
    renderInventoryLabel: (props: ICartLineProps) => {
        const inventoryCssName = props.inventoryLabelClassName
            ? `msc-cart-line__product-inventory-label ${props.inventoryLabelClassName}`
            : 'msc-cart-line__product-inventory-label';

        return <p className={inventoryCssName}>{props.inventoryInformationLabel}</p>;
    },

    /**
     * Render shipping label.
     * @param props - The cart line props.
     * @returns JSX element.
     */
    renderShippingLabel: (props: ICartLineProps) => {
        const pickupDeliveryModeCode = props.context.request.channel?.PickupDeliveryModeCode;
        const channelDeliveryOptionConfig = props.channelDeliveryOptionConfig;
        const cartline = props.data.cartLine;
        let hasShippingMethod = false;
        if (channelDeliveryOptionConfig !== undefined) {
            hasShippingMethod = !!(
                cartline.DeliveryMode &&
                channelDeliveryOptionConfig.PickupDeliveryModeCodes?.some(deliveryMode => deliveryMode !== cartline.DeliveryMode)
            );
        } else {
            hasShippingMethod = !!(cartline.DeliveryMode && cartline.DeliveryMode !== pickupDeliveryModeCode);
        }
        if (!hasShippingMethod) {
            return undefined;
        }

        const shippingChargeLines = (cartline.ChargeLines ?? []).filter(chargeLine => chargeLine.IsShipping);

        if (!ArrayExtensions.hasElements(shippingChargeLines)) {
            return undefined;
        }

        const defaultCharge: number = 0;
        const freightFee = shippingChargeLines.reduce((chargeTotal, chargeLine) => {
            return chargeTotal + (chargeLine.CalculatedAmount ?? defaultCharge);
        }, defaultCharge);

        const priceComponent = (
            <PriceComponent
                data={{
                    price: {
                        CustomerContextualPrice: freightFee
                    }
                }}
                freePriceText='Free'
                context={props.context}
                id={props.id}
                typeName={props.typeName}
                className='msc-cart-line__freight-actual'
                currencyCode={props.priceCurrency}
            />
        );
        return (
            <>
                <label className='msc-cart-line__freight-label'>{`${props.resources.shippingChargesText}:`}</label>
                <span className='shipping-value'>{priceComponent}</span>
            </>
        );
    },

    /**
     * Render other charges.
     * @param props - The cart line props.
     * @returns JSX element.
     */
    renderOtherCharges: (props: ICartLineProps) => {
        const cartline = props.data.cartLine;
        const otherCharges = cartline.ChargeLines?.filter(chargeline => !chargeline.IsShipping);

        return (
            otherCharges?.map((otherCharge, index) => {
                const itemIndex = index;
                return otherCharge.CalculatedAmount ? (
                    <div className='msc-cart-line__other-charges' key={itemIndex}>
                        <label className='msc-cart-line__other-charges-label'>{`${String(otherCharge.Description)}:`}</label>
                        <span className='other-charge-value'>
                            <PriceComponent
                                data={{
                                    price: {
                                        CustomerContextualPrice: otherCharge.CalculatedAmount
                                    }
                                }}
                                context={props.context}
                                id={props.id}
                                typeName={props.typeName}
                                className='msc-cart-line__other-charges-actual'
                                currencyCode={props.priceCurrency}
                            />
                        </span>
                    </div>
                ) : (
                    ''
                );
            }) ?? undefined
        );
    },

    /**
     * Render the sales agreement prompt.
     * @param props - The ICartLineProps.
     * @returns The JSX.Element.
     */
    renderSalesAgreementPrompt: (props: ICartLineProps): JSX.Element | null => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers -- We use 0 to indicate no sales agreement applied on the cart line.
        if (props.data.cartLine.SalesAgreementLineRecordId === 0) {
            return null;
        }
        return <div className='msc-cart-line__sales-agreement-prompt'>{props.resources.salesAgreementPricePrompt}</div>;
    },

    renderConfirmedShipDate: (props: ICartLineProps) => {
        if (!props.isSalesLine || props.confirmedShipDate === undefined || StringExtensions.isNullOrEmpty(props.confirmedShipDate)) {
            return null;
        }
        return (
            <div className='msc-cart-line__confirmed-ship-date'>
                <span className='msc-cart-line__confirmed-ship-date-label'>{props.resources.confirmedShipDateLabel}</span>
                <span className='msc-cart-line__confirmed-ship-date-value'>{props.confirmedShipDate}</span>
            </div>
        );
    }
};

/**
 * Render cartline component.
 * @param props - The cart line props.
 * @returns JSX element.
 */
// eslint-disable-next-line no-redeclare
const CartLine: React.FC<ICartLineProps> = (props: ICartLineProps) => {
    const { isSalesLine, productUrl, resources } = props;
    const { product, cartLine } = props.data;

    const destructDimensionStrings = {
        sizeString: resources.sizeString,
        colorString: resources.colorString,
        styleString: resources.styleString,
        configString: resources.configString,
        amountString: resources.amountString
    };

    const fallbackImageUrl =
        product &&
        getFallbackImageUrl(
            product.ItemId,
            props.context.actionContext.requestContext.apiSettings,
            props.context.request.app?.config?.OmniChannelMedia
        );
    const productDimensions = product && cartLineItemFunctions.renderProductDimensions(product, destructDimensionStrings);
    const renderProductUnitPrice = cartLineItemFunctions.renderProductUnitPrice(props);
    const imageSettings = props.imageSettings;
    if (imageSettings) {
        imageSettings.cropFocalRegion = true;
    }
    const renderDiscountLines = cartLineItemFunctions.renderDiscountLines(props);
    const renderInventoryLabel = cartLineItemFunctions.renderInventoryLabel(props);
    const renderShippingLabel = cartLineItemFunctions.renderShippingLabel(props);
    const renderOtherCharges = cartLineItemFunctions.renderOtherCharges(props);
    const renderConfirmedShipDate = cartLineItemFunctions.renderConfirmedShipDate(props);
    const renderSalesAgreementPrompt = cartLineItemFunctions.renderSalesAgreementPrompt(props);
    const payLoad = getPayloadObject('click', props.telemetryContent!, '', product?.RecordId.toString());
    const productAttribute = getTelemetryAttributes(props.telemetryContent!, payLoad);
    const productName = product?.Name ?? cartLine.Description;
    const imgeClassName = props.data.cartLine.IsInvoiceLine ? 'msc-cart-line__invoice-image' : 'msc-cart-line__product-image';
    const cartLineContentClassName = props.data.cartLine.IsInvoiceLine ? 'msc-cart-line__invoice-content' : 'msc-cart-line__content';

    /**
     * Render other charges.
     * @param newValue - The cart line props.
     * @returns Boolean.
     */
    const onChange = (newValue: number): boolean => {
        if (props.quantityOnChange) {
            return props.quantityOnChange(props.data.cartLine, newValue);
        }
        return true;
    };

    /**
     * Generate error message.
     * @returns JSX element.
     */
    const generateErrorMessage = (): JSX.Element | null => {
        if (props.errorMessage) {
            return (
                <div className='msc-alert__header'>
                    <span className='msi-exclamation-triangle' />
                    <span>{props.errorMessage}</span>
                </div>
            );
        }

        return null;
    };

    /**
     * Render Saving component.
     * @returns JSX element.
     */
    const renderSaving = (): JSX.Element | null => {
        if (!props.data.cartLine.DiscountAmount) {
            return null;
        }
        const discountAmountZero: number = 0;

        if (props.data.cartLine.DiscountAmount > discountAmountZero) {
            return (
                <>
                    <span className='msc-cart-line__product-savings-label'>{`${props.resources.discountStringText || 'Discount'}`}</span>
                    <PriceComponent
                        data={
                            props.isSalesLine
                                ? {
                                      price: {
                                          // @ts-expect-error -- Auto suppressed.
                                          CustomerContextualPrice: props.data.cartLine.PeriodicDiscount
                                      }
                                  }
                                : {
                                      price: {
                                          CustomerContextualPrice: props.data.cartLine.DiscountAmount,
                                          BasePrice: props.data.cartLine.DiscountAmount
                                      }
                                  }
                        }
                        context={props.context}
                        id={props.id}
                        typeName={props.typeName}
                        className='msc-cart-line__product-savings-text'
                        currencyCode={props.priceCurrency}
                    />
                </>
            );
        }
        return null;
    };

    /**
     * Gets the react node for product unit of measure display.
     * @returns The node representing markup for unit of measure component.
     */
    const renderUnitOfMeasure = () => {
        if (props.data.cartLine.IsInvoiceLine) {
            return null;
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -- Do not need type check for appsettings
        if (!props.context.app.config.unitOfMeasureDisplayType || props.context.app.config.unitOfMeasureDisplayType === 'none') {
            return undefined;
        }

        if (!product || !product.DefaultUnitOfMeasure) {
            return undefined;
        }

        return (
            <div className='msc-cart-line__product-unit-of-measure'>
                <span>{product.DefaultUnitOfMeasure}</span>
            </div>
        );
    };

    /**
     * Generate quantity and price component.
     * @returns JSX element.
     */
    const generateQuantityAndPrice = (): JSX.Element[] | null => {
        const nodes = [];
        const defaultMaxQuantity: number = 10;
        const singleQuantity: number = 1;
        const unitOfMeasure = renderUnitOfMeasure();

        // No quantity selector for invoice line
        if (!props.data.cartLine.IsInvoiceLine) {
            if (props.data.product && props.isQuantityEditable) {
                nodes.push(
                    <div className='msc-cart-line__product-quantity'>
                        <div className='msc-cart-line__product-quantity-label'>{resources.quantityDisplayString}</div>

                        {generateErrorMessage()}

                        <IncrementalQuantity
                            id={`msc-cart-line__quantity_${props.data.product.RecordId}-
                            ${String(props.data.cartLine.DeliveryMode)}-${String(props.data.cartLine.LineId)}`}
                            max={props.maxQuantity ?? defaultMaxQuantity}
                            currentCount={props.currentQuantity}
                            onChange={onChange}
                            inputQuantityAriaLabel={resources.inputQuantityAriaLabel}
                            decrementButtonAriaLabel={resources.decrementButtonAriaLabel}
                            incrementButtonAriaLabel={resources.incrementButtonAriaLabel}
                            key={props.data.cartLine.LineId}
                            disabled={!props.isCartStateReady}
                            isGiftCard={props.data.product.IsGiftCard ?? props.isOutOfStock}
                            telemetryContent={props.telemetryContent}
                        />
                        {unitOfMeasure}
                    </div>
                );
            } else {
                nodes.push(
                    <div
                        className={classNames('msc-cart-line__quantity', {
                            'single-quantity': props.data.cartLine.Quantity === singleQuantity
                        })}
                    >
                        {unitOfMeasure}
                        <label className='quantity-label' htmlFor='quantity'>
                            {resources.quantityDisplayString}
                            {': '}
                        </label>

                        {generateErrorMessage()}

                        <span className='quantity-value'>{props.data.cartLine.Quantity}</span>
                    </div>
                );
            }
        }

        nodes.push(
            <div className='msc-cart-line__product-savings'>
                <PriceComponent
                    data={
                        isSalesLine
                            ? {
                                  price: {
                                      CustomerContextualPrice: (props.data.cartLine as SalesLine).NetAmountWithAllInclusiveTax,
                                      BasePrice: (props.data.cartLine as SalesLine).GrossAmount
                                  }
                              }
                            : {
                                  price: {
                                      CustomerContextualPrice: (props.data.cartLine as CartLine).ExtendedPrice,
                                      BasePrice: props.data.cartLine.NetPrice
                                  }
                              }
                    }
                    context={props.context}
                    id={props.id}
                    typeName={props.typeName}
                    className='msc-cart-line__product-savings-actual'
                    originalPriceText={resources.originalPriceText}
                    currentPriceText={resources.currentPriceText}
                    currencyCode={props.priceCurrency}
                />
                {renderSaving()}
                {props.isOutOfStock ? renderInventoryLabel : null}
            </div>
        );

        return nodes;
    };

    const _renderStoreLocation = (): JSX.Element | null => {
        if (cartLine && cartLine.FulfillmentStoreId) {
            return (
                <div className='msc-cart-line__content__bopis-method'>
                    <span className='pick-up'>{props.deliveryLocation}</span>
                </div>
            );
        } else {
            return (
                <div className='msc-cart-line__content__bopis-method'>
                    <span className='shipping'>{props.deliveryLocation}</span>
                </div>
            );
        }
    };

    return (
        <div className='msc-cart-line'>
            {MsDyn365.isBrowser ? (
                <a className={imgeClassName} href={productUrl} aria-label={productName} role='link'>
                    <Image
                        requestContext={props.context.actionContext.requestContext}
                        aria-hidden='true'
                        src={props.primaryImageUrl ?? 'empty'}
                        fallBackSrc={fallbackImageUrl}
                        altText={productName}
                        gridSettings={props.gridSettings}
                        imageSettings={imageSettings}
                        loadFailureBehavior='empty'
                    />
                </a>
            ) : null}
            <div className={cartLineContentClassName}>
                <div className='msc-cart-line__product'>
                    <CatalogLabelComponent {...props} />
                    {MsDyn365.isBrowser ? (
                        <a className='msc-cart-line__product-title' href={productUrl} {...productAttribute}>
                            {productName}
                        </a>
                    ) : null}
                    {ArrayExtensions.hasElements(productDimensions) ? (
                        <div className='msc-cart-line__product-variants'>{productDimensions}</div>
                    ) : (
                        ''
                    )}
                    <div className='msc-cart-line__product-price'>
                        <PriceComponent
                            data={
                                isSalesLine
                                    ? {
                                          price: {
                                              CustomerContextualPrice: (props.data.cartLine as SalesLine).NetAmountWithAllInclusiveTax,
                                              BasePrice: (props.data.cartLine as SalesLine).GrossAmount
                                          }
                                      }
                                    : {
                                          price: {
                                              CustomerContextualPrice: (props.data.cartLine as CartLine).ExtendedPrice,
                                              BasePrice: props.data.cartLine.NetPrice
                                          }
                                      }
                            }
                            context={props.context}
                            id={props.id}
                            typeName={props.typeName}
                            className='msc-cart-line__product-discount-value'
                            currencyCode={props.priceCurrency}
                        />
                        {renderConfirmedShipDate}
                        {renderUnitOfMeasure()}
                    </div>
                    {renderInventoryLabel}
                    {renderDiscountLines}
                    {props.showShippingChargesForLineItems && <div className='msc-cart-line__freight'>{renderShippingLabel}</div>}
                    {renderOtherCharges}
                    {renderSalesAgreementPrompt}
                </div>
                {renderProductUnitPrice}
                {generateQuantityAndPrice()}
                {renderSalesAgreementPrompt}
                {props.data.cartLine.IsInvoiceLine && props.data.cartState && props.resources.priceEditorResources && (
                    <CartLinePriceEditor
                        className='msc-cart-line__price-editor-container'
                        context={props.context}
                        resources={props.resources.priceEditorResources}
                        cartState={props.data.cartState}
                        cartLine={props.data.cartLine}
                    />
                )}
                {_renderStoreLocation()}
            </div>
        </div>
    );
};

// @ts-expect-error
export const CartLineItemComponent: React.FunctionComponent<ICartLineProps> = msdyn365Commerce.createComponentOverride<ICartline>(
    'CartLineItem',
    {
        component: CartLine,
        ...cartLineItemFunctions
    }
);

export default CartLineItemComponent;
