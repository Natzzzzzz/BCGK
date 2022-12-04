import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from "../../store/actions";
import './Header.scss';
import { LANGUAGES } from '../../utils/constant';
import { FormattedMessage } from 'react-intl';

class Header extends Component {

    changeLanguage = (language) => {
        this.props.changeLanguage(language);
    }

    render() {
        const { processLogout, language } = this.props;
        return (
            <nav className="menu" >
                <ol>
                    <li className="menu-item"><a href="#0"><FormattedMessage id="menu.hello" /></a></li>
                    <li className="menu-item">
                        <span onClick={() => this.changeLanguage(LANGUAGES.VI)} style={{ cursor: "pointer" }}>
                            <FormattedMessage id="menu.vietnamese" />
                        </span>
                    </li>
                    <li className="menu-item">
                        <span onClick={() => this.changeLanguage(LANGUAGES.EN)} style={{ cursor: "pointer" }}>
                            <FormattedMessage id="menu.english" />
                        </span>
                    </li>
                    <li className="menu-item" onClick={processLogout}>
                        <a href="#0">
                            <div className="btn btn-logout">
                                <i className="fas fa-sign-out-alt"></i>
                            </div>
                            <FormattedMessage id="menu.logout" />
                        </a>
                    </li>
                </ol>
            </nav>
        );
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguage: (language) => dispatch(actions.changeLanguage(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
