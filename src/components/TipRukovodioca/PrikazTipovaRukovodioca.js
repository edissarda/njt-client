import React, { Component } from 'react';
import axios from 'axios';
import { loadingIcon } from './../common/loading';
import { Growl } from 'primereact/components/growl/Growl';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { createIcon, deleteIcon, refreshIcon, searchIcon } from './../common/icons';
import TooltipButton from '../common/TooltipButton';
import { TextField, Button } from '@material-ui/core';
import NapraviTipRukovodioca from './NapraviTipRukovodioca';
import { Dialog } from '@material-ui/core';
import WithAuth from '../hoc/WithAuth';


const uri = 'tip-rukovodioca/';

class PrikazTipovaRukovodioca extends Component {
    state = {
        prikaziModalKreirajTipRukovodioca: false,
        prikaziModalObrisiTipRukovodioca: false,
        tipoviRukovodioca: [],
        selektovaniTipRukovodioca: null,
        loading: true,
        hasError: false,
        title: 'Типови руководиоца',
    }

    componentDidMount() {
        this.ucitajTipoveRukovodioca();
    }

    ucitajTipoveRukovodioca = () => {
        axios.get(uri)
            .then(resp => {
                const response = resp.data;
                if (response.status === 200) {
                    this.setSuccessLoading(response.data);
                } else {
                    this.setErrorLoading();
                }
            }).catch(() => {
                this.setErrorLoading();
            })
    }

    setErrorLoading = () => {
        this.setState({
            hasError: true,
            loading: false,
        });
    }

    setSuccessLoading = (data) => {
        this.setState({
            tipoviRukovodioca: data,
            loading: false,
            hasError: false,
        });
    }

    openCreateTipRukovodiocaModal = () => {
        this.setState({
            prikaziModalKreirajTipRukovodioca: true,
        });
    }

    getTableHeader = () => {
        return (
            <div style={{ position: 'relative' }}>
                <div className="pull-left">
                    <TooltipButton
                        tooltip="Освежи приказ"
                        onClick={this.ucitajTipoveRukovodioca}
                    >
                        {refreshIcon}
                    </TooltipButton>

                    <TooltipButton
                        tooltip="Креирај нови тип руководиоца"
                        onClick={this.openCreateTipRukovodiocaModal}
                    >
                        {createIcon}
                    </TooltipButton>

                    <TooltipButton
                        tooltip="Обриши тип руководиоца"
                        onClick={() => {
                            if (this.state.selektovaniTipRukovodioca === null) {
                                this.showMessage('Изаберите тип руководиоца', null, 'warn');
                                return false;
                            }

                            this.setState({ prikaziModalObrisiTipRukovodioca: true })
                        }}
                    >
                        {deleteIcon}
                    </TooltipButton>
                </div>
                <div className="text-right">
                    <TextField
                        type="text"
                        onChange={(e) => this.setState({ pretragaFilter: e.target.value })}
                        label="Претрага"
                        InputProps={{
                            endAdornment: searchIcon,
                        }}
                    />
                </div>

            </div>
        );
    }

    selektujTipRukovodioca = (event) => {
        this.setState({
            selektovaniTipRukovodioca: event.data,
        });
    }

    zatvoriModalKreirajТipRukovodioca = () => {
        this.setState({
            prikaziModalKreirajTipRukovodioca: false,
        });
    }

    showMessage = (details, summary = null, msgType = 'success') => {
        this.growl.show({ severity: msgType, summary: summary, detail: details, life: 5000 });
    }

    napraviTipRukovodioca = (tipRukovodioca) => {
        axios.post(uri, tipRukovodioca).then(resp => {
            const status = resp.data.status;
            if (status === 200) {
                this.ucitajTipoveRukovodioca();
                this.showMessage('Тип руководиоца ' + tipRukovodioca.naziv + ' је успешно креиран.');
                this.zatvoriModalKreirajТipRukovodioca();
            } else {
                this.showMessage(resp.data.message, '', 'error');
            }
        }).catch(error => {
            this.showMessage(error.response.data.error, 'Грешка', 'error');
        });
    }

    tipRukovodiocaObrisan = () => {
        this.setState({
            selektovaniTipRukovodioca: null,
            prikaziModalObrisiTipRukovodioca: false,
        });
        this.ucitajTipoveRukovodioca();
    }

    obrisiTipRukovodioca = () => {
        if (this.state.selektovaniTipRukovodioca == null) {
            this.showMessage('Изаберите тип руководиоца које желите да обришете', '', 'warn');
            return false;
        }

        const tipRukovodioca = {
            ...this.state.selektovaniTipRukovodioca
        }

        axios.delete(uri + tipRukovodioca.id).then(response => {
            const status = response.data.status;
            if (status === 200) {
                this.showMessage('Тип руководиоца ' + response.data.data.naziv + ' је успешно обрисан.');
                this.tipRukovodiocaObrisan();
            } else {
                this.showMessage(response.data.message, null, 'error');
            }
        }).catch((error) => {
            this.showMessage(error.response.data.error, 'Грешка', 'error');
        });

        this.setState({
            prikaziModalObrisiTipRukovodioca: false,
        });
    }

    render() {
        let content = (<h1 className="text-center">{this.state.title}</h1>);

        if (this.state.loading) {
            content = (
                <div className="text-center">
                    <h2>{this.state.title}</h2>
                    {loadingIcon}
                </div>
            );
        } else if (this.state.hasError) {
            content = (
                <div className="text-center">
                    <h2>{this.state.title}</h2>
                    <h4>Грешка приликом учитавања типова руководиоца</h4>
                </div>
            );
        } else {
            content = (
                <React.Fragment>

                    <Dialog
                        open={this.state.prikaziModalKreirajTipRukovodioca}
                        onClose={() => this.setState({ prikaziModalKreirajTipRukovodioca: false })}
                    >
                        <div style={{ padding: '30px' }}>
                            <NapraviTipRukovodioca napraviTipRukovodioca={this.napraviTipRukovodioca} />
                        </div>
                    </Dialog>

                    <Dialog
                        open={this.state.prikaziModalObrisiTipRukovodioca}
                        onClose={() => this.setState({ prikaziModalObrisiTipRukovodioca: false })}
                    >
                        <div style={{ padding: '30px' }}>
                            <WithAuth>
                                <div>
                                    <h4 className="text-center">Брисање типа руководиоца</h4>

                                Да ли сте сигурни да желите да обришете изабрани тип руководиоца?

                                <div>
                                        <Button onClick={() => this.setState({ prikaziModalObrisiTipRukovodioca: false })}>
                                            Не
                                    </Button>

                                        <Button onClick={this.obrisiTipRukovodioca} variant="text" color="secondary">
                                            Да, обриши
                                    </Button>
                                    </div>
                                </div>
                            </WithAuth>
                        </div>
                    </Dialog>

                    <div className="content-section implementation">
                        <Growl ref={el => this.growl = el}></Growl>

                        <DataTable
                            value={this.state.tipoviRukovodioca}
                            paginator={true}
                            rows={10}
                            rowsPerPageOptions={[5, 10, 20]}
                            selectionMode="single"
                            selection={this.state.selektovaniTipRukovodioca}
                            onSelectionChange={this.selektujTipRukovodioca}
                            resizableColumns={true}
                            globalFilter={this.state.pretragaFilter}
                            header={this.getTableHeader()}
                        >
                            <Column field="id" header="ИД" sortable style={{ width: '5%' }} />
                            <Column field="naziv" header="Назив" sortable />
                        </DataTable>
                    </div>

                </React.Fragment>
            );
        }

        return (
            <React.Fragment>
                {content}
            </React.Fragment>
        );
    }
}

export default PrikazTipovaRukovodioca;