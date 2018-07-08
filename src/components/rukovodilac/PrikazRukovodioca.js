import React, { Component } from 'react';
import axios from 'axios';
import { loadingIcon } from '../common/loading';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Button } from 'primereact/components/button/Button';
import { deleteIcon, refreshIcon, editIcon, createIcon } from '../common/icons';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Toolbar } from 'primereact/components/toolbar/Toolbar';
import Rukovodilac from './Rukovodilac';

const prikazi = ['tabela', 'mreza', 'lista'];

class PrikazRukovodioca extends Component {

    state = {
        rukovodioci: [],
        selektovaniRukovodilac: null,
        loading: true,
        loadingError: false,
        pretragaFilter: null,
        prikaz: 'tabela'
    }

    componentDidMount() {
        this.ucitajRukovodioce();
    }

    ucitajRukovodioce = () => {
        axios.get('http://localhost:8080/WebApi/api/rukovodilac').then(response => {
            if (response.data.status === 200) {
                this.setState({
                    rukovodioci: response.data.data,
                    loading: false,
                });
            } else {
                this.setState({
                    loading: false,
                    loadingError: true,
                })
            }
        }).catch(() => {
            this.setState({
                loading: false,
                loadingError: true,
            })
        });
    }

    renderTableHeader = () => {
        return (
            <div style={{ position: 'relative' }}>
                <div className="pull-left">
                    <Button className="ui-button-primary" onClick={this.ucitajRukovodioce}>
                        {refreshIcon}
                    </Button>

                    <Button label="" className="ui-button-success">
                        {createIcon}
                    </Button>

                    <Button label="" className="ui-button-warning">
                        {editIcon}
                    </Button>

                    <Button label="" className="ui-button-danger">
                        {deleteIcon}
                    </Button>
                </div>

                <div className="text-right">
                    <InputText
                        type="text"
                        onChange={(e) => this.setState({ pretragaFilter: e.target.value })}
                        placeholder="Претрага"
                        size={30}
                    />
                    <i className="fa fa-search" style={{ marginLeft: '10px' }}></i>
                </div>

            </div>
        );
    }

    renderTable = () => {
        return (
            <div className="content-section implementation">
                <DataTable
                    value={this.state.rukovodioci}
                    header={this.renderTableHeader()}
                    paginator={true}
                    rows={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    resizableColumns={true}
                    selectionMode="single"
                    onSelectionChange={(e) => this.setState({ selektovaniRukovodilac: e.data })}
                    selection={this.state.selektovaniRukovodilac}
                    globalFilter={this.state.pretragaFilter}
                >
                    <Column field="rukovodilacId" header="ИД" style={{ width: '5%' }} />
                    <Column field="ime" header="Име" sortable />
                    <Column field="prezime" header="Презиме" sortable />
                </DataTable>
            </div>
        );
    }

    postaviPrikaz = (e, tipPrikaza) => {
        e.preventDefault();

        this.setState({
            prikaz: tipPrikaza
        });
    }

    renderIzborPrikaza = () => {
        return (
            <Toolbar style={{ marginBottom: '30px' }}>
                Приказ:
                <a href="/" onClick={(e) => this.postaviPrikaz(e, prikazi[0])}>табела</a> |
                <a href="/" onClick={(e) => this.postaviPrikaz(e, prikazi[1])}>мрежа</a> |
                <a href="/" onClick={(e) => this.postaviPrikaz(e, prikazi[2])}>листа</a>
            </Toolbar>
        );
    }

    renderMreza = () => {
        return (
            <div className="row">
                {
                    this.state.rukovodioci.map(r => {
                        return <Rukovodilac key={r.rukovodilacId} rukovodilac={r} prikaz={this.state.prikaz} />;
                    })
                }
            </div>
        );
    }


    render() {
        let content = null;

        if (this.state.loading) {
            content = (<div className="text-center">{loadingIcon}</div>);
        } else if (this.state.loadingError) {
            content = (<h5 className="text-center">Грешка приликом учитавања руководиоца</h5>);
        } else if (this.state.rukovodioci.length > 0) {
            if (this.state.prikaz === prikazi[0]) {
                content = (this.renderTable());
            } else {
                content = (this.renderMreza());
            }
        }


        return (
            <div>
                <h2 className="text-center">Приказ свих руководиоца</h2>

                {this.renderIzborPrikaza()}

                {content}
            </div>
        );
    }
}

export default PrikazRukovodioca;