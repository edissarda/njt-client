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

                        <li className="nav-item dropdown">
                            <NavLink className="nav-link dropdown-toggle" data-toggle="dropdown" to="#">Шифарници</NavLink>
                            <div className="dropdown-menu">
                                <NavLink to="/zvanje" className="nav-link dropdown-item">Звања</NavLink>
                                <NavLink to="/tipovi-rukovodioca" className="nav-link dropdown-item">Типови руководиоца</NavLink>
                                <NavLink to="/vrste-organizacija" className="nav-link dropdown-item">Врсте организација</NavLink>
                            </div>
                        </li>

                        <li className="nav-item dropdown">
                            <NavLink className="nav-link dropdown-toggle" data-toggle="dropdown" to="#">Факултет</NavLink>
                            <div className="dropdown-menu">
                                <NavLink to="/fakultet/kreiraj" className="nav-link dropdown-item">Креирај нови</NavLink>
                                <NavLink to="/fakultet" className="nav-link dropdown-item">Приказ свих</NavLink>
                            </div>
                        </li>


                        <li className="nav-item">
                            <NavLink to="/rukovodilac" className="nav-link">Руководилац</NavLink>
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