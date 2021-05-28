/* global hexo */

'use strict';

hexo.config.nofollow = Object.assign({
  enable: true,
  field: 'site',
  elements: ['a'],
  include: [],
  exclude: [],
  rel: ['noopener', 'external', 'nofollow', 'noreferrer'],
  referrerpolicy: 'no-referrer'
}, hexo.config.nofollow);

const config = hexo.config.nofollow;

if (!config.enable) return;

if (config.field === 'post') {
  hexo.extend.filter.register('after_post_render', require('./lib/filter'));
} else {
  hexo.extend.filter.register('after_render:html', require('./lib/filter'));
}
