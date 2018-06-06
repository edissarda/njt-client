import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';


class Nav extends Component {
    render() {
        return (
            <div className="container">
                <nav className="navbar navbar-expand-sm bg-light">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink to="/" className="nav-link">Почетна страна</NavLink>
                        </li>

                        <li className="nav-item">
                            <div className="dropdown">
                                <a style={{cursor: 'pointer'}} className="nav-link dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Звање
                                </a>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <NavLink exact className="dropdown-item" to="/zvanje">Приказ свих звања</NavLink>
                                </div>
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

export default Nav;