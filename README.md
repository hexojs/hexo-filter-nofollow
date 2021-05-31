# hexo-filter-nofollow

[![npm version](https://badge.fury.io/js/hexo-filter-nofollow.svg)](https://www.npmjs.com/package/hexo-filter-nofollow)
[![npm license](https://img.shields.io/npm/l/hexo-filter-nofollow)](./LICENSE)
[![travis status](https://api.travis-ci.com/hexojs/hexo-filter-nofollow.svg?branch=master)](https://travis-ci.com/hexojs/hexo-filter-nofollow)
![npm download](https://img.shields.io/npm/dt/hexo-filter-nofollow)

Add nofollow attribute to all external links automatically.

`hexo-filter-nofollow` add `rel="noopener external nofollow noreferrer"` to all external links for security, privacy and SEO. [Read more](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).

## Installations

```bash
$ npm i hexo-filter-nofollow --save
```

## Options

```yaml
nofollow:
  enable: true
  field: site
  elements: 
    - 'a'
    - 'img'
  exclude:
    - '*.exclude1.com'
    - 'exclude2.com/path/*'
  rel:
    - 'external'
    - 'noreferrer'
    - 'nofollow'
    - 'noopener'
  referrerpolicy: 'no-referrer'
```

- **enable** - Enable the plugin. Default value is `true`.
- **field** - The scope you want the plugin to proceed, can be 'site' or 'post'. Default value is `site`.
  - 'post' - Only add nofollow attribute to external links in your post content
  - 'site' - Add nofollow attribute to external links of whole sites
- **elements** - The tag to be processed, currently only supports `<a>` and `<img>`.
- **include** - Include hostname. You can use `*` or `?` glob wildcards. If include is configured, other external links will not be processed. 
- **exclude** - Exclude hostname. You can use `*` or `?` glob wildcards.
  - `exclude1.com` does not apply to `www.exclude1.com` nor `en.exclude1.com`.
  - `*.exclude1.com` can be apply to `www.exclude1.com` or `en.exclude1.com`.
- **minimatch** - The glob wildcard is supported by [minimath](https://github.com/isaacs/minimatch), this field can be configured for it.
- **rel** - Configurable rel attribute value.
- **referrerpolicy** - Configurable referrerpolicy attribute value.
