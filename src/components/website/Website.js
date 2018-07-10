import React, { Component } from 'react';
import Nav from '../nav/Nav';
import { Route, Switch } from 'react-router-dom';
import ListaZvanja from '../zvanje/ListaZvanja';
import PrikazTipovaRukovodioca from '../TipRukovodioca/PrikazTipovaRukovodioca';
import PrikazVrstaOrganizacija from './../VrstaOrganizacije/PrikazVrstaOrganizacija';
import PrikazSvihFakulteta from '../Fakultet/PrikazSvihFakulteta';
import PrikazNaucnihOblasti from '../NaucnaOblast/PrikazNaucnihOblasti';
import KreirajNoviFakultet from '../Fakultet/KreirajNoviFakultet';

import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'font-awesome/css/font-awesome.css';
import PrikazSvihTitula from '../Titula/PrikazSvihTitula';


class WebSite extends Component {
    render() {
        return (
            <React.Fragment>
                <Nav />
                <Sadrzaj />
                <Footer />
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
                        <Route path="/tip-rukovodioca" exact component={PrikazTipovaRukovodioca} />
                        <Route path="/vrsta-organizacije" exact component={PrikazVrstaOrganizacija} />
                        <Route path="/naucna-oblast" exact component={PrikazNaucnihOblasti} />
                        <Route path="/titula" exact component={PrikazSvihTitula} />

                        <Route path="/fakultet" exact component={PrikazSvihFakulteta} />
                        <Route path="/fakultet-kreiraj" exact component={KreirajNoviFakultet} />
                        {/* <Route path="/rukovodilac" exact component={PrikazRukovodioca} /> */}
                        <Route path="/kontakt" exact component={() => <div>Контакт страница</div>} />

                        <Route render={() => <div className="col-6 col-offset-6"><h1>Грешка 404</h1></div>} />
                    </Switch>
                </div>
            </div>
        </div>
    );
}

function Footer() {
    return (
        <div className="container">
            <div className="col-12" id="footer" style={
                {
                    backgroundColor: '#CCC',
                    borderRadius: '4px',
                    marginTop: '30px',
                    padding: '20px',
                    position: 'relative',
                    bottom: '0px'
                }}>
                &copy; 2018. Едис Шарда | <a href="http://silab.fon.bg.ac.rs" rel="noopener noreferrer" target="_blank">Напредне јава технологије</a>
            </div>
        </div>
    );
}

export default WebSite;