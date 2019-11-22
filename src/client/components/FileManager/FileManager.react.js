import PropTypes from 'prop-types';
import React, { Component, Children } from 'react';
import './FileManager.less';

import { DragDropContext } from 'react-beautiful-dnd';

const propTypes = {
  className: PropTypes.string
};
const defaultProps = {};

export default
class FileManager extends Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  handleOnDragEnd = (result) => {
    const { api, apiOptions } = this.props.children.props;
    const destinationType = result.destination.droppableId.split(';')[0];
    const destinationGuid = result.destination.droppableId.split(';')[1];
    const sourceGuid = result.source.droppableId.split(';')[1];
    if (destinationType === 'dir') {
      api.changeDirectory(apiOptions, sourceGuid, destinationGuid);
    }
  };

  isMoved(guid) {
    return this.state.moved.indexOf(guid) !== -1;
  }

  render() {
    const { children, className, ...restProps } = this.props;
    return (
      <div data-test-id="filemanager" className={`oc-fm--file-manager ${className || ''}`} {...restProps}>
        <DragDropContext onDragEnd = {this.handleOnDragEnd}>
          <div className="oc-fm--file-manager__navigators">
            {Children.toArray(children).map((child, i) => (
              <div key={i} className="oc-fm--file-manager__navigator">
                {child}
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>
    );
  }
}

FileManager.propTypes = propTypes;
FileManager.defaultProps = defaultProps;
