import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Rukovodilac extends Component {

    renderListContent = () => {
        const r = this.props.rukovodilac;
        return (
            <div className="card" style={{ width: '100%', marginBottom: '20px' }}>
                <div className="card-header">
                    <h5 className="card-title">
                        {r.tipRukovodioca.naziv} {r.zvanje.naziv} {r.ime} {r.prezime}
                    </h5>
                </div>

                <div className="card-body">

                    <p className="card-text">
                        {r.fakultet.naziv}
                    </p>

                    <Link to={"/rukovodilac/" + r.rukovodilacId} className="card-link">
                        Приказ
                    </Link>

                    <Link to={"/rukovodilac/" + r.rukovodilacId} className="card-link">
                        Измена
                    </Link>
                </div>
            </div>
        );
    }

    renderGridContent = () => {
        return (
            <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12 text-center" style={{ marginBottom: '20px' }}>
                {this.renderListContent()}
            </div>
        );
    }

    render() {
        let content = this.renderListContent();

        if (this.props.prikaz === 'mreza') {
            content = this.renderGridContent();
        }

        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        );
    }
}

export default Rukovodilac;