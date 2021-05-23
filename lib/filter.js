'use strict';

const { parse } = require('url');
const { Minimatch, filter } = require('minimatch');

/**
 * Check whether the url is an external link
 * @param {string} url 
 * @param {object} config 
 * @returns boolean
 */
function isExternal(url, config) {
  const { includeGlobs, excludeGlobs } = config.nofollow;
  const data = parse(url);
  const { hostname, path } = data;
  const sitehost = parse(config.url).hostname || config.url;

  if (!data.protocol || !hostname || !sitehost) return false;

  const target = hostname + path;

  if (excludeGlobs && excludeGlobs.length) {
    for (const glob of excludeGlobs) {
      if (glob.match(target)) return false;
    }
  }

  if (includeGlobs && includeGlobs.length) {
    for (const glob of includeGlobs) {
      if (glob.match(target)) return true;
    }
  }

  return hostname !== sitehost;
}

/**
 * Add the nofollow attribute to the tag
 * @param {string} tagStr 
 * @param {string} urlAttrStr 
 * @returns new tag string
 */
function nofollow(tagStr, urlAttrStr) {
  let noFollow = ['noopener', 'external', 'nofollow', 'noreferrer'];

  if (/rel=/gi.test(tagStr)) {
    tagStr = tagStr.replace(/\srel="(.*?)"/gi, (relStr, rel) => {
      rel = rel.split(' ');
      noFollow.push(...rel);
      // De-duplicate
      noFollow = [...new Set(noFollow)];

      return '';
    });
  }
  return tagStr.replace(urlAttrStr, `${urlAttrStr} rel="${noFollow.join(' ')}"`);
}

module.exports = function (data) {
  const hexo = this;
  const config = hexo.config;

  const { elements, include, exclude, minimatch } = config.nofollow;
  if (elements && !Array.isArray(elements)) {
    config.nofollow.elements = [elements];
  }
  if (include && !Array.isArray(include)) {
    config.nofollow.include = [include];
  }
  if (exclude && !Array.isArray(exclude)) {
    config.nofollow.exclude = [exclude];
  }

  config.nofollow.includeGlobs = config.nofollow.include.map(pattern => new Minimatch(pattern, minimatch));
  config.nofollow.excludeGlobs = config.nofollow.exclude.map(pattern => new Minimatch(pattern, minimatch));

  const filterATagHrefExternal = data => {
    return data.replace(/<a.*?(href=['"](.*?)['"]).*?>/gi, (aTagSrc, hrefAttrStr, href) => {
      if (!isExternal(href, config)) return aTagSrc;
      return nofollow(aTagSrc, hrefAttrStr);
    });
  };

  const filterImgTagSrcExternal = data => {
    return data.replace(/<img.*?(src=['"](.*?)['"]).*?>/gi, (imgTagSrc, srcAttrStr, src) => {
      if (!isExternal(src, config)) return imgTagSrc;
      return nofollow(imgTagSrc, srcAttrStr);
    });
  };

  const filterExternal = data => {
    if (config.nofollow.elements.includes('a'))
      data = filterATagHrefExternal(data);
    if (config.nofollow.elements.includes('img')) {
      data = filterImgTagSrcExternal(data);
    }
    return data;
  }

  if (config.nofollow.field === 'post') {
    data.content = filterExternal(data.content);
  } else {
    data = filterExternal(data);
  }

  return data;
};


