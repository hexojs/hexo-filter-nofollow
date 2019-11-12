'use strict';

const { parse } = require('url');

function isExternal(url, config) {
  const exclude = config.nofollow.exclude;
  const data = parse(url);
  const host = data.hostname;
  const sitehost = parse(config.url).hostname || config.url;

  if (!data.protocol || !sitehost) return false;

  if (exclude && exclude.length) {
    for (const i of exclude) {
      if (host === i) return false;
    }
  }

  if (host !== sitehost) return true;

  return false;
}

module.exports = function(data) {
  const hexo = this;
  const config = hexo.config;

  const exclude = config.nofollow.exclude;
  if (exclude && !Array.isArray(exclude)) {
    config.nofollow.exclude = [exclude];
  }

  const filterExternal = (data) => {
    return data.replace(/<a.*?(href=['"](.*?)['"]).*?>/gi, (str, hrefStr, href) => {
      if (!isExternal(href, config)) return str;

      let noFollow = ['noopener', 'external', 'nofollow', 'noreferrer'];

      if (/rel=/gi.test(str)) {
        str = str.replace(/\srel="(.*?)"/gi, (relStr, rel) => {
          rel = rel.split(' ');
          noFollow.push(...rel);
          // De-duplicate
          noFollow = [...new Set(noFollow)];

          return '';
        });
      }

      return str.replace(hrefStr, `${hrefStr} rel="${noFollow.join(' ')}"`);
    });
  };

  if (config.nofollow.field === 'post') {
    data.content = filterExternal(data.content);
  } else {
    data = filterExternal(data);
  }

  return data;
};
