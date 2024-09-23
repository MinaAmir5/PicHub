import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const baseUrl = "http://ec2-13-60-85-197.eu-north-1.compute.amazonaws.com:3000";

function Sign() {

    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState(null);

    const handleButtonClick = (buttonId) => {
        setActiveButton(buttonId);
    };

    const [inputs, setInputs] = useState({
        username: "",
        password: "",
        email: "",
        repeatPassword: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputs.password === inputs.repeatPassword) {
            const data = await axios.post(`${baseUrl}/sign`, {
                username: inputs.username,
                email: inputs.email,
                password: inputs.password,
            });

            const success = data.data.success;
            console.log("DATA: ", data.data.success);

            success ? navigate("/", { replace: true }) : alert("Try again");
        } else {
            alert("password does not match");
            setInputs({
                username: inputs.username,
                email: inputs.email,
                password: "",
                rePassword: "",
            });
        }
    }

    const handleInputChange = (event) => {
        event.persist();
        const { name, value } = event.target;

        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value,
        }));
    };

    return (
        <div className="sign">
            <header>
                <div class="content">
                        <img src="/logo.png" id="logo" />
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
                    <form onSubmit={handleSubmit} className="registerForm">
                        <label id="firstName" for="registerFirstName">First name :</label>
                        <input id="registerFirstName" type="text" name="username" onChange={handleInputChange} value={inputs.username} required /><br />
                        <label id="lastName" for="registerLastName">Last name :</label>
                        <input type="text" id="registerLastName" /><br />
                        <label id="labelEmail2" for="registerEmail">Email :</label>
                        <input id="registerEmail" type="email" name="email" onChange={handleInputChange} value={inputs.email} required /><br />
                        <label id="labelConfirmEmail" for="registerConfirmEmail">Confirm email :</label>
                        <input type="text" id="registerConfirmEmail" /><br />
                        <label id="labelPassword2" for="registerPassword">Password :</label>
                        <input id="registerPassword" type="password" name="password" onChange={handleInputChange} value={inputs.password} required />
                        <label id="labelConfirmPassword" for="registerConfirmPassword">Confirm password :</label>
                        <input id="registerConfirmPassword" type="password" name="repeatPassword" onChange={handleInputChange} value={inputs.repeatPassword} required />
                        <input type="submit" value="Sign up" id="registerButton" />
                    </form>
                )}
            </main>
        </div>
    );

}

export default Sign;