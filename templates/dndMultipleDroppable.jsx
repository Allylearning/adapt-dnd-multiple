import React from 'react';
import { templates, classes } from 'core/js/reactHelpers';
import { Droppable } from './libraries/react-beautiful-dnd.min.js';

export default function DndMultipleDroppable({
  col: { _isCorrect, _options, droppableId, title },
  width,
  isEnabled,
  _allOptions,
  _itemMinHeight,
  _globals,
  onSelect,
  onPlace,
  selectedItem
}) {
  const minHeight = droppableId === '0' ? 'auto' : `${_allOptions.length * _itemMinHeight}rem`;
  const isPlacementTarget = selectedItem !== null && selectedItem.sourceId !== droppableId;

  return (
    <>
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            className={classes([
              'dnd-multiple__items',
              `dnd-multiple__items-${droppableId}`,
              _options.length === 0 && 'is-empty',
              _isCorrect && 'is-correct',
              !_isCorrect && _isCorrect !== undefined && 'is-incorrect'
            ])}
            style={{ width }}
            role='region'
            aria-label={`Drop area: ${title}`}
          >
            <div
              className='dnd-multiple__item-title'
              dangerouslySetInnerHTML={{ __html: title }}
              tabIndex={0}
            ></div>
            <div
              style={{ minHeight }}
              className='dnd-multiple__dropitem'
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {_options.map((option, index) => (
                <div key={option.id} className='dnd-multiple__item-wrapper'>
                  <templates.dndMultipleDraggable
                    key={option.id}
                    title={option.title}
                    _graphic={option._graphic}
                    index={index}
                    isEnabled={isEnabled}
                    isCorrect={option._isCorrect}
                    _globals={_globals}
                    onSelect={() => onSelect(option.title, droppableId)}
                    isSelected={selectedItem && selectedItem.itemId === option.title}
                  />
                </div>
              ))}
              {provided.placeholder}
              {isEnabled && isPlacementTarget && (
                <button
                  className='dnd-multiple__place-btn'
                  onClick={() => onPlace(droppableId)}
                >
                  Place selected item here
                </button>
              )}
            </div>
          </div>
        )}
      </Droppable>
    </>
  );
}