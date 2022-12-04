import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import { FormattedMessage } from 'react-intl';
import './Register.scss';
import { toast } from 'react-toastify';
import { handleRegister } from '../../services/userServices';
import { Redirect } from "react-router-dom";

class Register extends Component {

    OK = 'OK'

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confirmPass: '',
            showPass: false,
            showConfirm: false,
            register: false
        }
    }

    handleChangeState = (event, id) => {
        const oldState = { ...this.state };
        oldState[id] = event.target.value;
        this.setState({
            ...oldState
        });
    }

    handleShowPassword = () => {
        this.setState({
            showPass: !this.state.showPass
        })
    }

    handleShowConfirmPassword = () => {
        this.setState({
            showConfirm: !this.state.showConfirm
        })
    }

    checkValidate = () => {
        const input = ["username", "email", "password", "confirmPass"];
        for (let i = 0; i < input.length; i++) {
            if (!this.state[input[i]]) {
                toast.error(input[i] + " can't not be empty!");
                return false;
            }
        }

        if (this.state.password.length < 6) {
            toast.error("Password must be at least 6 characters!");
            return false;
        }

        if (this.state.password !== this.state.confirmPass) {
            toast.error("Confirm password must be the same as password!");
            return false;
        }

        return true;
    }

    handleRegister = async () => {
        let isValid = this.checkValidate();
        if (isValid) {
            let user = {
                username: this.state.username,
                email: this.state.email,
                password: this.state.password
            }
            try {
                let response = await handleRegister(user);
                if (response) {
                    if (response.message != this.OK) {
                        toast.error(response.message);
                    }
                    else {
                        toast.success(response.message);
                        this.setState({
                            register: true
                        });
                    }
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    toast.error(error.response.data.message);
                }
                else {
                    toast.error("Network error!");
                }
            }
        }
    }




    render() {
        const { register } = this.state;
        if (register) {
            return <Redirect to="/login" />
        }
        return (
            <div className='login-background d-flex justify-content-center align-items-center'>
                <div className='login-container row col-sm-4'>
                    <div className='login-content'>
                        <h3 className="text-center mb-4 heading"><FormattedMessage id="register.register" /></h3>

                        <div className="form-group mb-3">
                            <label className='titleInput' htmlFor="username"><FormattedMessage id="register.username" /></label>
                            <input value={this.state.username} onChange={(event) => this.handleChangeState(event, "username")} type="text" className="input" id="username" placeholder="Username" />
                        </div>
                        <div className="form-group mb-3">
                            <label className='titleInput' htmlFor="InputEmail1"><FormattedMessage id="register.email" /></label>
                            <input value={this.state.email} onChange={(event) => this.handleChangeState(event, "email")} type="email" className="input" id="InputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
                        </div>
                        <div className="form-group mb-3">
                            <label className='titleInput' htmlFor="InputPassword1"><FormattedMessage id="register.password" /></label>
                            <div className="d-flex flex-row password-input">
                                <input value={this.state.password} onChange={(event) => this.handleChangeState(event, "password")} type={this.state.showPass ? "text" : "password"} className="input" id="InputPassword1" placeholder="Password" />
                                <span onClick={() => { this.handleShowPassword() }}>
                                    {
                                        this.state.showPass ?
                                            <i className="far fa-eye icon-eyes"></i>
                                            :
                                            <i className="far fa-eye-slash icon-eyes"></i>
                                    }
                                </span>
                            </div>
                        </div>

                        <div className="form-group mb-3">
                            <label className='titleInput' htmlFor="InputPassword1"><FormattedMessage id="register.confirm-pass" /></label>
                            <div className="d-flex flex-row password-input">
                                <input value={this.state.confirmPass} onChange={(event) => this.handleChangeState(event, "confirmPass")} type={this.state.showConfirm ? "text" : "password"} className="input" id="InputPassword1" placeholder="Confirm Password" />
                                <span onClick={() => { this.handleShowConfirmPassword() }}>
                                    {
                                        this.state.showConfirm ?
                                            <i className="far fa-eye icon-eyes"></i>
                                            :
                                            <i className="far fa-eye-slash icon-eyes"></i>
                                    }
                                </span>
                            </div>
                        </div>
                        <div className=" row justify-content-center my-3 px-3">
                            <button onClick={() => this.handleRegister()} type="submit" className="btn-block btn-color"><FormattedMessage id="register.submit" /></button>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        navigate: (path) => dispatch(push(path)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
