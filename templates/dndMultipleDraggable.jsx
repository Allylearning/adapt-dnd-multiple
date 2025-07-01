import { Draggable } from './libraries/react-beautiful-dnd.min.js';
import React from 'react';
import { templates, classes } from 'core/js/reactHelpers';

export default function DndMultipleDragable({
  title,
  _graphic,
  index,
  isEnabled,
  isCorrect,
  _globals,
  onSelect,
  isSelected
}) {
  const DragItemGraphic = () => {
    if (_graphic.isBackground) {
      return (
        <div
          className='dnd-multiple__dragitem__image-container'
          style={{
            backgroundImage: `url(${_graphic.src})`
          }}
        ></div>
      );
    }
    return (
      <templates.image
        {..._graphic}
        classNamePrefixes={['dnd-multiple__dragitem']}
        attributionClassNamePrefixes={['component', 'dnd-multiple']}
      />
    );
  };

  return (
    <Draggable draggableId={title} index={index} isDragDisabled={!isEnabled}>
      {(provided) => (
        <div
          className={classes([
            'dnd-multiple__dragitem',
            _graphic.isBackground && 'has-graphic-background',
            isCorrect && 'is-correct',
            !isCorrect && isCorrect !== undefined && 'is-incorrect',
            isSelected && 'is-selected'
          ])}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          aria-hidden={onSelect ? undefined : true}
          tabIndex={onSelect ? undefined : -1}
        >
          {DragItemGraphic()}
          <span
            className='dnd-multiple__dragitem__title'
            dangerouslySetInnerHTML={{ __html: title }}
          ></span>
          <div className='dnd-multiple__dragitem__state'>
            <div
              className='dnd-multiple__dragitem__icon dnd-multiple__dragitem__correct-icon'
              aria-label={_globals._accessibility._ariaLabels.correct}
            >
              <div className='icon' aria-hidden='true'></div>
            </div>
            <div
              className='dnd-multiple__dragitem__icon dnd-multiple__dragitem__incorrect-icon'
              aria-label={_globals._accessibility._ariaLabels.incorrect}
            >
              <div className='icon' aria-hidden='true'></div>
            </div>
          </div>
          {isEnabled && onSelect && (
            <button
              type='button'
              className={classes([
                'dnd-multiple__select-icon',
                isSelected && 'is-selected'
              ])}
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              aria-label={isSelected ? `${title} selected` : `Select ${title}`}
            >
              <span className='drag-icon' aria-hidden='true'></span>
            </button>
          )}
        </div>
      )}
    </Draggable>
  );
}
