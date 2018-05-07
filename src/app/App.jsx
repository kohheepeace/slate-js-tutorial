import React from 'react';
import CssBaseline from 'material-ui/CssBaseline';

import { Value } from 'slate';
import { Editor, getEventTransfer } from 'slate-react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import { blue } from 'material-ui/colors';

import Navbar from './Navbar';
import s from './App.scss';

import renderMark from '../slate-editor/renderer/renderMark';
import renderNode from '../slate-editor/renderer/renderNode';
import plugins from '../slate-editor/plugins/index';
import schema from '../slate-editor/schema/index';
import initialJson from '../slate-editor/initialValue.json';
import onPasteText from '../slate-editor/helpers/onPasteText';
import onPasteHtml from '../slate-editor/helpers/onPasteHtml';
import HoveringMenu from '../slate-editor/components/HoveringMenu';

const theme = createMuiTheme({
  palette: {
    primary: { main: blue[500] },
    secondary: { main: '#EF5350' },
  },
});

const existingValue = JSON.parse(window.localStorage.getItem('slate-content'));
const initialValue = Value.fromJSON(existingValue || initialJson);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: initialValue,
    };
  }

  onChange = ({ value }) => {
    if (value.document !== this.state.value.document) {
      const content = JSON.stringify(value.toJSON());
      window.localStorage.setItem('slate-content', content);
    }

    this.setState({ value });
  }

  onPaste = (e, change) => {
    const transfer = getEventTransfer(e);
    const { type } = transfer;
    switch (type) {
      // case 'files': return this.handleOnDrop(files);
      case 'text': return onPasteText(e, change);
      case 'html': return onPasteHtml(e, change);
      default: return null;
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div className={s.root}>
          <CssBaseline />
          <Navbar
            value={this.state.value}
            onChange={value => this.onChange(value)}
          />
          <HoveringMenu
            value={this.state.value}
            onChange={this.onChange}
          />
          <DragDropContextProvider backend={HTML5Backend}>
            <div className={s.container}>
              <div className={s.editor}>
                <Editor
                  style={{ paddingBottom: 'calc(25rem - 100px)' }}
                  value={this.state.value}
                  onChange={this.onChange}
                  onPaste={this.onPaste}
                  renderMark={renderMark}
                  renderNode={renderNode}
                  plugins={plugins}
                  schema={schema}
                />
              </div>
            </div>
          </DragDropContextProvider>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
