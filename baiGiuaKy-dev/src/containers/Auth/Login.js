import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";

import * as actions from "../../store/actions";
import { FormattedMessage } from 'react-intl';
import './Login.scss';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { handleLoginApi } from "../../services/userServices"



class Login extends Component {

    OK = 'OK'

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            show: false
        }
    }

    handleEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    handlePassword = (event) => {
        this.setState({
            password: event.target.value
        })
    }

    handleLogin = async () => {
        try {
            let response = await handleLoginApi(this.state.email, this.state.password);
            if (response) {
                if (response.message != this.OK) {
                    toast.error(response.message);
                }
                else {
                    this.props.userLoginSuccess(response.data);
                    toast.success(response.message);
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

    handleShowPassword = () => {
        this.setState({
            show: !this.state.show
        })
    }

    render() {
        return (
            <div className='login-background d-flex justify-content-center align-items-center'>
                <div className='login-container row col-sm-4'>
                    <div className='login-content'>
                        <h3 className="text-center mb-4 heading"><FormattedMessage id="login.login" /></h3>

                        <div className="form-group mb-3">
                            <label className='titleInput' htmlFor="InputEmail1"><FormattedMessage id="login.email" /></label>
                            <input value={this.state.email} onChange={(event) => this.handleEmail(event)} type="email" className="input" id="InputEmail1" aria-describedby="emailHelp" placeholder="Email" />
                        </div>
                        <div className="form-group mb-3">
                            <label className='titleInput' htmlFor="InputPassword1"><FormattedMessage id="login.password" /></label>
                            <div className="d-flex flex-row password-input">
                                <input value={this.state.password} onChange={(event) => this.handlePassword(event)} type={this.state.show ? "text" : "password"} className="input" id="InputPassword1" placeholder="Password" />
                                <span onClick={() => { this.handleShowPassword() }}>
                                    {
                                        this.state.show ?
                                            <i className="far fa-eye icon-eyes"></i>
                                            :
                                            <i className="far fa-eye-slash icon-eyes"></i>
                                    }
                                </span>
                            </div>
                        </div>
                        <div className=" row justify-content-center my-3 px-3">
                            <button onClick={() => this.handleLogin()} className="btn-block btn-color"><FormattedMessage id="login.submit" /></button>
                        </div>
                        <div className="d-flex justify-content-end">
                            <a className="forgot-pass" href="#"><small>Quên mật khẩu?</small></a>
                        </div>

                        <div className="d-flex flex-row  justify-content-center mt-3">
                            <p style={{ paddingTop: '12px' }}><FormattedMessage id="login.account" /></p>
                            <Link className='register' to="/register"><FormattedMessage id="login.join" /></Link>
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
        userLoginFail: () => dispatch(actions.userLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
