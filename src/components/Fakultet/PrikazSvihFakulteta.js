import React, { Component } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Button } from 'primereact/components/button/Button';
import { Growl } from 'primereact/components/growl/Growl';
import { InputText } from 'primereact/components/inputtext/InputText';

import { loadingIcon } from '../common/loading';
import { createIcon, editIcon, deleteIcon, refreshIcon, viewIcon } from './../common/icons';

const uri = 'fakultet';

class PrikazSvihFakulteta extends Component {
    state = {
        fakulteti: [],
        loading: true,
        hasError: false,
        pretragaFilter: null,
        columns: [
            {
                field: 'id',
                header: 'ИД',
                style: { width: '20% !important' }
            },
            {
                field: 'naziv',
                header: 'Назив'
            },
            {
                field: 'maticniBroj',
                header: 'Матични број'
            },
            {
                field: 'poreskiBroj',
                header: 'Порески број'
            }
        ]
    }

    componentDidMount() {
        this.ucitajFakultete();
    }

    ucitajFakultete = () => {
        this.setState({
            loading: true,
            hasError: false,
        });

        axios.get(uri).then(response => {
            const data = response.data;

            console.log(data);


            if (data.status === 200) {
                this.uspesnoUcitaniFakulteti(data.data);
            } else {
                this.greskaPriUcitavanjuFakulteta();
            }
        }).catch(() => {
            this.greskaPriUcitavanjuFakulteta();
        });
    }

    greskaPriUcitavanjuFakulteta = () => {
        this.setState({
            loading: false,
            hasError: true,
        });
    }

    uspesnoUcitaniFakulteti = (data) => {
        this.setState({
            fakulteti: data,
            loading: false,
            hasError: false,
        });
    }

    showMessage = (details, msgType = 'success', summary = null) => {
        this.growl.show({ severity: msgType, summary: summary, detail: details, life: 5000 });
    }

    prikaziPodatkeOFakultetu = () => {
        if (this.state.selektovaniFakultet == null) {
            this.showMessage('Изаберите факултет', 'warn');
            return false;
        }

        const fakultet = {
            ...this.state.selektovaniFakultet
        }

        this.showMessage(fakultet.naziv, 'info');

    }

    getTableHeader = () => {
        return (
            <div style={{ position: 'relative' }}>
                <div className="pull-left">
                    <Button label="" className="ui-button-primary" onClick={this.ucitajFakultete}>
                        {refreshIcon}
                    </Button>

                    <Button label="" className="ui-button-primary" onClick={this.prikaziPodatkeOFakultetu}>
                        {viewIcon}
                    </Button>

                    <Button label="" className="ui-button-success" onClick={() => { this.showMessage('TODO :)', 'info') }}>
                        {createIcon}
                    </Button>

                    {/* <Button label="" className="ui-button-warning" onClick={this.otvoriIzmeniZvanjeModal}>
                        {editIcon}
                    </Button>

                    <Button label="" className="ui-button-danger" onClick={this.obrisiZvanje}>
                        {deleteIcon}
                    </Button> */}
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

    selektujFakultet = (e) => {
        this.setState({
            selektovaniFakultet: e.data,
        });
    }

    render() {

        let content = null;

        if (this.state.loading) {
            content = (<div className="text-center">{loadingIcon}</div>);
        } else if (this.state.hasError) {
            content = (
                <h4 className="text-center">Грешка приликом учитавања факултета.</h4>
            );
        } else {
            content = (
                <React.Fragment>

                    <div className="content-section implementation">
                        <Growl ref={el => this.growl = el}></Growl>

                        <DataTable
                            value={this.state.fakulteti}
                            paginator={true}
                            rows={10}
                            rowsPerPageOptions={[5, 10, 20, 50]}
                            selectionMode="single"
                            selection={this.state.selektovaniFakultet}
                            onSelectionChange={this.selektujFakultet}
                            resizableColumns={true}
                            globalFilter={this.state.pretragaFilter}
                            header={this.getTableHeader()}
                        >


                            {
                                this.state.columns.map(column => {
                                    return (
                                        <Column
                                            key={column.field}
                                            field={column.field}
                                            header={column.header}
                                            sortable
                                            style={column.style}
                                        />);
                                })
                            }
                        </DataTable>
                    </div>

                </React.Fragment>
            );
        }

        return (
            <React.Fragment>

                <h2 className="text-center">Факултети</h2>

                {content}

            </React.Fragment>
        );
    }
}

export default PrikazSvihFakulteta;