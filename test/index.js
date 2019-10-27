'use strict';

require('chai').should();

describe('hexo-filter-nofollow', () => {
  const Hexo = require('hexo');
  const hexo = new Hexo();

  const nofollowFilter = require('../lib/filter').bind(hexo);

  hexo.config.url = 'https://example.com';
  hexo.config.nofollow = {};

  it('Default (field to "site")', () => {
    const content = [
      '# External link test',
      '1. External link',
      '<a href="https://hexo.io/">Hexo</a>',
      '2. External link with existed "rel" Attribute',
      '<a rel="license" href="https://github.com/hexojs/hexo-filter-nofollow/blob/master/LICENSE">Hexo</a>',
      '<a href="https://github.com/hexojs/hexo-filter-nofollow/blob/master/LICENSE" rel="license">Hexo</a>',
      '3. External link with existed "rel=noopenner", "rel=external" or "rel=noreferrer"',
      '<a rel="noopenner" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="noreferrer">Hexo</a>',
      '<a rel="noopenner noreferrer" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="external noreferrer">Hexo</a>',
      '4. External link with Other Attributes',
      '<a class="img" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" class="img">Hexo</a>',
      '5. Internal link',
      '<a href="/archives/foo.html">Link</a>',
      '6. Ignore links don\'t have "href" attribute',
      '<a>Anchor</a>'
    ].join('\n');

    const result = nofollowFilter(content);

    result.should.eql([
      '# External link test',
      '1. External link',
      '<a href="https://hexo.io/" rel="external nofollow noreferrer">Hexo</a>',
      '2. External link with existed "rel" Attribute',
      '<a rel="license external nofollow noreferrer" href="https://github.com/hexojs/hexo-filter-nofollow/blob/master/LICENSE">Hexo</a>',
      '<a href="https://github.com/hexojs/hexo-filter-nofollow/blob/master/LICENSE" rel="license external nofollow noreferrer">Hexo</a>',
      '3. External link with existed "rel=noopenner", "rel=external" or "rel=noreferrer"',
      '<a rel="noopenner external nofollow noreferrer" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="noreferrer">Hexo</a>',
      '<a rel="noopenner noreferrer" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="external noreferrer">Hexo</a>',
      '4. External link with Other Attributes',
      '<a class="img" href="https://hexo.io/" rel="external nofollow noreferrer">Hexo</a>',
      '<a href="https://hexo.io/" rel="external nofollow noreferrer" class="img">Hexo</a>',
      '5. Internal link',
      '<a href="/archives/foo.html">Link</a>',
      '6. Ignore links don\'t have "href" attribute',
      '<a>Anchor</a>'
    ].join('\n'));
  });

  it('Set field as "post"', () => {
    const content = [
      '# External link test',
      '1. External link',
      '<a href="https://hexo.io/">Hexo</a>',
      '2. External link with existed "rel" Attribute',
      '<a rel="license" href="https://github.com/hexojs/hexo-filter-nofollow/blob/master/LICENSE">Hexo</a>',
      '<a href="https://github.com/hexojs/hexo-filter-nofollow/blob/master/LICENSE" rel="license">Hexo</a>',
      '3. External link with existed "rel=noopenner", "rel=external" or "rel=noreferrer"',
      '<a rel="noopenner" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="noreferrer">Hexo</a>',
      '<a rel="noopenner noreferrer" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="external noreferrer">Hexo</a>',
      '4. External link with Other Attributes',
      '<a class="img" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" class="img">Hexo</a>',
      '5. Internal link',
      '<a href="/archives/foo.html">Link</a>',
      '6. Ignore links don\'t have "href" attribute',
      '<a>Anchor</a>',
      '7. Link with hash (#), mailto: , javascript: shouldn\'t be processed',
      '<a href="#top">Hexo</a>',
      '<a href="mailto:hi@hexo.io">Hexo</a>',
      '<a href="javascript:alert(\'Hexo is awesome!\');">Hexo</a>'
    ].join('\n');

    hexo.config.nofollow.field = 'post';

    const data = { content };
    const result = nofollowFilter(data).content;

    result.should.eql([
      '# External link test',
      '1. External link',
      '<a href="https://hexo.io/" rel="external nofollow noreferrer">Hexo</a>',
      '2. External link with existed "rel" Attribute',
      '<a rel="license external nofollow noreferrer" href="https://github.com/hexojs/hexo-filter-nofollow/blob/master/LICENSE">Hexo</a>',
      '<a href="https://github.com/hexojs/hexo-filter-nofollow/blob/master/LICENSE" rel="license external nofollow noreferrer">Hexo</a>',
      '3. External link with existed "rel=noopenner", "rel=external" or "rel=noreferrer"',
      '<a rel="noopenner external nofollow noreferrer" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="noreferrer">Hexo</a>',
      '<a rel="noopenner noreferrer" href="https://hexo.io/">Hexo</a>',
      '<a href="https://hexo.io/" rel="external noreferrer">Hexo</a>',
      '4. External link with Other Attributes',
      '<a class="img" href="https://hexo.io/" rel="external nofollow noreferrer">Hexo</a>',
      '<a href="https://hexo.io/" rel="external nofollow noreferrer" class="img">Hexo</a>',
      '5. Internal link',
      '<a href="/archives/foo.html">Link</a>',
      '6. Ignore links don\'t have "href" attribute',
      '<a>Anchor</a>',
      '7. Link with hash (#), mailto: , javascript: shouldn\'t be processed',
      '<a href="#top">Hexo</a>',
      '<a href="mailto:hi@hexo.io">Hexo</a>',
      '<a href="javascript:alert(\'Hexo is awesome!\');">Hexo</a>'
    ].join('\n'));

    hexo.config.nofollow.field = 'site';
  });

  it('Pass a string to hexo.config.nofollow.exclude', () => {
    const content = [
      '# Exclude link test',
      '1. External link',
      '<a href="https://hexo.io/">Hexo</a>',
      '2. Ignore links whose hostname is same as config',
      '<a href="https://example.com">Example Domain</a>',
      '3. Ignore links whose hostname is same as exclude',
      '<a href="https://example.org">Example Domain</a>'
    ].join('\n');

    hexo.config.nofollow.exclude = 'example.org';

    const result = nofollowFilter(content);

    result.should.eql([
      '# Exclude link test',
      '1. External link',
      '<a href="https://hexo.io/" rel="external nofollow noreferrer">Hexo</a>',
      '2. Ignore links whose hostname is same as config',
      '<a href="https://example.com">Example Domain</a>',
      '3. Ignore links whose hostname is same as exclude',
      '<a href="https://example.org">Example Domain</a>'
    ].join('\n'));
  });

  it('Pass a Array to hexo.config.nofollow.exclude', () => {
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

    hexo.config.nofollow.exclude = ['example.org', 'test.example.org'];

    const result = nofollowFilter(content);

    result.should.eql([
      '# Exclude link test',
      '1. External link',
      '<a href="https://hexo.io/" rel="external nofollow noreferrer">Hexo</a>',
      '2. Ignore links whose hostname is same as config',
      '<a href="https://example.com">Example Domain</a>',
      '3. Ignore links whose hostname is included in exclude',
      '<a href="https://example.org">Example Domain</a>',
      '<a href="https://test.example.org">Example Domain</a>'
    ].join('\n'));
  });
});
