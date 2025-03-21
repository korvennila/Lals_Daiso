/*!
 * Copyright (c) Microsoft Corporation.
 * All rights reserved. See LICENSE in the project root for license information.
 */

/* eslint-disable no-duplicate-imports */
import {
    AddToCartBehavior,
    IAddToCartFailureResult,
    IAddToCartResources,
    ItemSuccessfullyAddedToCartNotification,
    PriceComponent
} from '@msdyn365-commerce/components';
import { getUrlSync, ICoreContext, IImageSettings } from '@msdyn365-commerce/core';
import { ICartActionResult } from '@msdyn365-commerce/global-state';
import { DeliveryOption, FeatureState, OrgUnitLocation, ProductAvailableQuantity, ProductDimension } from '@msdyn365-commerce/retail-proxy';
import { NotificationsManager } from '@msdyn365-commerce-modules/notifications-core';
import {
    ArrayExtensions,
    DeliveryMode,
    IProductInventoryInformation,
    isAggregatedInventory
} from '@msdyn365-commerce-modules/retail-actions';
import { getTelemetryObject, Heading, INodeProps, IPopupProps, Popup } from '@msdyn365-commerce-modules/utilities';
import * as React from 'react';

import { BuyboxErrorBlock } from '@msdyn365-commerce-modules/buybox';
import { IBuyboxCallbacks, IBuyboxState } from '@msdyn365-commerce-modules/buybox';
import { getConfigureErrors, getGenericError } from '@msdyn365-commerce-modules/buybox';
import { IBuyboxData } from '../buybox.data';
import { IBuyboxProps, IBuyboxResources } from '../buybox.props.autogenerated';

const modalCloseButtonReference: React.RefObject<HTMLButtonElement> = React.createRef();

/**
 * FindinStore failure Interface.
 */
export interface IFindInStoreFailureResult {
    missingDimensions?: ProductDimension[];
}

/**
 * BuyBoxFindinStore View Props Interface.
 */
export interface IBuyboxFindInStoreViewProps {
    storeSelector?: React.ReactNode;
    heading?: React.ReactNode;
    description?: React.ReactNode;
    errors?: React.ReactNode;
    button?: React.ReactNode;
    productPickupOptionList?: React.ReactNode;

    modal?: React.ReactNode;

    ContainerProps: INodeProps;

    openFindInStoreDialog(): Promise<void>;
}

/**
 * On click find store handler.
 * @param props -Buybox data.
 * @param state -Buybox state.
 * @param callbacks -Buybox callbacks.
 * @returns Find in store.
 */
const onClickFindInStoreHandler = (props: IBuyboxProps<IBuyboxData>, state: IBuyboxState, callbacks: IBuyboxCallbacks) => async () => {
    await findInStoreOnClick(props, state, callbacks);
};

/**
 * Inventory settings based on the inventory policy for aggregated availability.
 */
interface IInventorySettingsProps {
    isSectionDisabled: boolean;
    description: string;
    buttonText: string;
}

/**
 * The function defines the settings values for a given inventory configuration.
 * @param context - The context.
 * @param isStockCheck - Flag to enable inventory validation.
 * @param productAvailability - The product inventory information.
 * @param buyboxResources - The buybox string resources.
 * @param isLoading - Is loading.
 * @returns Boolean.
 */
function getFindInStoreInventorySettings(
    context: ICoreContext,
    isStockCheck: boolean,
    productAvailability: IProductInventoryInformation[] | undefined,
    buyboxResources: IBuyboxResources,
    isLoading?: boolean
): IInventorySettingsProps {
    // If shouldValidateAggregation is true then is required to check for the product inventory, based on this the messaging will change
    // and the find in store button will be ensbled or disabled

    let isSectionDisabled: boolean;
    let buttonText;
    let description: string;

    let pickupInventory: IProductInventoryInformation | undefined;

    if (!isStockCheck || isLoading) {
        return {
            isSectionDisabled: false,
            buttonText: buyboxResources.findInStoreLinkText,
            description: buyboxResources.findInStoreDescriptionText
        };
    }

    if (productAvailability) {
        pickupInventory = productAvailability.find(pickup => pickup.deliveryType === DeliveryMode.pickup);
    }

    // If aggregated is enabled, then we need to validate the inventor check for find in store.
    // If an individual is selected, then we will always show a find in store button.
    if (isAggregatedInventory(context.actionContext)) {
        if (productAvailability && pickupInventory?.IsProductAvailable) {
            isSectionDisabled = false;
            buttonText = buyboxResources.findInStoreLinkText;
            description = buyboxResources.findInStoreDescriptionText;
        } else {
            isSectionDisabled = true;
            buttonText = buyboxResources.findInStoreNotAvailableTextButton;
            description = buyboxResources.findInStoreNotAvailableDescription;
        }
    } else {
        isSectionDisabled = false;
        buttonText = buyboxResources.findInStoreLinkText;
        description = buyboxResources.findInStoreDescriptionText;
    }

    return {
        isSectionDisabled,
        description,
        buttonText
    };
}

/**
 * Method to check if we have atleast one common delivery code between product and channel.
 * @param productdeliveryOptions - Product DeliveryOption List.
 * @param storePickUpOptionList - Channel DeliveryOption List.
 * @returns Boolean flag.
 */
const matchDeliveryOptions = (
    productdeliveryOptions: DeliveryOption[] | undefined,
    storePickUpOptionList: string[] | undefined
): boolean => {
    const deliveryOption: string[] = [];
    productdeliveryOptions?.map(delivery => {
        const pickup = storePickUpOptionList?.find(deliveryCode => deliveryCode === delivery.Code);
        if (pickup) {
            deliveryOption.push(pickup);
        }
        return deliveryOption;
    });

    return ArrayExtensions.hasElements(deliveryOption);
};

export function getBuyboxFindInStore(
    props: IBuyboxProps<IBuyboxData>,
    state: IBuyboxState,
    callbacks: IBuyboxCallbacks
): IBuyboxFindInStoreViewProps | undefined {
    const {
        data,
        slots: { storeSelector },
        resources: {
            priceFree,
            originalPriceText,
            currentPriceText,
            findInStoreHeaderText,
            buyBoxGoToCartText,
            buyBoxContinueShoppingText,
            closeNotificationLabel,
            buyBoxSingleItemText,
            buyBoxMultiLineItemFormatText,
            buyBoxHeaderMessageText,
            descriptionTextToShowAllPickupOptions
        },
        context: {
            request: { channel: { PickupDeliveryModeCode } = { PickupDeliveryModeCode: undefined } }
        }
    } = props;

    const multiplePickupStoreSwitchName = 'Dynamics.AX.Application.RetailMultiplePickupDeliveryModeFeature';
    const product = data?.product?.result;
    const price = data?.productPrice?.result;
    const cart = data?.cart?.result;
    const deliveryOptions = data?.deliveryOptions?.result;
    const productAvailability = data.productAvailableQuantity?.result;
    const retailMulitplePickupMFeatureState = data?.featureState?.result?.find(
        (featureState: FeatureState) => featureState.Name === multiplePickupStoreSwitchName
    )?.IsEnabled;
    const channelDeliveryOptionConfig = data?.channelDeliveryOptionConfig?.result;

    const missingDimensions = product?.Dimensions?.filter(dimension => !dimension.DimensionValue?.Value);

    const {
        errorState: { configureErrors, quantityError, otherError, errorHost },
        modalOpen,
        quantity
    } = state;

    const { isSectionDisabled, buttonText, description } = getFindInStoreInventorySettings(
        props.context,
        props.context.app.config.enableStockCheck,
        productAvailability,
        props.resources,
        props.data.productAvailableQuantity.status === 'LOADING' || ArrayExtensions.hasElements(missingDimensions)
    );

    if (!product || !ArrayExtensions.hasElements(storeSelector)) {
        return undefined;
    }

    if (!deliveryOptions || !deliveryOptions.DeliveryOptions) {
        return undefined;
    }

    // If no delivery options present on the product, or none of the delivery options
    // match the PickupDeliveryModeCode, that means the item cannot be used for BOPIS
    if (retailMulitplePickupMFeatureState && channelDeliveryOptionConfig) {
        if (!matchDeliveryOptions(deliveryOptions.DeliveryOptions, channelDeliveryOptionConfig?.PickupDeliveryModeCodes)) {
            return undefined;
        }
    } else if (
        !PickupDeliveryModeCode ||
        !deliveryOptions.DeliveryOptions.find((option: DeliveryOption) => option.Code === PickupDeliveryModeCode)
    ) {
        return undefined;
    }

    const dialogStrings = {
        goToCartText: buyBoxGoToCartText,
        continueShoppingText: buyBoxContinueShoppingText,
        closeNotificationLabel,
        headerItemOneText: buyBoxSingleItemText,
        headerItemFormatText: buyBoxMultiLineItemFormatText,
        headerMessageText: buyBoxHeaderMessageText,
        freePriceText: priceFree,
        originalPriceText,
        currentPriceText
    };

    const priceComponent = price ? (
        <PriceComponent
            data={{ price }}
            context={props.context}
            id={props.id}
            typeName={props.typeName}
            freePriceText={dialogStrings.freePriceText}
            originalPriceText={dialogStrings.originalPriceText}
            currentPriceText={dialogStrings.currentPriceText}
        />
    ) : (
        ''
    );

    const defaultImageSettings: IImageSettings = {
        viewports: {
            xs: { q: 'w=240&h=240&m=6', w: 0, h: 0 },
            lg: { q: 'w=240&h=240&m=6', w: 0, h: 0 },
            xl: { q: 'w=240&h=240&m=6', w: 0, h: 0 }
        },
        lazyload: true
    };

    const popupProps: IPopupProps = {
        context: props.context,
        className: 'ms-buybox',
        id: props.id,
        typeName: props.typeName,
        data: { product: props.data.product?.result, price: props.data.productPrice?.result },
        dialogStrings,
        imageSettings: defaultImageSettings,
        gridSettings: props.context.request.gridSettings,
        productQuantity: quantity,
        priceComponent,
        navigationUrl: getUrlSync('cart', props.context.actionContext),
        modalOpen,
        setModalOpen: callbacks.changeModalOpen
    };
    const renderModalPopup = <Popup {...popupProps} />;

    return {
        ContainerProps: {
            className: 'ms-buybox__find-in-store'
        },

        storeSelector: storeSelector[0],

        openFindInStoreDialog: onClickFindInStoreHandler(props, state, callbacks),

        heading: <Heading className='ms-buybox__find-in-store-heading' headingTag='h4' text={findInStoreHeaderText} />,

        description: <p className='ms-buybox__find-in-store-description'>{description}</p>,
        productPickupOptionList:
            retailMulitplePickupMFeatureState && !isSectionDisabled ? (
                <>
                    <p className='ms-buybox__find-in-store-description'>{descriptionTextToShowAllPickupOptions}</p>
                    <ul className='ms-buybox__find-in-store-pickup' aria-label={descriptionTextToShowAllPickupOptions}>
                        {deliveryOptions.DeliveryOptions.map((item: DeliveryOption) => {
                            return (
                                <li className='ms-buybox__find-in-store-pickup-option' aria-label={item.Description} key={item.Code}>
                                    {item.Description}
                                </li>
                            );
                        })}
                    </ul>
                </>
            ) : null,
        errors: (
            <BuyboxErrorBlock
                configureErrors={configureErrors}
                quantityError={quantityError}
                otherError={otherError}
                resources={props.resources}
                showError={errorHost === 'FINDINSTORE'}
            />
        ),

        button: (
            <button
                className='ms-buybox__find-in-store-button'
                onClick={onClickFindInStoreHandler(props, state, callbacks)}
                color='secondary'
                ref={modalCloseButtonReference}
                aria-label={buttonText}
                disabled={cart === undefined || isSectionDisabled}
                title={buttonText}
            >
                {buttonText}
            </button>
        ),

        modal: renderModalPopup
    };
}

/**
 * Handler for find in store button.
 * @param props - BuyBox data.
 * @param state - BuyBox state.
 * @param callbacks - BuyBox callbacks.
 * @returns - Promise.
 */
async function findInStoreOnClick(props: IBuyboxProps<IBuyboxData>, state: IBuyboxState, callbacks: IBuyboxCallbacks): Promise<void> {
    const {
        data: {
            storeSelectorStateManager: { result: storeSelectorStateManager },
            cart: { result: cart },
            productAvailableQuantity: { result: productAvailableQuantity }
        },
        resources,
        context,
        modules
    } = props;

    const { selectedProduct, quantity } = state;

    let dataProduct = props.data.product.result;
    const multiplePickupStoreSwitchName = 'Dynamics.AX.Application.RetailMultiplePickupDeliveryModeFeature';
    const retailMulitplePickupMFeatureState = props.data?.featureState?.result?.find(
        (featureState: FeatureState) => featureState.Name === multiplePickupStoreSwitchName
    )?.IsEnabled;

    if (selectedProduct) {
        dataProduct = (await selectedProduct) || dataProduct;
    }

    if (!dataProduct || !storeSelectorStateManager) {
        return;
    }

    const product = dataProduct;

    const missingDimensions =
        product.Dimensions &&
        product.Dimensions.filter((dimension: ProductDimension) => !(dimension.DimensionValue && dimension.DimensionValue.Value));

    let storeSelectorId: string = '';
    if (modules && Object.keys(modules).length > 0 && modules.storeSelector && modules.storeSelector.length > 0) {
        storeSelectorId = modules.storeSelector[0].id;
    }

    if (missingDimensions && missingDimensions.length > 0) {
        if (callbacks.updateErrorState) {
            callbacks.updateErrorState({
                errorHost: 'FINDINSTORE',
                configureErrors: getConfigureErrors(missingDimensions, resources)
            });
        }
    } else {
        storeSelectorStateManager
            .openDialog({
                product,
                id: storeSelectorId,
                parentElementRef: modalCloseButtonReference,
                deliveryOptions: retailMulitplePickupMFeatureState ? props.data.deliveryOptions.result : undefined,
                onLocationSelected: async (orgUnitLocation: OrgUnitLocation, deliveryMode: string) => {
                    if (!cart) {
                        return Promise.resolve();
                    }

                    const behavior = props.context?.app?.config?.addToCartBehavior;

                    return cart
                        .addProductToCart({ product, count: quantity, location: orgUnitLocation, deliveryMode })
                        .then((result: ICartActionResult) => {
                            if (result.status === 'FAILED' && result.substatus === 'MAXQUANTITY') {
                                callbacks.changeModalOpen(false);
                                let productAvailability: ProductAvailableQuantity | undefined;
                                if (state.productAvailableQuantity) {
                                    productAvailability = state.productAvailableQuantity.ProductAvailableQuantity;
                                } else if (productAvailableQuantity && ArrayExtensions.hasElements(productAvailableQuantity)) {
                                    const shippingInventory = productAvailableQuantity.find(
                                        shipping => shipping.deliveryType === DeliveryMode.pickup
                                    );
                                    productAvailability = shippingInventory?.ProductAvailableQuantity;
                                } else {
                                    productAvailability = undefined;
                                }
                                const failureResult: IAddToCartFailureResult = {
                                    failureReason: 'CARTACTIONFAILED',
                                    cartActionResult: { status: result.status, substatus: result.substatus }
                                };
                                callbacks.updateErrorState({
                                    errorHost: 'ADDTOCART',
                                    configureErrors: {},
                                    otherError: getGenericError(
                                        failureResult,
                                        cart,
                                        resources,
                                        context,
                                        product,
                                        productAvailability,
                                        orgUnitLocation
                                    )
                                });
                            } else {
                                callbacks.updateErrorState({
                                    configureErrors: {}
                                });
                                const navigationUrl = getUrlSync('cart', context.actionContext);
                                if (behavior === undefined || behavior === AddToCartBehavior.goToCart) {
                                    if (result.status === 'SUCCESS' && navigationUrl) {
                                        window.location.assign(navigationUrl);
                                    }
                                } else if (behavior === AddToCartBehavior.showModal) {
                                    callbacks.changeModalOpen(true);
                                } else if (behavior === AddToCartBehavior.showNotification) {
                                    const defaultImageSettings: IImageSettings = {
                                        viewports: {
                                            xs: { q: 'w=240&h=240&m=6', w: 0, h: 0 },
                                            lg: { q: 'w=240&h=240&m=6', w: 0, h: 0 },
                                            xl: { q: 'w=240&h=240&m=6', w: 0, h: 0 }
                                        },
                                        lazyload: true
                                    };
                                    const telemetryContent = getTelemetryObject(
                                        props.context.request.telemetryPageName!,
                                        props.friendlyName,
                                        props.telemetry
                                    );
                                    const dialogStrings: IAddToCartResources = {
                                        goToCartText: resources.buyBoxGoToCartText,
                                        continueShoppingText: resources.buyBoxContinueShoppingText,
                                        closeNotificationLabel: resources.closeNotificationLabel,
                                        headerItemOneText: resources.buyBoxSingleItemText,
                                        headerItemFormatText: resources.buyBoxMultiLineItemFormatText,
                                        headerMessageText: resources.buyBoxHeaderMessageText,
                                        freePriceText: resources.priceFree,
                                        originalPriceText: resources.originalPriceText,
                                        currentPriceText: resources.currentPriceText,
                                        addedQuantityText: resources.addedQuantityText
                                    };
                                    const notification = new ItemSuccessfullyAddedToCartNotification(
                                        props.context,
                                        dialogStrings,
                                        defaultImageSettings,
                                        props.context.request.gridSettings,
                                        product,
                                        props.data.productPrice?.result,
                                        quantity,
                                        navigationUrl,
                                        telemetryContent,
                                        props.id,
                                        props.typeName
                                    );
                                    NotificationsManager.instance().addNotification(notification);
                                }
                            }
                        })
                        .catch((error: Error) => {
                            if (props.telemetry) {
                                props.telemetry.exception(error);
                                props.telemetry.debug('Unable to add product to cart');
                            }
                        });
                }
            })
            .catch((error: Error) => {
                if (props.telemetry) {
                    props.telemetry.error(error.message);
                    props.telemetry.debug('Unable to find in store');
                }
            });
    }
}
