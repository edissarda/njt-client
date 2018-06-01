import React, { Component } from 'react';
import axios from 'axios';
import NapraviZvanje from './NapraviZvanje';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Button } from 'primereact/components/button/Button';
import { Growl } from 'primereact/components/growl/Growl';
import { Toolbar } from 'primereact/components/toolbar/Toolbar';
import { Dialog } from 'primereact/components/dialog/Dialog';




class ListaZvanja extends Component {

    state = {
        zvanja: null,
        hasError: false,
        modal: {
            isModalOpen: false,
        },
        selektovanoZvanje: null,
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

    closeModal = () => {
        this.setState({
            modal: {
                isModalOpen: false,
            }
        });
    }

    showMessage = (details, summary = null, msgType = 'success') => {
        this.growl.show({ severity: msgType, summary: summary, detail: details, life: 5000 });
    }

    zvanjeCreated = async (zvanje) => {
        this.ucitajZvanja();
        await this.closeModal();
        this.showMessage('Звање ' + zvanje.naziv + ' је успешно креирано.');
    }

    zvanjeDeleted = () => {
        this.ucitajZvanja();
    }

    openCreateZvanjeModal = () => {
        this.setState({
            modal: {
                isModalOpen: true,
            }
        });
    }

    showModal = (text) => {
        this.setState({
            modal: {
                isModalOpen: true,
                content: text,
                center: false,
            }
        });
    }

    napraviZvanje = (zvanje) => {
        axios.post('http://localhost:8080/WebApi/api/zvanje/', zvanje).then(resp => {
            this.showMessage('Звање ' + zvanje.naziv + ' је успешно креирано');
            this.ucitajZvanja();
            this.closeModal();
        }).catch(error => {
            this.showMessage('Звање није креирано', 'Грешка', 'error');
        });
    }

    obrisiZvanje = () => {
        if (this.state.selektovanoZvanje == null) {
            this.showModal('Изаберите звање.');
            return false;
        }

        console.log(this.state.selektovanoZvanje);


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

    izmeniZvanje = () => {
        if (this.state.selektovanoZvanje == null) {
            console.log('izaberi zvanje');
            return false;
        }

        const zvanje = {
            ...this.state.selektovanoZvanje
        }

        console.log('forma za izmenu zvanja: ' + zvanje.naziv);
    }

    azurirajZvanje = (zvanje) => {
        axios.put('http://localhost:8080/WebApi/api/zvanje/' + zvanje.zvanjeId, zvanje).then(resp => {
            this.ucitajZvanja();
            this.showModal('Звање је успешно ажурирано.');
            return true;
        }).catch(error => {
            this.showModal('Дошло је до грешке приликом ажирирања звања.');
            return false;
        });
    }

    selektujZvanje = async (e) => {
        await this.setState({
            selektovanoZvanje: e.data
        });
    }

    render() {
        let content = null;

        if (this.state.hasError) {
            content = (<h3 className="text-center">Грешка приликом учитавања звања!</h3>);
        } else if (this.state.zvanja != null) {
            content = (
                <React.Fragment>

                    <div className="content-section implementation">
                        <Growl ref={el => this.growl = el}></Growl>

                        <Toolbar>
                            <Button label="Креирај ново звање" className="ui-button-success" onClick={this.openCreateZvanjeModal} />
                            <Button label="Измени" className="ui-button-warning" onClick={this.izmeniZvanje} />
                            <Button label="Обриши" className="ui-button-danger" onClick={this.obrisiZvanje} />
                        </Toolbar>

                        <p></p>

                        <DataTable
                            value={this.state.zvanja}
                            paginator={true}
                            rows={10}
                            rowsPerPageOptions={[5, 10, 20]}
                            selectionMode="single"
                            selection={this.state.selektovanoZvanje}
                            onSelectionChange={this.selektujZvanje}
                            resizableColumns={true}
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

                <Dialog modal={true}
                    resizable={true}
                    visible={this.state.modal.isModalOpen}
                    onHide={() => this.setState({ modal: { isModalOpen: false } })}>
                    <NapraviZvanje napraviZvanje={this.napraviZvanje} />
                </Dialog>
            </div>
        );
    }
}

export default ListaZvanja;