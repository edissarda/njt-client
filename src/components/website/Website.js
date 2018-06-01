import React, { Component } from 'react';
import Nav from '../nav/Nav';
import { Route, Switch } from 'react-router-dom';
import ListaZvanja from '../zvanje/ListaZvanja';

import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/omega/theme.css';
import 'font-awesome/css/font-awesome.css';
import 'primereact/components/common/Common.css';

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
                        <Route path="/" exact render={() => <div className="container"><h1>Hello</h1></div>} />
                        <Route path="/zvanje" exact component={ListaZvanja} />
                        <Route render={() => <div className="col-6 col-offset-6"><h1>Грешка 404</h1></div>} />
                    </Switch>
                </div>
            </div>
        </div>
    );
}

export default WebSite;