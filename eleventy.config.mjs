import dotenv from 'dotenv';
import { DateTime } from 'luxon';
import { EleventyHtmlBasePlugin } from '@11ty/eleventy';
import markdownIt from 'markdown-it';
import markdownItAnchor from 'markdown-it-anchor';
import markdownItAttrs from 'markdown-it-attrs';
import markdownItFootnote from 'markdown-it-footnote';
import markdownItTitle from 'markdown-it-title';
import slugify from "@sindresorhus/slugify";

dotenv.config();

export default async function(eleventyConfig) {
  eleventyConfig.setQuietMode(true);
  
  const markdownItOptions = {
      html: true,
      breaks: false,
      linkify: true,
      typographer: true,
  };
  // From Benyamin: https://github.com/binyamin/eleventy-garden/discussions/45
  const md = markdownIt(markdownItOptions)
  .use(markdownItAnchor)
  .use(markdownItAttrs)
  .use(markdownItTitle)
  
  eleventyConfig.setLibrary('md', md);
  
  eleventyConfig.addShortcode('year', () => `${new Date().getFullYear()}`);
  
  // Filters

  eleventyConfig.addFilter("indexOf", (arr, value) => {
    return arr.indexOf(value);
  });

  // https://stackoverflow.com/questions/66083103/how-to-generate-a-list-of-all-collections-in-11ty
  eleventyConfig.addCollection("tagsList", function(collectionsApi) {
      const tagsList = new Set();
      collectionsApi.getAll().map( item => {
          if (item.data.tags) { // handle pages that don't have tags
              item.data.tags.map( tag => tagsList.add(tag))
          }
      });
      return Array.from(tagsList);
  });
  
  // https://stackoverflow.com/questions/66083103/how-to-generate-a-list-of-all-collections-in-11ty
  eleventyConfig.addCollection("Drafts", function (collectionsApi) {
    return collectionsApi.getAll().filter(function (item) {
      return "draft" in item.data;
    });
  });
  
  eleventyConfig.addFilter("markdownify", string => {
    return md.renderInline(string)
  });
  
  // simple cache busting method from https://rob.cogit8.org/posts/2020-10-28-simple-11ty-cache-busting/
  eleventyConfig.addFilter("bust", (url) => {
    const [urlPart, paramPart] = url.split("?");
    const params = new URLSearchParams(paramPart || "");
    params.set("v", DateTime.local().toFormat("X"));
    return `${urlPart}?${params}`;
  });

  eleventyConfig.addFilter('typeOf', (obj) => {
    console.log(obj + typeof obj);
  })

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });
  
  eleventyConfig.addFilter("sitemapDateTimeString", (dateObj) => {
    const dt = DateTime.fromJSDate(dateObj, { zone: "utc" });
    if (!dt.isValid) {
      return "";
    }
    return dt.toISO();
  });

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  
  eleventyConfig.addFilter('log', (value) => {
    console.log('\x1b[37m', value);
    console.log('\x1b[0m', '');
  });
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  
  eleventyConfig.addFilter('warn', (value) => {
    console.warn('\x1b[33m', value);
    console.log('\x1b[0m', '');
  });
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  
  eleventyConfig.addFilter('error', (value) => {
    console.error('\x1b[31m', value);
    console.log('\x1b[0m', '');
  });
  
  // Server
  eleventyConfig.setServerOptions({
    liveReload: true
  });

  // Passthroughs. Specify individual instead of all, since sass is handled separately
  eleventyConfig.addPassthroughCopy({"src/robots.txt": "/robots.txt"});
  eleventyConfig.addPassthroughCopy({"src/static/img": "/assets/img"});

  // CSS Mapping
  if (process.env.ELEVENTY_ENV == 'dev') {
    eleventyConfig.addPassthroughCopy({"src/static/css": "/src/static/css"});
  }

  // Plugins
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  
  // Bundles
  eleventyConfig.addBundle("js");

  // WatchTargets
  eleventyConfig.addWatchTarget("src/static/css/");
  eleventyConfig.addWatchTarget("src/static/js/");
  eleventyConfig.setWatchThrottleWaitTime(1000); // in milliseconds
  
  eleventyConfig.addPreprocessor("drafts", "*", (data, content) => {
    if(data.draft && process.env.ELEVENTY_ENV === "prod") {
      return false;
    }
  });
  
  return {
    dir: {
      input: "src",
      output: "_site",
      layouts: "_layouts"
    },
    markdownTemplateEngine: "njk"
  }
};
