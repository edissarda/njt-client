import React, { Component } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Growl } from 'primereact/components/growl/Growl';
import { loadingIcon } from '../common/loading';
import { searchIcon, createIcon, refreshIcon, viewIcon } from './../common/icons';
import KreirajNoviFakultet from './KreirajNoviFakultet';
import { Dialog, TextField } from '@material-ui/core';
import CloseButton from './../common/CloseButton'

import PrikazIzabranogFakulteta from './PrikazIzabranogFakulteta';
import TooltipButton from '../common/TooltipButton';
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
                    <TooltipButton
                        onClick={this.ucitajFakultete}
                        tooltip="Освежи приказ">
                        {refreshIcon}
                    </TooltipButton>

                    <TooltipButton
                        onClick={() => { this.setState({ prikaziKreirajFakultetDialog: true }) }}
                        tooltip="Креирај нови факултет">
                        {createIcon}
                    </TooltipButton>

                    <TooltipButton
                        onClick={this.prikaziPodatkeOFakultetu}
                        tooltip="Приказ података о факултету">
                        {viewIcon}
                    </TooltipButton>


                    {/* <Button label="" className="ui-button-warning" onClick={this.otvoriIzmeniZvanjeModal}>
                        {editIcon}
                    </Button>

                    <Button label="" className="ui-button-danger" onClick={this.obrisiZvanje}>
                        {deleteIcon}
                    </Button> */}
                </div>
                <div className="text-right">
                    <TextField
                        type="text"
                        onChange={(e) => this.setState({ pretragaFilter: e.target.value })}
                        label="Претрага"
                        InputProps={{
                            endAdornment: searchIcon
                        }}
                    />
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
                open={this.state.prikaziKreirajFakultetDialog}
                onClose={() =>
                    this.setState({ prikaziKreirajFakultetDialog: false, selektovaniFakultet: null, })
                }
                fullWidth
                scroll="paper"
                maxWidth="md"
            >
                <div style={{ padding: '30px' }}>
                    <KreirajNoviFakultet />

                    <CloseButton onClick={() => this.setState({ prikaziKreirajFakultetDialog: false })} />
                </div>

            </Dialog>
        );
    }

    getDialogPrikaziFakultet = () => {
        let dialogContent = 'Изаберите факултет';
        if (this.state.selektovaniFakultet != null) {
            dialogContent = (
                <div style={{ padding: '30px 100px 30px' }}>
                    <PrikazIzabranogFakulteta id={this.state.selektovaniFakultet.id} />

                    <CloseButton onClick={() => this.setState({ prikaziDialogZaPrikazFakulteta: false })} />
                </div>
            );
        }

        return (
            <Dialog
                open={this.state.prikaziDialogZaPrikazFakulteta}
                onClose={() => this.setState({ prikaziDialogZaPrikazFakulteta: false, selektovaniFakultet: null })}
                fullWidth
                scroll="paper"
                maxWidth={false}
            >
                {dialogContent}

            </Dialog>
        );
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