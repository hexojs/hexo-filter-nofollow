'use strict';

require('chai').should();

describe('hexo-filter-nofollow', () => {
  const Hexo = require('hexo');
  const hexo = new Hexo();

  const nofollowFilter = require('../lib/filter').bind(hexo);

  hexo.config.url = 'https://example.com';
  hexo.config.nofollow = { include: [], exclude: [], elements: ['a', 'img'], rel: ['noopener', 'external', 'nofollow', 'noreferrer'], referrerpolicy: 'no-referrer' };

  describe('Default', () => {
    const content = [
      '# External link test',
      '1. External link',
      '<a href="https://hexo.io/">Hexo</a>',
      '<img src="https://hexo.io/">Hexo</img>',
      '2. External link with existed "rel" Attribute',
      '<a rel="license" href="https://hexo.io">Hexo</a>',
      '<a href="https://hexo.io" rel="license">Hexo</a>',
      '<img src="https://hexo.io" rel="license">Hexo</img>',
      '<img rel="license" src="https://hexo.io" rel="license">Hexo</img>',
      '3. External link with existing "rel=noopener", "rel=external" or "rel=noreferrer"',
      '<a rel="noopener" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="noreferrer">Hexo</a>',
      '<a rel="noopener noreferrer" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="external noreferrer">Hexo</a>',
      '<img rel="noopener" src="https://hexo.io/">Hexo</img>',
      '<img src="https://hexo.io/" rel="noreferrer">Hexo</img>',
      '<img rel="noopener noreferrer" src="https://hexo.io/">Hexo</img>',
      '<img src="https://hexo.io/" rel="external noreferrer">Hexo</img>',
      '4. External link with Other Attributes',
      '<a class="img" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" class="img">Hexo</a>',
      '<img class="img" src="https://hexo.io/">Hexo</img>',
      '<img src="https://hexo.io/" class="img">Hexo</img>',
      '5. Internal link',
      '<a href="/archives/foo.html">Link</a>',
      '<img src="/archives/foo.html">Link</img>',
      '6. Ignore links don\'t have "href" attribute',
      '<a>Anchor</a>',
      '<img>Anchor</img>'
    ].join('\n');

    const expected = [
      '# External link test',
      '1. External link',
      '<a href="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</a>',
      '<img src="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</img>',
      '2. External link with existed "rel" Attribute',
      '<a href="https://hexo.io" rel="noopener external nofollow noreferrer license" referrerpolicy="no-referrer">Hexo</a>',
      '<a href="https://hexo.io" rel="noopener external nofollow noreferrer license" referrerpolicy="no-referrer">Hexo</a>',
      '<img src="https://hexo.io" rel="noopener external nofollow noreferrer license" referrerpolicy="no-referrer">Hexo</img>',
      '<img src="https://hexo.io" rel="noopener external nofollow noreferrer license" referrerpolicy="no-referrer">Hexo</img>',
      '3. External link with existing "rel=noopener", "rel=external" or "rel=noreferrer"',
      '<a href="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</a>',
      '<a href="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</a>',
      '<a href="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</a>',
      '<a href="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</a>',
      '<img src="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</img>',
      '<img src="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</img>',
      '<img src="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</img>',
      '<img src="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</img>',
      '4. External link with Other Attributes',
      '<a class="img" href="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</a>',
      '<a href="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer" class="img">Hexo</a>',
      '<img class="img" src="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</img>',
      '<img src="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer" class="img">Hexo</img>',
      '5. Internal link',
      '<a href="/archives/foo.html">Link</a>',
      '<img src="/archives/foo.html">Link</img>',
      '6. Ignore links don\'t have "href" attribute',
      '<a>Anchor</a>',
      '<img>Anchor</img>'
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

  describe('Include & Pattern', () => {
    const content = [
      '# Include & Pattern link test',
      '1. External link',
      '<a href="https://hexo.io/">Hexo</a>',
      '2. Ignore links whose hostname is not match glob pattern',
      '<a href="https://example.com">Example Domain</a>',
      '3. Ignore links whose hostname is included in glob pattern',
      '<a href="https://demo.example.org">Example Domain</a>',
      '<a href="https://test.example.org">Example Domain</a>'
    ].join('\n');

    it('String', () => {
      hexo.config.nofollow.include = ['hexo.io', '*.example.org'];

      const result = nofollowFilter(content);

      result.should.eql([
        '# Include & Pattern link test',
        '1. External link',
        '<a href="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</a>',
        '2. Ignore links whose hostname is not match glob pattern',
        '<a href="https://example.com">Example Domain</a>',
        '3. Ignore links whose hostname is included in glob pattern',
        '<a href="https://demo.example.org" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Example Domain</a>',
        '<a href="https://test.example.org" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Example Domain</a>'
      ].join('\n'));
    });

    it('Array', () => {
      hexo.config.nofollow.include = 'hexo.io';
      hexo.config.nofollow.exclude = ['example.org', '*.example.org'];

      const result = nofollowFilter(content);

      result.should.eql([
        '# Include & Pattern link test',
        '1. External link',
        '<a href="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</a>',
        '2. Ignore links whose hostname is not match glob pattern',
        '<a href="https://example.com">Example Domain</a>',
        '3. Ignore links whose hostname is included in glob pattern',
        '<a href="https://demo.example.org">Example Domain</a>',
        '<a href="https://test.example.org">Example Domain</a>'
      ].join('\n'));
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
      hexo.config.nofollow.include = [];
      hexo.config.nofollow.exclude = 'example.org';

      const result = nofollowFilter(content);

      result.should.eql([
        '# Exclude link test',
        '1. External link',
        '<a href="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</a>',
        '2. Ignore links whose hostname is same as config',
        '<a href="https://example.com">Example Domain</a>',
        '3. Ignore links whose hostname is included in exclude',
        '<a href="https://example.org">Example Domain</a>',
        '<a href="https://test.example.org" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Example Domain</a>'
      ].join('\n'));
    });

    it('Array', () => {
      hexo.config.nofollow.exclude = ['example.org', 'test.example.org'];

      const result = nofollowFilter(content);

      result.should.eql([
        '# Exclude link test',
        '1. External link',
        '<a href="https://hexo.io/" rel="noopener external nofollow noreferrer" referrerpolicy="no-referrer">Hexo</a>',
        '2. Ignore links whose hostname is same as config',
        '<a href="https://example.com">Example Domain</a>',
        '3. Ignore links whose hostname is included in exclude',
        '<a href="https://example.org">Example Domain</a>',
        '<a href="https://test.example.org">Example Domain</a>'
      ].join('\n'));
    });
  });
});
