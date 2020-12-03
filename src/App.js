import React from 'react';
import {Editor, EditorState, RichUtils, Modifier} from 'draft-js';

const customStyleMap = {
  code: {
    backgroundColor: '#ccc',
    padding: '3px',
    borderRadius: '3px',
    fontFamily: 'source-code-pro, Menlo, Monaco, Consolas, Courier New, monospace'
  },
 };

const MarkButton = ({ editorState, format, toggleMark }) => {
  const isMarkActive = () => {
    const inlineStyle = editorState.getCurrentInlineStyle();
    return inlineStyle.has(format);
  }
  return (
    <div
      className={`button ${isMarkActive(editorState, format) ? 'active' : ''}`}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(format)
      }}
    >
      code
    </div>
  )
}


class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty()
    };
    this.onChangeCallback = editorState => this.setState({ editorState });
  }

  onChangeCallback = (editorState) => {
    this.setState({editorState});
  }

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      this.onChangeCallback(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  toggleMark = (style) => {
    const {editorState} = this.state;
    const selection = editorState.getSelection();

    // новое состояние
    let nextEditorState = EditorState.push(
      editorState,
      editorState.getCurrentContent(),
      'change-inline-style'
    );

    const currentStyle = editorState.getCurrentInlineStyle();

    // если текст не выделен, включим или отключим формат
    if (selection.isCollapsed()) {
      nextEditorState = currentStyle.reduce((state, style) => {
        return RichUtils.toggleInlineStyle(state, style);
      }, nextEditorState);
    }

    // применим формат
    if (!currentStyle.has(style)) {
      nextEditorState = RichUtils.toggleInlineStyle(
        nextEditorState,
        style
      );
    }

    this.onChangeCallback(nextEditorState);
  }

  buttonClick = (event) => {
    event.preventDefault()
    this.toggleMark();
  }

  render () {
      return (
      <div>
        <div className="toolbar">
          <MarkButton
            format="code"
            editorState={this.state.editorState}
            toggleMark={this.toggleMark} />
        </div>
        <div className="editor">
        <Editor 
          customStyleMap={customStyleMap}
          handleKeyCommand={this.handleKeyCommand}
          editorState={this.state.editorState} 
          onChange={this.onChangeCallback} />
        </div>
      </div>
    );
  }
}

export default App;