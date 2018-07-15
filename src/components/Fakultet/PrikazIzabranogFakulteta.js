import React, { Component } from 'react';
import axios from 'axios';
import { loadingIcon } from '../common/loading';
import PropTypes from 'prop-types';
import { Growl } from '../../../node_modules/primereact/components/growl/Growl';
import { Switch, Table, TableHead, TableRow, TableCell, TableBody, Paper, Dialog, Tooltip } from '@material-ui/core';
import { createIcon, refreshIcon } from '../common/icons';
import KreiranjeNovogRukovodioca from '../rukovodilac/KreiranjeNovogRukovodioca';
import CloseButton from '../common/CloseButton';
import TooltipButton from './../common/TooltipButton'

const uri = 'fakultet/'

class PrikazIzabranogFakulteta extends Component {

    state = {
        rukovodioci: [],
        fakultet: null,
        hasError: false,
        loading: true,
        prikaziDialogZaDodavanjeRukovodioca: false,
        filterSamoAktivni: false,
    }

    async componentDidMount() {
        await axios.get(uri + this.props.id)
            .then(resp => {
                if (resp.data.status === 200) {
                    this.setFakultet(resp.data.data);
                } else {
                    this.setHasError();
                }
            })
            .catch(() => {
                this.setHasError();
            });

        await axios.get(uri + this.props.id + '/rukovodioci')
            .then(resp => {
                if (resp.data.status === 200) {
                    this.setRukovodoci(resp.data.data);
                } else {
                    this.setHasError();
                }
            }).catch(() => {
                this.setHasError();
            });

        this.setState({
            loading: false,
        });
    }

    ucitajRukovodioce = async (samoAktivni = false) => {
        try {
            const resp = await axios.get(uri + this.props.id + '/rukovodioci?samoAktivni=' + samoAktivni);

            if (resp.data.status === 200) {
                this.setRukovodoci(resp.data.data);
            } else {
                this.setHasError();
            }
        } catch (error) {
            this.setHasError();
        }
    }

    setFakultet = (data) => {
        this.setState({
            fakultet: data,
        });
    }

    setHasError = () => {
        this.setState({
            hasError: true,
        });
    }

    setRukovodoci = (data) => {
        this.setState({
            rukovodioci: data,
            loading: false,
        });
    }

    getRukovodioci = () => {

        const common = (
            <div>
                <h4>Руководиоци</h4>
                <p>
                    <TooltipButton
                        tooltip='Постави новог руководиоца'
                        onClick={() => {
                            this.setState({
                                prikaziDialogZaDodavanjeRukovodioca: true,
                            });
                        }}
                    >
                        {createIcon}
                    </TooltipButton>

                    <TooltipButton
                        tooltip='Освежи руководиоце'
                        onClick={() => {
                            this.ucitajRukovodioce(this.state.filterSamoAktivni);
                        }}
                        >
                            {refreshIcon}
                        </TooltipButton>

                    <Tooltip title='Прикажи само активне руководиоце'>
                        <Switch
                            checkedIconcked={this.state.checkedF}
                            onChange={() => {
                                const noviFilter = !this.state.filterSamoAktivni;
                                this.setState({
                                    filterSamoAktivni: noviFilter,
                                })

                                this.ucitajRukovodioce(noviFilter);
                            }}
                            value="Само активни"
                            id="samoAktivni"
                            color="primary"
                        />
                    </Tooltip>
                </p>

                <Dialog
                    maxWidth={false}
                    fullWidth={true}
                    open={this.state.prikaziDialogZaDodavanjeRukovodioca}
                    onClose={() => {
                        this.setState({
                            prikaziDialogZaDodavanjeRukovodioca: false
                        });
                    }}
                >
                    <CloseButton onClick={() => {
                        this.setState({
                            prikaziDialogZaDodavanjeRukovodioca: false,
                        })
                    }} />
                    <div style={{ padding: '30px' }}>
                        <KreiranjeNovogRukovodioca fakultet={this.state.fakultet} />
                    </div>
                </Dialog>
            </div >
        );
        if (this.state.rukovodioci.length === 0) {
            return (
                <div>
                    <Paper style={{ marginBottom: '20px', marginTop: '20px', padding: '20px' }}>
                        {common}
                        Факултет нема руководиоца.
                    </Paper>
                </div>
            );
        }

        return (
            <div>
                <Paper style={{ marginBottom: '20px', marginTop: '20px', padding: '20px' }}>
                    {common}
                    < Table >
                        <TableHead>
                            <TableRow>
                                <TableCell>Име</TableCell>
                                <TableCell>Презиме</TableCell>
                                <TableCell>Датум од</TableCell>
                                <TableCell>Датум до</TableCell>
                                <TableCell>Звање</TableCell>
                                <TableCell>Титула</TableCell>
                                <TableCell>Тип руководиоца</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {this.state.rukovodioci.map(rukovodilac => {
                                return (
                                    <TableRow key={'tr-' + rukovodilac.id + Math.random()}>
                                        <TableCell>{rukovodilac.ime}</TableCell>
                                        <TableCell>{rukovodilac.prezime}</TableCell>
                                        <TableCell>{rukovodilac.datumOd}</TableCell>
                                        <TableCell>{rukovodilac.datumDo}</TableCell>
                                        <TableCell>{rukovodilac.hasOwnProperty('zvanje') ? rukovodilac.zvanje.naziv : 'НЕПОЗНАТО'}</TableCell>
                                        <TableCell>{(rukovodilac.hasOwnProperty('titula')) ? rukovodilac.titula.naziv : 'НЕПОТНАТО'}</TableCell>
                                        <TableCell>{(rukovodilac.hasOwnProperty('tipRukovodioca')) ? rukovodilac.tipRukovodioca.naziv : 'НЕПОЗНАТО'}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div >
        );
    }

    getPodaciOFakultetu = () => {
        const common = (<h5>Подаци о факултету</h5>);

        if (this.state.fakultet.podaci.length === 0) {
            return (
                <div>
                    <Paper style={{ marginBottom: '20px', marginTop: '20px', padding: '20px' }}>
                        {common}
                        Тренутно нема додатних података о факултету.
                    </Paper>
                </div>
            );
        }
        return (
            <div>
                <Paper style={{ marginBottom: '20px', padding: '20px' }}>
                    {common}
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Вредност</TableCell>
                                <TableCell>Тип</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {this.state.fakultet.podaci.map(podatak => {
                                return (
                                    <TableRow key={'tr-key-' + podatak.id}>
                                        <TableCell>{podatak.vrednost}</TableCell>
                                        <TableCell>{podatak.tipPodatka.naziv}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }

    render() {
        let content = null;

        if (this.state.loading) {
            content = (
                <div className="text-center">
                    Учитавање података је у току...
                    <div>{loadingIcon}</div>
                </div>
            );
        } else if (this.state.hasError) {
            content = 'Дошло је до грешке приликом приказивања података';
        } else {
            content = (
                <div>
                    <h3 className="text-center">{this.state.fakultet.naziv}</h3>
                    <Paper style={{ marginTop: '20px', marginBottom: '20px' }}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Матични број:</TableCell>
                                    <TableCell>{this.state.fakultet.maticniBroj}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Порески број:</TableCell>
                                    <TableCell>{this.state.fakultet.poreskiBroj}</TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Опис:</TableCell>
                                    <TableCell>
                                        <div style={{ wordWrap: 'break-word', maxWidth: '600px' }}>
                                            {this.state.fakultet.opis}
                                        </div>
                                    </TableCell>
                                </TableRow>

                                <TableRow>
                                    <TableCell>Врста организације:</TableCell>
                                    <TableCell>{this.state.fakultet.vrstaOrganizacije.naziv}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Научна област:</TableCell>
                                    <TableCell>{this.state.fakultet.naucnaOblast.naziv}</TableCell>
                                </TableRow>
                            </TableBody>

                        </Table>
                    </Paper>


                    {
                        this.getPodaciOFakultetu()
                    }



                    {
                        this.getRukovodioci()
                    }
                </div>
            );
        }

        return (
            <div>

                <Growl ref={(el) => this.growl = el}></Growl>

                {content}


            </div>
        );
    }
}

PrikazIzabranogFakulteta.propTypes = {
    id: PropTypes.number,
}

PrikazIzabranogFakulteta.defaultProps = {
    id: 0,
}

export default PrikazIzabranogFakulteta;