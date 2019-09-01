/* global hexo */

'use strict';

if (hexo.config.nofollow && hexo.config.nofollow.enable) {
  const config = hexo.config.nofollow;

  if (!config.field) config.field = 'site';

  if (config.field === 'post') {
    hexo.extend.filter.register('after_post_render', require('./lib/filter'));
  } else {
    hexo.extend.filter.register('after_render:html', require('./lib/filter'));
  }
}
