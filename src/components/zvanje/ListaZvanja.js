import React, { Component } from 'react';
import axios from 'axios';
import NapraviZvanje from './NapraviZvanje';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Button } from 'primereact/components/button/Button';
import { Growl } from 'primereact/components/growl/Growl';
import { Dialog } from 'primereact/components/dialog/Dialog';
import { loadingIcon } from './../common/loading';
import { createIcon, editIcon, deleteIcon, refreshIcon } from './../common/icons';
import { InputText } from 'primereact/components/inputtext/InputText';

import IzmenaZvanja from './IzmenaZvanja';

class ListaZvanja extends Component {

    state = {
        zvanja: null,
        hasError: false,
        modal: {
            prikaziModalKreirajZvanje: false,
            prikaziModalIzmeniZvanje: false,
        },
        selektovanoZvanje: null,
        pretragaFilter: null,
    }

    componentWillMount() {
        this.ucitajZvanja();
    }

    ucitajZvanja = () => {
        axios.get('http://localhost:8080/WebApi/api/zvanje/').then(data => {
            this.setState({ zvanja: data.data });
        }).catch(error => {
            console.log('Greska ' + error);
            this.setState({ hasError: true });
        });
    }

    deselektujZvanje = () => {
        this.setState({
            selektovanoZvanje: null,
        });
    }

    zatvoriModalKreirajZvanje = () => {
        this.setState({
            modal: {
                prikaziModalKreirajZvanje: false,
            }
        });
    }

    zatvoriModalIzmeniZvanje = () => {
        this.setState({
            modal: {
                prikaziModalIzmeniZvanje: false,
            }
        });
    }

    showMessage = (details, summary = null, msgType = 'success') => {
        this.growl.show({ severity: msgType, summary: summary, detail: details, life: 5000 });
    }

    zvanjeDeleted = () => {
        this.ucitajZvanja();
        this.deselektujZvanje();
    }

    openCreateZvanjeModal = () => {
        this.setState({
            modal: {
                prikaziModalKreirajZvanje: true,
            }
        });
    }

    napraviZvanje = (zvanje) => {
        axios.post('http://localhost:8080/WebApi/api/zvanje/', zvanje).then(resp => {
            this.ucitajZvanja();
            this.showMessage('Звање ' + zvanje.naziv + ' је успешно креирано');
            this.zatvoriModalKreirajZvanje();
        }).catch(error => {
            this.showMessage('Звање није креирано', 'Грешка', 'error');
        });
    }

    obrisiZvanje = () => {
        if (this.state.selektovanoZvanje == null) {
            this.showMessage('Изаберите звање које желите да обришете', '', 'warn');
            return false;
        }

        const zvanje = {
            ...this.state.selektovanoZvanje
        }

        axios.delete('http://localhost:8080/WebApi/api/zvanje/' + zvanje.zvanjeId).then(response => {
            this.showMessage('Звање ' + zvanje.naziv + ' је успешно обрисано.');
            this.zvanjeDeleted();
        }).catch(error => {
            this.showMessage('Звање ' + zvanje.naziv + ' није обрисано.', 'Грешка', 'error');
        });
    }

    otvoriIzmeniZvanjeModal = () => {
        if (this.state.selektovanoZvanje == null) {
            this.showMessage('Изаберите звање које желите да измените', '', 'warn')
            return false;
        }

        this.setState({
            modal: {
                prikaziModalIzmeniZvanje: true,
            }
        });
    }

    azurirajZvanje = (zvanje) => {
        axios.put('http://localhost:8080/WebApi/api/zvanje/' + zvanje.zvanjeId, zvanje).then(resp => {
            this.ucitajZvanja();
            this.showMessage('Звање је успешно ажурирано.');
            this.zatvoriModalIzmeniZvanje();
        }).catch(error => {
            this.showMessage('Дошло је до грешке приликом ажирирања звања.', '', 'warn');
            return false;
        });
    }

    selektujZvanje = (e) => {
        this.setState({
            selektovanoZvanje: e.data,
        });
    }

    getTableHeader = () => {
        return (
            <div style={{ position: 'relative' }}>
                <div className="pull-left">
                    <Button label="" className="ui-button-primary" onClick={this.ucitajZvanja}>
                        {refreshIcon}
                    </Button>

                    <Button label="" className="ui-button-success" onClick={this.openCreateZvanjeModal}>
                        {createIcon}
                    </Button>

                    <Button label="" className="ui-button-warning" onClick={this.otvoriIzmeniZvanjeModal}>
                        {editIcon}
                    </Button>

                    <Button label="" className="ui-button-danger" onClick={this.obrisiZvanje}>
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

    render() {
        let content = null;

        if (this.state.zvanja == null && !this.state.hasError) {
            content = (<div className="text-center">{loadingIcon}</div>);
        } else if (this.state.hasError) {
            content = (<h5 className="text-center">Грешка приликом учитавања звања!</h5>);
        } else if (this.state.zvanja != null) {
            content = (
                <React.Fragment>

                    <div className="content-section implementation">
                        <Growl ref={el => this.growl = el}></Growl>

                        <DataTable
                            value={this.state.zvanja}
                            paginator={true}
                            rows={10}
                            rowsPerPageOptions={[5, 10, 20]}
                            selectionMode="single"
                            selection={this.state.selektovanoZvanje}
                            onSelectionChange={this.selektujZvanje}
                            resizableColumns={true}
                            globalFilter={this.state.pretragaFilter}
                            header={this.getTableHeader()}
                        >
                            <Column field="zvanjeId" header="ИД" sortable style={{ width: '20%' }} />
                            <Column field="naziv" header="Назив" sortable />
                        </DataTable>
                    </div>

                </React.Fragment>
            );
        }

        return (
            <div>
                <h2 className="text-center">Приказ свих звања</h2>

                {content}

                <Dialog
                    modal={true}
                    resizable={true}
                    visible={this.state.modal.prikaziModalKreirajZvanje}
                    onHide={() => this.setState({ modal: { isModalOpen: false } })}>
                    <NapraviZvanje napraviZvanje={this.napraviZvanje} />
                </Dialog>

                <Dialog
                    modal={true}
                    resizable={true}
                    minWidth={400}
                    visible={this.state.modal.prikaziModalIzmeniZvanje}
                    onHide={() => this.setState({ modal: { prikaziModalIzmeniZvanje: false } })}
                >
                    <IzmenaZvanja
                        zvanje={this.state.selektovanoZvanje}
                        onNazivZvanjaChange={this.nazivZvanjaChanged}
                        azurirajZvanje={this.azurirajZvanje}
                    />
                </Dialog>
            </div>
        );


    }

    nazivZvanjaChanged = (e) => {
        const zvanje = {
            ...this.state.selektovanoZvanje,
            naziv: e.target.value
        }

        this.setState({
            selektovanoZvanje: zvanje,
        });
    }
}

export default ListaZvanja;