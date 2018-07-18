import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

class Profil extends Component {

    renderContent = () => {
        if (this.props.admin === null) {
            return <div>Пријавите се</div>;
        }

        let prijave = null;
        if (this.props.admin.prijave.length > 0) {
            prijave = (
                <div className="col-6">
                    <h5>Последњих 10 пријава</h5>
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
            );
        }

        return (
            <React.Fragment>
                <h2 className="text-center">
                    {this.props.admin.ime} {this.props.admin.prezime}
                </h2>

                {prijave}
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