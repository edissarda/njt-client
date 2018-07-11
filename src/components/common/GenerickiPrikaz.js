import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DataTable } from 'primereact/components/datatable/DataTable';
import { Column } from 'primereact/components/column/Column';
import { refreshIcon, createIcon, editIcon, deleteIcon, searchIcon } from './icons';
import TooltipButton from './../common/TooltipButton';
import { TextField } from '@material-ui/core';

class GenerickiPrikaz extends Component {

    state = {
        pretragaFilter: null,
    }

    getTableHeader = () => {
        return (
            <div style={{ position: 'relative' }}>
                <div className="pull-left">
                    <TooltipButton
                        tooltip="Освежи приказ"
                        onClick={() => { }}
                    >
                        {refreshIcon}
                    </TooltipButton>

                    <TooltipButton
                        tooltip="Креирај"
                        onClick={() => { }}
                    >
                        {createIcon}
                    </TooltipButton>

                    <TooltipButton
                        tooltip="Измени"
                        onClick={() => { }}
                    >
                        {editIcon}
                    </TooltipButton>

                    <TooltipButton
                        tooltip="Обриши"
                        onClick={() => { }}
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
                            endAdornment: searchIcon
                        }}
                    />
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