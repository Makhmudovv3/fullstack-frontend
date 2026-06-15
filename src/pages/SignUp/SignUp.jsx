import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { auth, googleProvider } from "../../Firebase";
import { signInWithPopup } from 'firebase/auth';
import { registerUser, googleLoginUser } from '../../redux/shopSlice';
import sideImg from "../../assets/side-img.png";
import googleIcon from "../../assets/google-icon.png";
import "./SignUp.css";

const SignUp = () => {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector(state => state.shop);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(registerUser({ name, email, password }));
            if (registerUser.fulfilled.match(resultAction)) {
                toast.success(t('auth.success') || 'Account created successfully!');
            } else {
                toast.error(resultAction.payload || 'Failed to create account');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Send info to backend
            const resultAction = await dispatch(googleLoginUser({
                name: user.displayName,
                email: user.email,
                googleId: user.uid
            }));

            if (googleLoginUser.fulfilled.match(resultAction)) {
                toast.success(t('auth.googleSuccess') || 'Google login successful');
            } else {
                toast.error(resultAction.payload || 'Failed to sync with backend');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="signup-wrapper">
            <div className="signup-banner">
                <img src={sideImg} alt="Banner" />
            </div>
            <div className="signup-content">
                <div className="signup-form-box">
                    <h2 className="signup-title">{t('auth.signUpTitle')}</h2>
                    <p className="signup-subtitle">{t('auth.signUpSubtitle')}</p>

                    <form onSubmit={handleSignUp} className="signup-form">
                        <input
                            className="signup-input"
                            type="text"
                            placeholder={t('auth.namePlaceholder')}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            className="signup-input"
                            type="email"
                            placeholder={t('auth.emailPlaceholder')}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            className="signup-input"
                            type="password"
                            placeholder={t('auth.passwordPlaceholder')}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <button type="submit" className="signup-submit-btn">
                            {t('auth.createBtn')}
                        </button>
                    </form>

                    <button className="signup-google-btn" onClick={handleGoogleSignUp} type="button">
                        <img src={googleIcon} alt="Google" width="24" />
                        {t('auth.googleBtn')}
                    </button>

                    <div className="signup-footer">
                        <span className="signup-footer-text">{t('auth.alreadyHave')}</span>
                        <Link to="/login" className="signup-login-link">
                            {t('auth.loginLink')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;