import React, { useState } from 'react';

function Sign() {

    const [activeButton, setActiveButton] = useState(null);

    const handleButtonClick = (buttonId) => {
        setActiveButton(buttonId);
    };

    return (
        <div className="sign">
            <header>
                    <div class="content">
                        <h2><span id="Pic">Pic</span><span id="Hub">Hub</span></h2><br />
                    </div>
            </header>
            <main>
                <div className="signButton">
                    <button id="button1" className={activeButton === 'button1' ? 'active' : ''}
                        onClick={() => handleButtonClick('button1')}>Sign in</button>
                    <button id="button2" className={activeButton === 'button2' ? 'active' : ''}
                        onClick={() => handleButtonClick('button2')}>Register</button>
                </div>
                {activeButton === 'button1' && (
                    <form className="signInForm">
                        <label id="labelEmail" for="signInEmail">Email</label>
                        <input type="text" id="signInEmail" /><br />
                        <label id="labelPassword" for="signInPassword">Password</label>
                        <input type="password" id="signInPassword" />
                        <input type="submit" value="Sign In" id="singInButton" />
                    </form>
                )}
                {activeButton === 'button2' && (
                    <form className="registerForm">
                        <label id="firstName" for="registerFirstName">First name</label>
                        <input type="text" id="registerFirstName" /><br />
                        <label id="lastName" for="registerLastName">Last name</label>
                        <input type="text" id="registerLastName" /><br />
                        <label id="labelEmail2" for="registerEmail">Email</label>
                        <input type="text" id="registerEmail" /><br />
                        <label id="labelConfirmEmail" for="registerConfirmEmail">Confirm email</label>
                        <input type="text" id="registerConfirmEmail" /><br />
                        <label id="labelPassword2" for="registerPassword">Password</label>
                        <input type="password" id="registerPassword" />
                        <label id="labelConfirmPassword" for="registerConfirmPassword">Confirm password</label>
                        <input type="password" id="registerConfirmPassword" />
                        <input type="submit" value="Sign up" id="registerButton" />
                    </form>
                )}
            </main>
        </div>
    );

}

export default Sign;