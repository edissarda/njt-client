import React, { Component } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Button } from 'primereact/components/button/Button';
import { Growl } from 'primereact/components/growl/Growl';
import { InputText } from 'primereact/components/inputtext/InputText';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { Sidebar } from 'primereact/components/sidebar/Sidebar';
import { loadingIcon } from '../common/loading';
import { createIcon, editIcon, deleteIcon, refreshIcon, viewIcon } from './../common/icons';
import KreirajNoviFakultet from './KreirajNoviFakultet';

import PrikazIzabranogFakulteta from './PrikazIzabranogFakulteta';
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
        ],
        prikaziKreirajFakultetDialog: false,
        prikaziDialogZaPrikazFakulteta: false,
        selektovaniFakultet: null,
    }

    componentDidMount() {
        this.ucitajFakultete();
    }

    ucitajFakultete = () => {
        this.setState({
            loading: true,
            hasError: false,
            selektovaniFakultet: null,
        });

        axios.get(uri).then(response => {
            const data = response.data;

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

        this.setState({
            prikaziDialogZaPrikazFakulteta: true,
        });
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

                    <Button label="" className="ui-button-success" onClick={() => { this.setState({ prikaziKreirajFakultetDialog: true }) }}>
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

    getDialogKreirajFakultet = () => {
        return (
            <Dialog
                visible={this.state.prikaziKreirajFakultetDialog}
                onHide={() =>
                    this.setState({ prikaziKreirajFakultetDialog: false, selektovaniFakultet: null, })
                }
                minWidth={650}
                resizable={true}
                header="Креирање новог факултета"
            >

                <KreirajNoviFakultet />

            </Dialog>
        );
    }

    getDialogPrikaziFakultet = () => {
        if (this.state.prikaziDialogZaPrikazFakulteta) {
            return (
                <Sidebar
                    visible={this.state.prikaziDialogZaPrikazFakulteta}
                    fullScreen={true}
                    onHide={() => this.setState({ prikaziDialogZaPrikazFakulteta: false })}
                    blockScroll={false}>
                    <PrikazIzabranogFakulteta id={this.state.selektovaniFakultet.id} />
                </Sidebar>
                // <Dialog
                //     visible={this.state.prikaziDialogZaPrikazFakulteta}
                //     onHide={() => this.setState({ prikaziDialogZaPrikazFakulteta: false })}
                //     resizable={true}
                //     header="Приказ изабраног факултета"
                // >

                //     <PrikazIzabranogFakulteta id={this.state.selektovaniFakultet.id} />

                // </Dialog>
            );
        }

        return null;
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
                                        />);
                                })
                            }
                        </DataTable>
                    </div>

                    {
                        this.getDialogKreirajFakultet()
                    }

                    {
                        this.getDialogPrikaziFakultet()
                    }

                </React.Fragment>
            );
        }

        return (
            <div>

                <h2 className="text-center">Факултети</h2>

                {content}

            </div>
        );
    }
}

export default PrikazSvihFakulteta;