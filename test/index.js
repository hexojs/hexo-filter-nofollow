'use strict';

require('chai').should();
const Hexo = require('hexo');
const { deepMerge } = require('hexo-util');

describe('hexo-filter-nofollow', () => {
  const hexo = new Hexo();
  const nofollowFilter = require('../lib/filter').bind(hexo);

  hexo.config.url = 'https://example.com';
  const defaultCfg = deepMerge(hexo.config, {
    nofollow: {
      enable: true,
      field: 'site',
      exclude: [],
      noreferrer: false
    }
  });

  beforeEach(() => {
    hexo.config = deepMerge({}, defaultCfg);
  });

  describe('Default', () => {
    const content = [
      '# External link test',
      '1. External link',
      '<a href="https://hexo.io/">Hexo</a>',
      '2. External link with existed "rel" Attribute',
      '<a rel="license" href="https://github.com/hexojs/hexo-filter-nofollow/blob/master/LICENSE">Hexo</a>',
      '<a href="https://github.com/hexojs/hexo-filter-nofollow/blob/master/LICENSE" rel="license">Hexo</a>',
      '3. External link with existing "rel=noopener", "rel=external" or "rel=noreferrer"',
      '<a rel="noopener" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="noreferrer">Hexo</a>',
      '<a rel="noopener noreferrer" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="external noreferrer">Hexo</a>',
      '4. External link with Other Attributes',
      '<a class="img" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" class="img">Hexo</a>',
      '5. Internal link',
      '<a href="/archives/foo.html">Link</a>',
      '6. Ignore links don\'t have "href" attribute',
      '<a>Anchor</a>'
    ].join('\n');

    const expected = [
      '# External link test',
      '1. External link',
      '<a href="https://hexo.io/" rel="noopener external nofollow">Hexo</a>',
      '2. External link with existed "rel" Attribute',
      '<a href="https://github.com/hexojs/hexo-filter-nofollow/blob/master/LICENSE" rel="noopener external nofollow license">Hexo</a>',
      '<a href="https://github.com/hexojs/hexo-filter-nofollow/blob/master/LICENSE" rel="noopener external nofollow license">Hexo</a>',
      '3. External link with existing "rel=noopener", "rel=external" or "rel=noreferrer"',
      '<a href="https://hexo.io/" rel="noopener external nofollow">Hexo</a>',
      '<a href="https://hexo.io/" rel="noopener external nofollow noreferrer">Hexo</a>',
      '<a href="https://hexo.io/" rel="noopener external nofollow noreferrer">Hexo</a>',
      '<a href="https://hexo.io/" rel="noopener external nofollow noreferrer">Hexo</a>',
      '4. External link with Other Attributes',
      '<a class="img" href="https://hexo.io/" rel="noopener external nofollow">Hexo</a>',
      '<a href="https://hexo.io/" rel="noopener external nofollow" class="img">Hexo</a>',
      '5. Internal link',
      '<a href="/archives/foo.html">Link</a>',
      '6. Ignore links don\'t have "href" attribute',
      '<a>Anchor</a>'
    ].join('\n');

    it('Default to field = "site"', () => {
      const result = nofollowFilter(content);

      result.should.eql(expected);
    });

    it('field = "post"', () => {
      hexo.config.nofollow.field = 'post';

      const data = { content };
      const result = nofollowFilter(data).content;

      result.should.eql(expected);

      hexo.config.nofollow.field = 'site';
    });
  });

  describe('Exclude', () => {
    const content = [
      '# Exclude link test',
      '1. External link',
      '<a href="https://hexo.io/">Hexo</a>',
      '2. Ignore links whose hostname is same as config',
      '<a href="https://example.com">Example Domain</a>',
      '3. Ignore links whose hostname is included in exclude',
      '<a href="https://example.org">Example Domain</a>',
      '<a href="https://test.example.org">Example Domain</a>'
    ].join('\n');

    it('String', () => {
      hexo.config.nofollow.exclude = 'example.org';

      const result = nofollowFilter(content);

      result.should.eql([
        '# Exclude link test',
        '1. External link',
        '<a href="https://hexo.io/" rel="noopener external nofollow">Hexo</a>',
        '2. Ignore links whose hostname is same as config',
        '<a href="https://example.com">Example Domain</a>',
        '3. Ignore links whose hostname is included in exclude',
        '<a href="https://example.org">Example Domain</a>',
        '<a href="https://test.example.org" rel="noopener external nofollow">Example Domain</a>'
      ].join('\n'));
    });

    it('Array', () => {
      hexo.config.nofollow.exclude = ['example.org', 'test.example.org'];

      const result = nofollowFilter(content);

      result.should.eql([
        '# Exclude link test',
        '1. External link',
        '<a href="https://hexo.io/" rel="noopener external nofollow">Hexo</a>',
        '2. Ignore links whose hostname is same as config',
        '<a href="https://example.com">Example Domain</a>',
        '3. Ignore links whose hostname is included in exclude',
        '<a href="https://example.org">Example Domain</a>',
        '<a href="https://test.example.org">Example Domain</a>'
      ].join('\n'));
    });
  });

  describe('noreferrer', () => {
    it('Default', () => {
      const result = nofollowFilter('<a href="https://hexo.io/">Hexo</a>');

      result.should.eql('<a href="https://hexo.io/" rel="noopener external nofollow">Hexo</a>');
    });

    it('Retain original noreferrer', () => {
      const result = nofollowFilter('<a href="https://hexo.io/" rel="noreferrer">Hexo</a>');

      result.should.eql('<a href="https://hexo.io/" rel="noopener external nofollow noreferrer">Hexo</a>');
    });

    it('Enable', () => {
      hexo.config.nofollow.noreferrer = true;
      const result = nofollowFilter('<a href="https://hexo.io/">Hexo</a>');

      result.should.eql('<a href="https://hexo.io/" rel="noopener external nofollow noreferrer">Hexo</a>');
    });

  });
});
