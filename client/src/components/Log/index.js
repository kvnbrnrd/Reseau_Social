import React, {useState} from 'react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

const Log = (props) => {

    const [signUpModal, setSignUpModal] = useState(props.signup);
    const [signInModal, setSignInModal] = useState(props.signin);

    const handleModals = (e) => {
        if (e.target.id === "register") {
            setSignInModal(false);
            setSignUpModal(true);
        } else if (e.target.id === "login") {
            setSignUpModal(false);
            setSignInModal(true);
        }
    }

    return (
        <div>
            <div className="connection-form">
                <div className="form-container">
                    <ul>
                        <li className={signUpModal ? "active-btn" : null} onClick={handleModals} id="register">S'inscrire</li>
                        <li className={signInModal ? "active-btn" : null} onClick={handleModals} id="login">Se connecter</li>
                    </ul>
                    {signUpModal && <SignUpForm />}
                    {signInModal && <SignInForm />}
                </div>
            </div>
        </div>
    );
};

export default Log;