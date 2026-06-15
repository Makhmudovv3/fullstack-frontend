import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { auth, googleProvider } from "../../Firebase";
import { signInWithPopup } from 'firebase/auth';
import { loginUser, googleLoginUser } from '../../redux/shopSlice';
import sideImg from "../../assets/side-img.png";
import googleIcon from "../../assets/google-icon.png";
import "../SignUp/SignUp.css";

const Login = () => {
    const { t, i18n } = useTranslation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.shop);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const resultAction = await dispatch(loginUser({ email, password }));
            if (loginUser.fulfilled.match(resultAction)) {
                toast.success(t('auth.success'));
            } else {
                toast.error(resultAction.payload || 'Email yoki parol xato!');
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            const resultAction = await dispatch(googleLoginUser({
                name: user.displayName,
                email: user.email,
                googleId: user.uid
            }));

            if (googleLoginUser.fulfilled.match(resultAction)) {
                toast.success(t('auth.googleSuccess'));
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
                    <h2 className="signup-title">{t('footer.loginRegister').split('/')[0]}</h2>
                    <p className="signup-subtitle">{t('auth.signUpSubtitle')}</p>

                    <form onSubmit={handleLogin} className="signup-form">
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <button type="submit" className="signup-submit-btn" style={{ flex: '1', marginRight: '10px' }}>
                                {t('footer.loginRegister').split('/')[0]}
                            </button>
                            <Link to="#" style={{ color: '#db4444', textDecoration: 'none' }}>Forget Password?</Link>
                        </div>
                    </form>

                    <button className="signup-google-btn" onClick={handleGoogleLogin} type="button" style={{ marginTop: '20px' }}>
                        <img src={googleIcon} alt="Google" width="24" />
                        {t('auth.googleBtn')}
                    </button>

                    <div className="signup-footer">
                        <span className="signup-footer-text">{t('auth.noAccount') || "Don't have an account?"}</span>
                        <Link to="/signup" className="signup-login-link">
                            {t('auth.signUpLink') || 'Sign Up'}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
