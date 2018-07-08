import React, { Component } from 'react';
import Nav from '../nav/Nav';
import { Route, Switch } from 'react-router-dom';
import ListaZvanja from '../zvanje/ListaZvanja';
import PrikazTipovaRukovodioca from '../TipRukovodioca/PrikazTipovaRukovodioca';
import PrikazVrstaOrganizacija from './../VrstaOrganizacije/PrikazVrstaOrganizacija';
import PrikazSvihFakulteta from '../Fakultet/PrikazSvihFakulteta';

import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'font-awesome/css/font-awesome.css';


class WebSite extends Component {
    render() {
        return (
            <React.Fragment>
                <Nav />
                <Sadrzaj />
            </React.Fragment>
        );
    }
}


function Sadrzaj() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-12">
                    <Switch>
                        <Route path="/" exact render={() => <h5>Здраво</h5>} />
                        <Route path="/zvanje" exact component={ListaZvanja} />
                        <Route path="/tipovi-rukovodioca" exact component={PrikazTipovaRukovodioca} />
                        <Route path="/vrste-organizacija" exact component={PrikazVrstaOrganizacija} />

                        <Route path="/fakultet/kreiraj" exact component={PrikazSvihFakulteta} />
                        <Route path="/fakultet" exact component={PrikazSvihFakulteta} />
                        {/* <Route path="/rukovodilac" exact component={PrikazRukovodioca} /> */}
                        <Route path="/kontakt" exact component={() => <div>Контакт страница</div>} />

                        <Route render={() => <div className="col-6 col-offset-6"><h1>Грешка 404</h1></div>} />
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default WebSite;