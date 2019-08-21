import React from 'react';
import ReactDOM from 'react-dom';
import TreeEditor from './src/index';

const treeNode = document.getElementById('tree');

ReactDOM.render(<TreeEditor />, treeNode);

if (module.hot) {
  module.hot.dispose(() => {
    // eslint-disable-next-line no-console
    console.log('reload');
    window.location.reload();
  });
}
