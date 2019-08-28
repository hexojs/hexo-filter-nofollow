'use strict';

const urlFn = require('url');

function isExternal(url, config) {
  let exclude = config.nofollow.exclude;
  const data = urlFn.parse(url);
  const host = data.hostname;
  const sitehost = urlFn.parse(config.url).hostname || config.url;

  if (!data.protocol || !sitehost) return false;

  if (exclude && !Array.isArray(exclude)) exclude = [exclude];

  if (exclude && exclude.length) {
    for (let i of exclude) {
      if (sitehost === i) return false;
    }
  }

  if (host !== sitehost) return true;

  return false;
}

module.exports = function(data) {
  const hexo = this;
  const config = hexo.config;

  const filterExternal = (data) => {
    const noFollow = 'external nofollow noreferrer';

    // https://github.com/hexojs/hexo/pull/3685
    return data.replace(/<a.*?(href=['"](.*?)['"]).*?>/gi, (str, hrefStr, href) => {
      if (!isExternal(href, hexo.config)) return str;

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
