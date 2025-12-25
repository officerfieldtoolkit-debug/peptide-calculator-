import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import QRCode from 'qrcode';

export const useTwoFactor = () => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [isEnrolling, setIsEnrolling] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [secret, setSecret] = useState('');
    const [factorId, setFactorId] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check status on mount
    useEffect(() => {
        checkStatus();
    }, []);

    const checkStatus = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase.auth.mfa.listFactors();
            if (error) throw error;

            const totpFactor = data.all.find(f => f.factor_type === 'totp' && f.status === 'verified');

            if (totpFactor) {
                setIsEnabled(true);
                setFactorId(totpFactor.id);
            } else {
                setIsEnabled(false);
                setFactorId(null);
            }
        } catch (err) {
            console.error('Error checking 2FA status:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const startEnrollment = async () => {
        try {
            setError(null);
            const { data, error } = await supabase.auth.mfa.enroll({
                factorType: 'totp'
            });

            if (error) throw error;

            setFactorId(data.id);
            setSecret(data.totp.secret);

            // Generate QR code
            const url = await QRCode.toDataURL(data.totp.uri);
            setQrCodeUrl(url);
            setIsEnrolling(true);
        } catch (err) {
            console.error('Error starting enrollment:', err);
            setError(err.message);
        }
    };

    const verifyAndEnable = async (code) => {
        try {
            setError(null);
            const challenge = await supabase.auth.mfa.challenge({ factorId });
            if (challenge.error) throw challenge.error;

            const verify = await supabase.auth.mfa.verify({
                factorId,
                challengeId: challenge.data.id,
                code
            });

            if (verify.error) throw verify.error;

            setIsEnabled(true);
            setIsEnrolling(false);
            setQrCodeUrl('');
            setSecret('');
            return true;
        } catch (err) {
            console.error('Error verifying code:', err);
            setError(err.message);
            return false;
        }
    };

    const disableTwoFactor = async () => {
        try {
            setError(null);
            if (!factorId) {
                // Try to find it again if missing
                const { data } = await supabase.auth.mfa.listFactors();
                const factor = data.all.find(f => f.factor_type === 'totp');
                if (!factor) throw new Error("No active 2FA found");

                // If we found it, use this id
                const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.mfa.unenroll({ factorId });
                if (error) throw error;
            }

            setIsEnabled(false);
            setFactorId(null);
            return true;
        } catch (err) {
            console.error('Error disabling 2FA:', err);
            setError(err.message);
            return false;
        }
    };

    const cancelEnrollment = async () => {
        if (factorId && isEnrolling) {
            await supabase.auth.mfa.unenroll({ factorId });
        }
        setIsEnrolling(false);
        setQrCodeUrl('');
        setSecret('');
        setFactorId(null);
    };

    return {
        isEnabled,
        isEnrolling,
        isLoading,
        qrCodeUrl,
        secret,
        error,
        startEnrollment,
        verifyAndEnable,
        disableTwoFactor,
        cancelEnrollment
    };
};
