import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { Button } from 'primereact/components/button/Button';
import { InputText } from 'primereact/components/inputtext/InputText';
import { refreshIcon, createIcon, editIcon, deleteIcon } from './icons';

class GenerickiPrikaz extends Component {

    state = {
        pretragaFilter: null,
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

        let content = (
            <React.Fragment>
                <div className="content-section implementation">
                    <DataTable
                        value={this.props.data}
                        paginator={true}
                        rows={10}
                        rowsPerPageOptions={[5, 10, 20]}
                        // selectionMode="single"
                        // selection={this.state.selektovanoZvanje}
                        // onSelectionChange={this.selektujZvanje}
                        resizableColumns={true}
                        globalFilter={this.state.pretragaFilter}
                        header={this.getTableHeader()}
                    >
                        {
                            this.props.columnNames.map(colName => {
                                return <Column field={colName} header={colName} sortable key={colName} />
                            })
                        }
                    </DataTable>
                </div>

            </React.Fragment>
        );

        return (
            <React.Fragment>
                <h2 className="text-center">
                    {this.props.title}
                </h2>

                {content}
            </React.Fragment>
        );
    }
}

GenerickiPrikaz.propTypes = {
    title: PropTypes.string,
    columnNames: PropTypes.arrayOf(PropTypes.string).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
}

GenerickiPrikaz.defaultProps = {
    title: 'Приказ шифарника',
}

export default GenerickiPrikaz;