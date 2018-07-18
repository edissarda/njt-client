import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux'

class Navigacija extends Component {

    renderLoginLink = () => {
        if (this.props.admin == null) {
            return (
                <li className="nav-item">
                    <NavLink to="/login" className="nav-link">Пријава</NavLink>
                </li>
            );
        }

        return (
            <li className="nav-item dropdown">
                <NavLink className="nav-link dropdown-toggle" data-toggle="dropdown" to="#">{this.props.admin.ime} {this.props.admin.prezime}</NavLink>
                <div className="dropdown-menu">
                    <NavLink to="/profil" className="nav-link dropdown-item">Профил</NavLink>
                    <NavLink to="/logout" className="nav-link dropdown-item">Одјава</NavLink>
                </div>
            </li>
        );
    }

    render() {
        return (
            <div className="container">
                <nav className="navbar navbar-expand-sm bg-light">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">Почетна страна</NavLink>
                        </li>

                        <li className="nav-item dropdown">
                            <NavLink className="nav-link dropdown-toggle" data-toggle="dropdown" to="#">Шифарници</NavLink>
                            <div className="dropdown-menu">
                                <NavLink to="/zvanje" className="nav-link dropdown-item">Звања</NavLink>
                                <NavLink to="/tipRukovodioca" className="nav-link dropdown-item">Типови руководиоца</NavLink>
                                <NavLink to="/vrstaOrganizacije" className="nav-link dropdown-item">Врсте организација</NavLink>
                                <NavLink to="/naucnaOblast" className="nav-link dropdown-item">Научне области</NavLink>
                                <NavLink to="/titula" className="nav-link dropdown-item">Титуле</NavLink>
                            </div>
                        </li>

                        <li className="nav-item dropdown">
                            <NavLink className="nav-link dropdown-toggle" data-toggle="dropdown" to="#">Наставник</NavLink>
                            <div className="dropdown-menu">
                                <NavLink to="/nastavnik" className="nav-link dropdown-item">Приказ наставника</NavLink>
                            </div>
                        </li>

                        <li className="nav-item dropdown">
                            <NavLink className="nav-link dropdown-toggle" data-toggle="dropdown" to="#">Факултет</NavLink>
                            <div className="dropdown-menu">
                                <NavLink to="/fakultet" className="nav-link dropdown-item">Приказ факултета</NavLink>
                                <NavLink to="/dodajRukovodioca" className="nav-link dropdown-item">Постави руководиоца</NavLink>
                            </div>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/kontakt" className="nav-link">Контакт</NavLink>
                        </li>

                    </ul>

                    <ul className="navbar-nav ml-auto">
                        {
                            this.renderLoginLink()
                        }
                    </ul>
                </nav>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        admin: state.admin,
    }
}

export default connect(mapStateToProps)(Navigacija);