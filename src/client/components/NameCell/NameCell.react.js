import React from 'react';
import './NameCell.less';
import Svg from '@opuscapita/react-svg/lib/SVG';
import LoadingCell from '../LoadingCell';
import { Draggable } from 'react-beautiful-dnd';

export default ({loading, getIcon}) => (cellProps) => {

    if (loading) {
        return (<LoadingCell/>);
    }
    const {svg, fill} = getIcon(cellProps.rowData);

    const { id, name } = cellProps.rowData;

    const pictureFilesExtensions = ['gif', 'png', 'jpg', 'jpeg', 'bmp', 'svg'];

    function matchFileExtensionsForThumbnail(filename, extensions) {
        const extensionsRegExp = `(${extensions.join('|')})`;
        return extensions.some((o) => new RegExp(`^.*\.${extensionsRegExp}$`).test(filename.toLowerCase()));
    }

    return (
        <div className="oc-fm--name-cell">
            <div className="oc-fm--name-cell__icon">
                { matchFileExtensionsForThumbnail(name, pictureFilesExtensions) ?
                    <img
                        style={{ height: "40px", width: "40px" }}
                        src={`${window.StorageURL}w_40,h_40,c_scale/${id}` }
                    />
                        :
                    <Svg
                        className="oc-fm--name-cell__icon-image"
                        svg={svg}
                        style={{fill}}
                    />}
            </div>
            <div
                className="oc-fm--name-cell__title"
                title={cellProps.cellData || ''}
            >
                {cellProps.cellData || ''}
            </div>
        </div>
    );
}
