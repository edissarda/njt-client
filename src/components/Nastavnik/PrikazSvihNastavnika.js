import React, { Component } from 'react';
import { loadingIcon } from './../common/loading'
import axios from 'axios'
import { Growl } from 'primereact/components/growl/Growl';
import { DataTable } from 'primereact/components/datatable/DataTable'
import TooltipButton from '../common/TooltipButton';
import { createIcon, refreshIcon, searchIcon, viewIcon } from './../common/icons';
import { Column } from 'primereact/components/column/Column';
import { TextField, Dialog } from '@material-ui/core';
import KreirajNovogNastavnika from './KreirajNovogNastavnika';
import CloseButton from './../common/CloseButton';
import PrikazIzabranogNastavnika from './PrikazIzabranogNastavnika';

const uri = 'nastavnik';

class PrikazSvihNastavnika extends Component {

    state = {
        nastavnici: [],
        selektovaniNastavnik: null,
        pretragaFilter: null,
        loading: true,
        hasError: false,

        prikaziDijalogKreirajNastavnika: false,
        prikaziDijalogZaPrikazPodatakaONastavniku: false,
    }

    componentDidMount() {
        this.ucitajNastavnike();
    }

    ucitajNastavnike = () => {
        this.setState({
            loading: true,
            hasError: false,
            selektovaniNastavnik: null,
        });
        axios.get(uri).then(resp => {
            if (resp.data.status === 200) {
                this.setNastavnici(resp.data.data);
            } else {
                this.setError();
            }
        }).catch(() => {
            this.setError();
        });
    }

    setNastavnici = (nastavnici) => {
        this.setState({
            nastavnici: nastavnici,
            loading: false,
            hasError: false,
        });
    }

    setError = () => {
        this.setState({
            loading: false,
            hasError: true,
        });
    }

    showMessage = (msg, severity = 'success', detail = null) => {
        this.growl.show({ severity: severity, summary: msg, detail: detail, life: 8000 });
    }

    renderDijalogZaPrikazPodatakaONastavniku = () => {
        if (this.state.selektovaniNastavnik === null) {
            return null;
        }

        return (
            <Dialog
                open={this.state.prikaziDijalogZaPrikazPodatakaONastavniku}
                onClose={() => this.setState({ prikaziDijalogZaPrikazPodatakaONastavniku: false })}
                maxWidth="md"
                fullWidth
            >
                <CloseButton onClick={() => { this.setState({ prikaziDijalogZaPrikazPodatakaONastavniku: false }) }} />
                <div style={{ padding: '20px' }}>
                    <PrikazIzabranogNastavnika id={this.state.selektovaniNastavnik.id} />
                </div>
            </Dialog>
        );
    }

    renderDijalogZaKreiranjeNastavnika = () => {
        return (
            <Dialog
                open={this.state.prikaziDijalogKreirajNastavnika}
                onClose={() => this.setState({ prikaziDijalogKreirajNastavnika: false })}
                maxWidth="md"
            >
                <CloseButton onClick={() => { this.setState({ prikaziDijalogKreirajNastavnika: false }) }} />
                <div style={{ padding: '20px' }}>
                    <KreirajNovogNastavnika />
                </div>
            </Dialog>
        );
    }

    prikaziPodatkeOIzabranomNastavniku = () => {
        if (this.state.selektovaniNastavnik === null) {
            this.showMessage('Изаберите наставника', 'warn');
            return false;
        }

        this.setState({
            prikaziDijalogZaPrikazPodatakaONastavniku: true
        });
    }

    getTableHeader = () => {
        return (
            <div style={{ position: 'relative' }}>
                <div className="pull-left">
                    <TooltipButton
                        tooltip="Освежи приказ"
                        onClick={this.ucitajNastavnike}
                    >
                        {refreshIcon}
                    </TooltipButton>

                    <TooltipButton
                        tooltip="Креирај новог наставника"
                        onClick={() => { this.setState({ prikaziDijalogKreirajNastavnika: true }) }}
                    >
                        {createIcon}
                    </TooltipButton>


                    <TooltipButton
                        tooltip="Прикажи податке о наставнику"
                        onClick={this.prikaziPodatkeOIzabranomNastavniku}
                    >
                        {viewIcon}
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

    renderContent = () => {
        return (
            <React.Fragment>
                <DataTable
                    value={this.state.nastavnici}
                    paginator={true}
                    rows={10}
                    rowsPerPageOptions={[5, 10, 20]}
                    selectionMode="single"
                    selection={this.state.selektovaniNastavnik}
                    onSelectionChange={(ev) => this.setState({ selektovaniNastavnik: ev.data })}
                    resizableColumns={true}
                    globalFilter={this.state.pretragaFilter}
                    header={this.getTableHeader()}
                >
                    <Column field="id" header="ИД" sortable={true} style={{ width: '10%' }} />
                    <Column field="ime" header="Име" sortable={true} />
                    <Column field="prezime" header="Презиме" sortable={true} />
                    <Column field="brojRadneKnjizice" header="Број радне књижице" sortable={true} />
                </DataTable>

                {
                    this.renderDijalogZaKreiranjeNastavnika()
                }

                {
                    this.renderDijalogZaPrikazPodatakaONastavniku()
                }
            </React.Fragment>
        );
    }

    render() {

        const header = (
            <h2 className="text-center">Наставници</h2>
        );

        let content = null;

        if (this.state.loading) {
            content = (
                <div className="text-center">
                    {loadingIcon}
                </div>
            );
        } else if (this.state.hasError) {
            content = (
                <div className="text-center">
                    <h5>Дошло је до грешке приликом учитавања наставника</h5>
                </div>
            );
        } else {
            content = (
                <React.Fragment>
                    {
                        this.renderContent()
                    }
                </React.Fragment>
            );
        }

        return (
            <div>

                {header}

                {content}

                <Growl ref={(el) => this.growl = el} />

            </div>
        );
    }
}

export default PrikazSvihNastavnika;