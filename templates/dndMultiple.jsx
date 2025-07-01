import React, { useState, useEffect } from 'react';
import { templates } from 'core/js/reactHelpers';

import { DragDropContext } from './libraries/react-beautiful-dnd.min.js';

export default function DndMultiple(props) {
  const { _isEnabled, _isCorrectAnswerShown, _items, _correctItems, setItems } = props;

  const [dragItems, setDragItems] = useState(_items);
  const [selectedItem, setSelectedItem] = useState(null); // For Select + Place mode
  const [ariaLiveMessage, setAriaLiveMessage] = useState('');

  const countItems = Object.keys(dragItems).length;

  useEffect(() => {
    if (_isCorrectAnswerShown) {
      setDragItems(_correctItems);
    } else {
      if (!_isEnabled) {
        setDragItems(_items);
      }
    }
  }, [_isCorrectAnswerShown]);

  useEffect(() => {
    if (!_isEnabled) return;
    setItems(dragItems);
  }, [dragItems]);

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;
    if (source.droppableId === destination.droppableId && destination.index === source.index) return;

    const start = dragItems[source.droppableId];
    const end = dragItems[destination.droppableId];

    if (start === end) {
      const newList = [...start._options];
      const [moved] = newList.splice(source.index, 1);
      newList.splice(destination.index, 0, moved);

      const newCol = { ...start, _options: newList };
      setDragItems((state) => ({ ...state, [newCol.id]: newCol }));
      setAriaLiveMessage(`${moved.title} moved within ${start.title}`);
    } else {
      const newStartList = [...start._options];
      const [moved] = newStartList.splice(source.index, 1);
      const newEndList = [...end._options];
      newEndList.splice(destination.index, 0, moved);

      const newStartCol = { ...start, _options: newStartList };
      const newEndCol = { ...end, _options: newEndList };

      setDragItems((state) => ({
        ...state,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol
      }));
      setAriaLiveMessage(`${moved.title} moved to ${end.title}`);
    }
  };

  const handleSelect = (itemId, sourceId) => {
    if (selectedItem && selectedItem.itemId === itemId && selectedItem.sourceId === sourceId) {
      setSelectedItem(null);
      setAriaLiveMessage(`Unselected ${itemId}`);
    } else {
      setSelectedItem({ itemId, sourceId });
      setAriaLiveMessage(`Selected ${itemId}. Choose a drop area to place.`);
    }
  };

  const handlePlace = (targetId) => {
    if (!selectedItem) return;
    const { itemId, sourceId } = selectedItem;
    const start = dragItems[sourceId];
    const end = dragItems[targetId];

    const itemIndex = start._options.findIndex((o) => o.title === itemId);
    if (itemIndex === -1) return;

    const newStartList = [...start._options];
    const [moved] = newStartList.splice(itemIndex, 1);
    const newEndList = [...end._options, moved];

    const newStartCol = { ...start, _options: newStartList };
    const newEndCol = { ...end, _options: newEndList };

    setDragItems((state) => ({
      ...state,
      [newStartCol.id]: newStartCol,
      [newEndCol.id]: newEndCol
    }));
    setAriaLiveMessage(`${moved.title} placed in ${end.title}`);
    setSelectedItem(null);
  };

  return (
    <div className='component__inner dnd-multiple__inner'>
      <templates.header {...props} />
      <div className='dnd-multiple__widget component__widget'>
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.values(dragItems).map((col) => (
            <templates.dndMultipleDroppable
              {...props}
              col={col}
              key={col.id}
              width={`${100 / countItems}%`}
              isEnabled={_isEnabled}
              onSelect={handleSelect}
              onPlace={handlePlace}
              selectedItem={selectedItem}
            />
          ))}
        </DragDropContext>
      </div>
      <div className='btn__container'></div>
      <div className='sr-only' aria-live='polite'>{ariaLiveMessage}</div>
    </div>
  );
}