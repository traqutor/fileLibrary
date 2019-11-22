// Copied from https://github.com/bvaughn/react-virtualized/blob/04d1221133a1c59be24c8af90ae09e46000372b5/source/Table/defaultRowRenderer.js#L1

// TODO Make sure this component can be optimised using "shouldComponentUpdate"

import React, { Component } from 'react';
import { ContextMenuTrigger } from "react-contextmenu";
import { Draggable, Droppable } from 'react-beautiful-dnd';
import styled from 'styled-components';
import ReactDOM from 'react-dom';

class PortalAwareRow extends Component{
  render() {

    const {
      provided,
      snapshot,
      selection,
      lastSelected,
      rowData,
      loading,
      contextMenuId,
    } = this.props;

    const usePortal: boolean = snapshot.isDragging;

    const child: Node = (
      <RowDiv
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        inPortal={usePortal}
      >
        <Row
          {...this.props}
          selection={selection}
          lastSelected={lastSelected}
          loading={loading}
          contextMenuId={contextMenuId}
          isDragging={snapshot.isDragging}
        />
      </RowDiv>
    );

    if (!usePortal) {
      return child;
    }

    // if dragging - put the item in a portal
    const portal = document.getElementsByClassName('DragDropPortal')[0];
    return ReactDOM.createPortal(child, portal);
  }
}
const RowDiv = styled.div`
  /* used for positioning the after content */
  position: relative;
  /* stylelint-disable  comment-empty-line-before */
  /* add little portal indicator when in a portal */
  ${props =>
    props.inPortal
      ? `
    ::after {
      position: absolute;
      bottom: 0;
      right: 0;
      border: 3px solid black;
    }
  `
      : ''} /* stylelint-enable */;
`;

class Row extends Component {
  render() {
    /* eslint-disable  react/prop-types */
    const {
      className, // eslint-disable-line no-unused-vars
      columns,
      index,
      onRowClick,
      onRowDoubleClick,
      onRowMouseOut,
      onRowMouseOver,
      onRowRightClick,
      rowData,
      style,
      selection,
      lastSelected,
      loading,
      contextMenuId,
      hasTouch,
      isDragging,
    } = this.props;
    /* eslint-enable react/prop-types */

    const a11yProps = {};
    if (
      onRowClick ||
        onRowDoubleClick ||
        onRowMouseOut ||
        onRowMouseOver ||
        onRowRightClick
    ) {
      a11yProps['aria-label'] = 'row';
      a11yProps.tabIndex = 0;

      if (onRowClick) {
        a11yProps.onClick = event => onRowClick({ event, index, rowData });
      }
      if (onRowDoubleClick) {
        a11yProps.onDoubleClick = event =>
          onRowDoubleClick({ event, index, rowData });
      }
      if (onRowMouseOut) {
        a11yProps.onMouseOut = event => onRowMouseOut({ event, index, rowData });
      }
      if (onRowMouseOver) {
        a11yProps.onMouseOver = event => onRowMouseOver({ event, index, rowData });
      }
      if (onRowRightClick) {
        a11yProps.onContextMenu = event =>
          onRowRightClick({ event, index, rowData });
      }
    }

    const isSelected = selection.indexOf(rowData.id) !== -1;
    const isLastSelected = lastSelected === rowData.id;
    return (
      <ContextMenuTrigger id={contextMenuId} holdToDisplay={hasTouch ? 1000 : -1}>
        <div
          {...a11yProps}
          className={`
            ReactVirtualized__Table__row
            oc-fm--list-view__row
            ${(! loading && isSelected) ? 'oc-fm--list-view__row--selected' : ''}
            ${(!loading && isLastSelected) ? 'oc-fm--list-view__row--last-selected' : ''}
            ${(!loading && isDragging) ? 'oc-fm--list-view__row--dragging' : ''}
            ${loading ? 'oc-fm--list-view__row--loading' : ''}
          `}
          key={rowData.id}
          role="row"
          style={style}
        >
          { columns }
        </div>
      </ContextMenuTrigger>
    );
  }
}

export default ({ selection, lastSelected, loading, contextMenuId}) => (props) => {
  let elementToRender = (
    <Row
      {...props}
      selection={selection}
      lastSelected={lastSelected}
      loading={loading}
      contextMenuId={contextMenuId}
    />
  );
  if (props.rowData && props.rowData.id) {
    elementToRender = (
      <Droppable droppableId={`${props.rowData.type};${props.rowData.id}`} type="list">
        {(providedDroppable, snapshotDroppable) => (
          <div {...providedDroppable.droppableProps} ref={providedDroppable.innerRef} style={{ width: '100%', height: '38px', border: snapshotDroppable.draggingOverWith && props.rowData.type === 'dir' ? '1px solid black' : 'none'}}  >
            <Draggable draggableId={props.rowData.id} index={props.index} key={props.rowData.id}>
              {(provided, snapshot) => (
                <PortalAwareRow
                  {...props}
                  provided={provided}
                  snapshot={snapshot}
                  selection={selection}
                  lastSelected={lastSelected}
                  loading={loading}
                  contextMenuId={contextMenuId}
                />
              )}
            </Draggable>
          </div>
        )}
      </Droppable>
    );
  };

  return elementToRender;
};
