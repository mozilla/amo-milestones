import React from 'react';
import {
  colourIsLight,
  hexToRgb,
  markdown,
  sanitize,
} from './utils';


describe('Utils', () => {
  it('sanitize() sanitizes bad markup', () => {
    const sanitized = sanitize('<a href="javascript: alert(document.cookie)">foo</a>');
    expect(sanitized).not.toEqual(expect.stringMatching('javascript'));
  });

  it('sanitize() adds target="_blank" and rel="noopener noreferrer" to links', () => {
    const sanitized = sanitize('<a href="#whatevs">foo</a>');
    expect(sanitized).toEqual(expect.stringMatching('rel="noopener noreferrer"'));
    expect(sanitized).toEqual(expect.stringMatching('target="_blank"'));
  });

  it('markdown() creates markdown and linkifys', () => {
    const md = markdown.render('# Foo \n https://mozilla/com');
    expect(md).toEqual(expect.stringMatching('<h1>Foo</h1>'));
    expect(md).toEqual(expect.stringMatching('<a href="https://mozilla.com">https://mozilla.com</a>'));
  });

  it('hexToRgb() converts hex to rgb', () => {
    const { r, g, b } = hexToRgb('#ffffff');
    expect(r).toEqual(255);
    expect(g).toEqual(255);
    expect(b).toEqual(255);
  });

  it('isColorLight() returns useful values', () => {
    expect(colourIsLight('#ffffff')).toEqual(true);
    expect(colourIsLight('#000000')).not.toEqual(true);
  });

});
