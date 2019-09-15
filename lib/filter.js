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
    const noFollow = 'external nofollow noreferrer';

    return data.replace(/<a.*?(href=['"](.*?)['"]).*?>/gi, (str, hrefStr, href) => {
      if (!isExternal(href, config)) return str;

      if (/rel=/gi.test(str)) {
        return str.replace(/rel="(.*?)"/gi, (relStr, rel) => {
          // Avoid duplicate attribute
          if (!/(external|nofollow|noreferrer)/gi.test(rel)) relStr = relStr.replace(rel, `${rel} ${noFollow}`);
          return relStr;
        });
      }

      return str.replace(hrefStr, `${hrefStr} rel="${noFollow}"`);
    });
  };

  if (config.nofollow.field === 'post') {
    data.content = filterExternal(data.content);
  } else {
    data = filterExternal(data);
  }

  return data;
};
