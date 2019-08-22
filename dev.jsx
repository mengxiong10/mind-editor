import React from 'react';
import ReactDOM from 'react-dom';
import TreeEditor from './src/index';

const treeNode = document.getElementById('tree');

const test = (
  <TreeEditor>
    <div>ok</div>
  </TreeEditor>
);

ReactDOM.render(test, treeNode);

if (module.hot) {
  module.hot.dispose(() => {
    // eslint-disable-next-line no-console
    console.log('reload');
    window.location.reload();
  });
}
