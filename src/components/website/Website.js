import React, { Component } from 'react';
import Navigacija from '../nav/Navigacija';
import { Route, Switch } from 'react-router-dom';
import PrikazSvihZvanja from '../zvanje/PrikazSvihZvanja';
import PrikazTipovaRukovodioca from '../TipRukovodioca/PrikazTipovaRukovodioca';
import PrikazVrstaOrganizacija from './../VrstaOrganizacije/PrikazVrstaOrganizacija';
import PrikazSvihFakulteta from '../Fakultet/PrikazSvihFakulteta';
import PrikazNaucnihOblasti from '../NaucnaOblast/PrikazNaucnihOblasti';
import KreirajNoviFakultet from '../Fakultet/KreirajNoviFakultet';
import PrikazSvihTitula from '../Titula/PrikazSvihTitula';
import KreiranjeNovogRukovodioca from '../rukovodilac/KreiranjeNovogRukovodioca';
import PrikazSvihNastavnika from '../Nastavnik/PrikazSvihNastavnika';
import Prijava from './../Prijava/Prijava'
import Profil from '../Administrator/Profil';
import Kontakt from '../Kontakt/Kontakt';

import 'primereact/resources/themes/omega/theme.css';
import 'primereact/resources/primereact.min.css';
import 'font-awesome/css/font-awesome.css';

class WebSite extends Component {
    render() {
        return (
            <React.Fragment>
                <Navigacija />
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
                        <Route path="/" exact render={(props) => <Home {...props} />} />
                        <Route path="/zvanje" exact component={PrikazSvihZvanja} />
                        <Route path="/tipRukovodioca" exact component={PrikazTipovaRukovodioca} />
                        <Route path="/vrstaOrganizacije" exact component={PrikazVrstaOrganizacija} />
                        <Route path="/naucnaOblast" exact component={PrikazNaucnihOblasti} />
                        <Route path="/titula" exact component={PrikazSvihTitula} />

                        <Route path="/fakultet" exact component={PrikazSvihFakulteta} />
                        <Route path="/kreirajFakultet" exact component={KreirajNoviFakultet} />
                        <Route path="/nastavnik" exact component={PrikazSvihNastavnika} />
                        <Route path="/dodajRukovodioca" exact component={KreiranjeNovogRukovodioca} />
                        <Route path="/kontakt" exact component={Kontakt} />

                        <Route path="/login" exact component={Prijava} />
                        <Route path="/profil" exact component={Profil} />

                        <Route render={() => <div className="col-6 col-offset-6"><h1>Грешка 404</h1></div>} />
                    </Switch>
                </div>
            </div>
        </div>
    );
}

class Home extends React.Component {

    render() {
        return (
            <div>
                Здраво
            </div>
        );
    }

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