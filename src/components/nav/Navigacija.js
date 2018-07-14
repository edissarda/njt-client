import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Navigacija extends Component {
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
                                <NavLink to="/naucna-oblast" className="nav-link dropdown-item">Научне области</NavLink>
                                <NavLink to="/titula" className="nav-link dropdown-item">Титуле</NavLink>
                            </div>
                        </li>

                        <li className="nav-item dropdown">
                            <NavLink className="nav-link dropdown-toggle" data-toggle="dropdown" to="#">Факултет</NavLink>
                            <div className="dropdown-menu">
                                <NavLink to="/fakultet" className="nav-link dropdown-item">Приказ</NavLink>
                                <NavLink to="/dodajRukovodioca" className="nav-link dropdown-item">Додај руководиоца</NavLink>
                            </div>
                        </li>

                        <li className="nav-item">
                            <NavLink to="/kontakt" className="nav-link">Контакт</NavLink>
                        </li>

                    </ul>
                </nav>

            </div>
        );
    }
}

export default Navigacija;