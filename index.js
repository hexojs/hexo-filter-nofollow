/* global hexo */

'use strict';

hexo.config.nofollow = Object.assign({
  enable: true,
  field: 'site',
  exclude: []
}, hexo.config.nofollow);

let exclude = hexo.config.nofollow.exclude;
if (exclude && !Array.isArray(exclude)) {
  exclude = [exclude];
  hexo.config.nofollow.exclude = exclude;
}

const config = hexo.config.nofollow;

if (!config.enable) return;

if (config.field === 'post') {
  hexo.extend.filter.register('after_post_render', require('./lib/filter'));
} else {
  hexo.extend.filter.register('after_render:html', require('./lib/filter'));
}
