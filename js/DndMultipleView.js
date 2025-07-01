import QuestionView from 'core/js/views/questionView';

class DndMultipleView extends QuestionView {
  preinitialize() {
    this.setItems = (...args) => this.model.setItems(...args);
  }

  setupQuestion() {}

  onQuestionRendered() {
    this.setReadyStatus();

    // Prevent scrolling when touching a .dnd-multiple__dropitem
    const preventScroll = (e) => e.preventDefault();

    this.$el.find('.dnd-multiple__dropitem').on('touchstart', function () {
      document.body.addEventListener('touchmove', preventScroll, { passive: false });
    });

    this.$el.find('.dnd-multiple__dropitem').on('touchend touchcancel', function () {
      document.body.removeEventListener('touchmove', preventScroll);
    });
  }
}

DndMultipleView.template = 'dndMultiple.jsx';

export default DndMultipleView;
