#! /usr/bin/env node
const program = require('../../src/bin/program');

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import Main from '../components/Main';
import Command from '../components/Command';
import path from 'path';
import process from 'process';

const outputPath = 'docs/build';

function formatContent(id, title, content){
  return `---
id: ${id}
title: ${title}
---

${content}
`;
}

function writeMd(id, title, content) {
  const data = formatContent(id, title, content);
  writeFileSync(path.resolve(outputPath, `cli_${id}.md`), data);
}

function makeSidebar(program) {
  return { 
    'cli-api': {
      'OVERVIEW': ['cli_main'],
      'COMMANDS': program.commands.map(command => `cli_${command.name()}`)
    }
  };
}

function run() {
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath);
  }

  const main = renderToStaticMarkup(React.createElement(Main, { program }));
  writeMd('main', 'Entrypoint', main);

  program.commands.forEach(command => {
    const content = renderToStaticMarkup(React.createElement(Command, { command }));
    writeMd(command.name(), command.name(), content);
  });

  const sidebar = makeSidebar(program);
  writeFileSync(path.resolve(outputPath, 'sidebars.json'), JSON.stringify(sidebar, null, 2));
}

run();
console.log(`Docs generated in ${process.cwd()}/${outputPath}`)