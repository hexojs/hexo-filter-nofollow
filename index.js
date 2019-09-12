/* global hexo */

'use strict';

const config = Object.assign({
  enable: true
}, hexo.config.nofollow);

if (!config.enable) return;

if (!config.field) config.field = 'site';

if (config.field === 'post') {
  hexo.extend.filter.register('after_post_render', require('./lib/filter'));
} else {
  hexo.extend.filter.register('after_render:html', require('./lib/filter'));
}
