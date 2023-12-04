import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword(props) {
    const host = process.env.REACT_APP_API_URL;
    let history = useNavigate();
    const [credentials, setCredentials] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [otpGenerated, setOtpGenerated] = useState(false);
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [alert, setAlert] = useState({ type: null, message: '' });
    const [isGeneratingOTP, setIsGeneratingOTP] = useState(false);

    const handleOTPGeneration = async (e) => {
        e.preventDefault();

        if (otpGenerated) {
            return;
        }

        setIsGeneratingOTP(true);
        const response = await fetch(`${host}/api/auth/sendotp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email }),
        });

        const json = await response.json();

        if (json.success) {
            setOtpGenerated(true);
            setAlert({
                type: 'success',
                message: 'OTP has been sent to your email. Please check your inbox.',
            });
        } else {
            // Handle the case where the email is not linked to any account
            setAlert({
                type: 'danger',
                message: 'Email address is not linked to any account. Please check your email or sign up for a new account.',
            });
        }

        setIsGeneratingOTP(false);
    };


    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleOTP = async (e) => {
        e.preventDefault();

        const response = await fetch(`${host}/api/auth/verifyotp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: credentials.email, otp: credentials.otp }),
        });

        const json = await response.json();

        if (json.success) {
            setShowPasswordFields(true);
            setAlert({
                type: 'success',
                message: 'OTP Verified successfully, please enter a new password',
            });
        }
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (credentials.newPassword !== credentials.confirmPassword) {
            setAlert({ type: 'danger', message: "Passwords don't match" });
            return;
        }

        const response = await fetch(`${host}/api/auth/resetpassword`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                otp: credentials.otp,
                newPassword: credentials.newPassword,
            }),
        });

        const json = await response.json();

        if (json.success) {
            setOtpGenerated(false);
            setShowPasswordFields(false);
            setAlert({ type: 'success', message: 'Password Successfully Reset!' });
            history("/login");
        }
    };

    return (
        <div className="container my-5">
            {alert.type && (
                <div className={`alert alert-${alert.type}`} role="alert">
                    {alert.message}
                </div>
            )}

            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleOTPGeneration}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email address
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                name="email"
                                onChange={onChange}
                                placeholder="Enter Registered Email Address"
                                id="email"
                                value={credentials.email}
                                aria-describedby="emailHelp"
                                required
                            />
                        </div>
                        {!otpGenerated && !showPasswordFields && (
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={isGeneratingOTP}
                            >
                                {isGeneratingOTP ? 'Generating OTP...' : 'Generate OTP'}
                            </button>
                        )}
                    </form>

                    {otpGenerated && !showPasswordFields && (
                        <>
                            <div className="my-4">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="otp"
                                    onChange={onChange}
                                    placeholder="Enter OTP"
                                    id="otp"
                                    value={credentials.otp}

                                    required
                                />
                            </div>
                            <button onClick={handleOTP} className="btn btn-success">
                                Submit OTP
                            </button>
                        </>
                    )}

                    {showPasswordFields && (
                        <form onSubmit={handlePasswordReset}>
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="newPassword"
                                    onChange={onChange}
                                    placeholder="Enter New Password"
                                    id="newPassword"
                                    autoComplete="new-password"
                                    minLength={8}
                                    value={credentials.newPassword}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="confirmPassword"
                                    onChange={onChange}
                                    placeholder="Confirm New Password"
                                    id="confirmPassword"
                                    autoComplete="confirm-password"
                                    minLength={8}
                                    value={credentials.confirmPassword}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success">
                                Reset Password
                            </button>
                        </form>
                    )}

                    <div className="mt-3">
                        <button
                            className="btn btn-primary"
                            onClick={() => history('/login')}
                        >
                            Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
