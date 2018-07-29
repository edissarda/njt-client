import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Table, TableHead, TableRow, TableCell, TableBody, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import axios from 'axios'
class Profil extends Component {

    state = {
        poruke: [],
    }

    componentDidMount() {
        this.ucitajPoruke();
    }

    ucitajPoruke = () => {
        axios.get('kontakt').then(resp => {
            if (resp.data.status === 200) {
                this.setState({
                    poruke: resp.data.data,
                });
            }
        }).catch();
    }

    renderPoruke = () => {

        let porukeContent = 'Тренутно нема порука';
        if (this.state.poruke.length > 0) {
            porukeContent = (
                <div>
                    {
                        this.state.poruke.map(poruka => {
                            return (
                                <ExpansionPanel key={poruka.vreme}>
                                    <ExpansionPanelSummary>
                                        <div style={{ width: '100%' }}>
                                            <div className="pull-left" style={{ color: 'red' }}>{poruka.ime}</div>
                                            <div className="pull-right">{poruka.datum} - {poruka.vreme}</div>
                                            <div style={{ display: 'block', clear: 'both' }}>{poruka.naslov}</div>
                                        </div>
                                    </ExpansionPanelSummary>

                                    <ExpansionPanelDetails>
                                        <div style={{ width: '100%', wordWrap: 'break-word' }}>
                                            {poruka.poruka}
                                        </div>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            );
                        })
                    }
                </div>
            )

        }

        return (
            <ExpansionPanel>
                <ExpansionPanelSummary>
                    Поруке
                </ExpansionPanelSummary>

                <ExpansionPanelDetails>
                    <div style={{ width: '100%' }}>
                        <h3 className="text-center">Поруке</h3>

                        {porukeContent}
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        );
    }

    renderContent = () => {
        if (this.props.admin === null) {
            return <div>Пријавите се</div>;
        }

        let prijave = null;
        if (this.props.admin.prijave.length > 0) {
            prijave = (
                <ExpansionPanel>
                    <ExpansionPanelSummary>
                        Последњих 10 пријава
                        </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className="col-6">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Датум пријаве</TableCell>
                                        <TableCell>Време пријаве</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {
                                        this.props.admin.prijave
                                            .slice(0, 10)
                                            .map((prijava, index) => {
                                                const selected = (index === 1);
                                                return (
                                                    <TableRow key={prijava.prijavaId} selected={selected}>
                                                        <TableCell>{prijava.datumPrijave}</TableCell>
                                                        <TableCell>{prijava.vremePrijave}</TableCell>
                                                    </TableRow>
                                                )
                                            })
                                    }
                                </TableBody>
                            </Table>
                        </div>

                    </ExpansionPanelDetails>
                </ExpansionPanel>
            );
        }

        return (
            <React.Fragment>
                <h2 className="text-center">
                    {this.props.admin.ime} {this.props.admin.prezime}
                </h2>

                {prijave}

                {this.renderPoruke()}
            </React.Fragment>
        )
    }

    render() {
        return (
            <div>

                {
                    this.renderContent()
                }

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        admin: state.admin,
    }
}

export default connect(mapStateToProps)(Profil);