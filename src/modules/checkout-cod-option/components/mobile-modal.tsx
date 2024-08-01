import React, { useState, useEffect } from 'react';
import { INodeProps, Node, Modal, Button } from '@msdyn365-commerce-modules/utilities';
import { IImageData, Image } from '@msdyn365-commerce/core';
import { ICheckoutGiftCardViewProps } from '../checkout-cod-option';
// import { PhoneRegex } from '@msdyn365-commerce-modules/retail-actions';
import { isEmpty } from '@msdyn365-commerce/retail-proxy';
import { CustomPaymentMethod } from '../../../shared/PaymentMethodEnum';

interface MobileModalProps {
    isOpen: boolean;
    resources: {
        mobileNumberHeadingLabel: string;
        mobileNumberHeadingDescription: string;
        mobileNumberInputLabel: string;
        mobileNumberCodeMessage: string;
        mobileNumberGetOTPText: string;
        otpVerificationHeadingLabel: string;
        otpVerificationChangePhoneLabel: string;
        otpVerificationValidationMessage: string;
        otpVerificationConfirmOtpLabel: string;
        otpVerificationResendLabel: string;
        otpVerificationSuccessMessage: string;
        otpResendButton: string;
        enterValidMobileNumber: string;
        minMobileNumberLimit: string;
    };
    props: ICheckoutGiftCardViewProps;
    codMobileNumber: string | undefined;
}

const MobileModal: React.FC<MobileModalProps> = ({ isOpen, resources, props, codMobileNumber }) => {
    const countryCode = '+971';
    const [currentStep, setCurrentStep] = useState<'enterMobile' | 'verifyOtp'>('enterMobile');
    const [mobileNumber, setMobileNumber] = useState<string>(codMobileNumber || '');
    const [mobileNumberOTP, setMobileNumberOTP] = useState('');
    const [otpFromResponse, setOtpFromResponse] = useState('');
    const [otpErrorMessage, setOtpErrorMessage] = useState('');
    const [otpSuccessMessage, setOtpSuccessMessage] = useState('');
    const [mobileNumberErrorMessage, setMobileNumberErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    // const mobileNumberPattern = new RegExp(PhoneRegex.defaultRegex);
    const mobileNumberPattern = /^[1-9]\d{8}$/;

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (resendTimer > 0) {
            timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        } else {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [resendTimer]);

    useEffect(() => {
        if (mobileNumber.startsWith(countryCode)) {
            setMobileNumber(mobileNumber.replace(countryCode, ''));
        }
    }, [mobileNumber]);

    const handleMobileNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setMobileNumber(value);

        if (!mobileNumberPattern.test(value)) {
            setMobileNumberErrorMessage(resources.enterValidMobileNumber);
        } else {
            setMobileNumberErrorMessage('');
        }
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d{0,4}$/.test(value)) {
            setMobileNumberOTP(value);
        }
    };

    const sendOtp = async () => {
        if (!mobileNumberPattern.test(mobileNumber) || mobileNumber.length !== 9) {
            setMobileNumberErrorMessage(resources.enterValidMobileNumber);
            return;
        }

        setLoading(true);
        const cRetailURL = props.context.request.apiSettings.baseUrl;
        const cRetailOUN = props.context.request.apiSettings.oun ? props.context.request.apiSettings.oun : '';

        const cKORSendOTP = `${cRetailURL}commerce/KORSendOTP?api-version=7.3`;
        const fullMobileNumber = `${countryCode}${mobileNumber}`;
        try {
            // Replace this with your actual API call
            const response = await fetch(cKORSendOTP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    OUN: cRetailOUN,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64; rv:58.0) Gecko/20100101 Firefox/58.0'
                },
                body: JSON.stringify({ MobileNumer: fullMobileNumber })
            });

            const result = await response.json();

            if (response.ok && result.value) {
                const otpNumbers = result.value.match(/\d+/g)?.join('') || '';
                setCurrentStep('verifyOtp');
                setOtpFromResponse(otpNumbers);
                setMobileNumberErrorMessage('');
                setResendTimer(30);
                setCanResend(false);
            } else {
                // Handle error in sending OTP
                setMobileNumberErrorMessage('Failed to send OTP. Please try again.');
            }
        } catch (error) {
            setMobileNumberErrorMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMobileNumberSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        sendOtp();
    };

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Implement your OTP verification logic
        const isOtpValid = mobileNumberOTP === otpFromResponse;
        setLoading(false);

        if (isOtpValid) {
            setOtpSuccessMessage(resources.otpVerificationSuccessMessage);
            setOtpErrorMessage('');
            // Handle successful OTP verification
            setTimeout(() => {
                props.setOTPVerified(isOtpValid);
                props.closeModal();
                props.handleCODButtonCheck(true);
                props.setCodSelected();
                props.handleCODSelectedOption(CustomPaymentMethod.COD);
            }, 3000);
        } else {
            setOtpErrorMessage(resources.otpVerificationValidationMessage);
            setOtpSuccessMessage('');
        }
    };

    const _notifyMeModalContainer = (): INodeProps => {
        return {
            tag: Modal,
            placement: 'center',
            hideArrow: true,
            className: 'ms-mobile-number-verify_modal-container',
            wrapClassName: 'ms-mobile-number-verify__modal',
            isOpen,
            toggle: props.closeModal
        };
    };

    const renderMobileNumberOTPImage = (props: ICheckoutGiftCardViewProps): JSX.Element | null => {
        const mobileNumberOTPImage: IImageData | undefined = props.config.mobileNumberOTPImage;
        if (!mobileNumberOTPImage || !mobileNumberOTPImage.src) {
            return null;
        }
        return (
            <Image
                altText={mobileNumberOTPImage.altText}
                className='msc-autoSuggest__productResults-no-results-image-img'
                gridSettings={props.context.request.gridSettings!}
                src={mobileNumberOTPImage.src}
            />
        );
    };

    const renderOTPVerificationImage = (props: ICheckoutGiftCardViewProps): JSX.Element | null => {
        const otpVerificationImage: IImageData | undefined = props.config.otpVerificationImage;
        if (!otpVerificationImage || !otpVerificationImage.src) {
            return null;
        }
        return (
            <Image
                altText={otpVerificationImage.altText}
                className='msc-autoSuggest__productResults-no-results-image-img'
                gridSettings={props.context.request.gridSettings!}
                src={otpVerificationImage.src}
            />
        );
    };

    return (
        <Node {..._notifyMeModalContainer()}>
            <Node className='ms-mobile-number-verify__header msc-modal__header'>
                <Button className='msc-modal__close-button' aria-label='Close' onClick={props.closeModal}></Button>
            </Node>
            <Node className='ms-mobile-number-verify__body msc-modal__body'>
                {loading && <p>Loading...</p>}
                {!loading && currentStep === 'enterMobile' && (
                    <form onSubmit={handleMobileNumberSubmit}>
                        {renderMobileNumberOTPImage(props)}
                        <h2>{resources.mobileNumberHeadingLabel}</h2>
                        <p>{resources.mobileNumberHeadingDescription}</p>
                        <div className='msc-mobile-number-inputContainer'>
                            <label className='msc-mobile-number-inputLabel'>{countryCode}</label>
                            <input
                                type='text'
                                value={mobileNumber}
                                onChange={handleMobileNumberChange}
                                placeholder={resources.mobileNumberInputLabel}
                            />
                        </div>
                        {mobileNumberErrorMessage && <p className='error'>{mobileNumberErrorMessage}</p>}
                        <p className='ms-mobile-number-codeMessage'>{resources.mobileNumberCodeMessage}</p>
                        <Button type='submit' disabled={isEmpty(mobileNumber)}>
                            {resources.mobileNumberGetOTPText}
                        </Button>
                    </form>
                )}
                {!loading && currentStep === 'verifyOtp' && (
                    <form onSubmit={handleOtpSubmit}>
                        {renderOTPVerificationImage(props)}
                        <h2>{resources.otpVerificationHeadingLabel}</h2>
                        <Button className='msc-change_phone-button' onClick={() => setCurrentStep('enterMobile')}>
                            {resources.otpVerificationChangePhoneLabel}
                        </Button>
                        <input type='text' value={mobileNumberOTP} onChange={handleOtpChange} placeholder='Enter OTP' />
                        {otpSuccessMessage && <p className='success'>{otpSuccessMessage}</p>}
                        {otpErrorMessage && <p className='error'>{otpErrorMessage}</p>}
                        {canResend ? (
                            <Button className='msc-otp-resend-btn' onClick={sendOtp}>
                                {resources.otpResendButton}
                            </Button>
                        ) : (
                            <div className='msc-otp-submit-container'>
                                <Button className='msc-otp-submit-btn' type='submit' disabled={isEmpty(mobileNumberOTP)}>
                                    {resources.otpVerificationConfirmOtpLabel}
                                </Button>
                                <p className='msc-otp-resend-label'>
                                    {resources.otpVerificationResendLabel.replace('{0}', resendTimer.toString())}
                                </p>
                            </div>
                        )}
                    </form>
                )}
            </Node>
        </Node>
    );
};

export default MobileModal;
