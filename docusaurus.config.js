// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Determine baseUrl based on build type
// For offline/local deployment, set OFFLINE_BUILD=true to use '/'
// For GitHub Pages, use '/argus-interactive-guide/'
const isOfflineBuild = process.env.OFFLINE_BUILD === 'true';
const baseUrl = isOfflineBuild ? '/' : '/argus-interactive-guide/';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Argus Video Training System',
  tagline: 'Complete guide for deploying, testing, and operating the Argus VTS',
  favicon: 'img/vts-guide/image29.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://fliight-engineering.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: baseUrl,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Fliight-Engineering', // Usually your GitHub org/user name.
  projectName: 'argus-interactive-guide', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Social card for link previews
      image: 'img/vts-guide/image29.png',
      colorMode: {
        defaultMode: 'dark',
        respectPrefersColorScheme: false,
        disableSwitch: false,
      },
      navbar: {
        title: 'Argus VTS Guide',
        logo: {
          alt: 'Argus VTS Logo',
          src: 'img/vts-guide/argus-logo.png',
        },
        items: [
          {
            type: 'html',
            position: 'right',
            value: `<img src="${baseUrl}img/vts-guide/fliight-logo-black.png" alt="FLIIGHT" class="fliight-logo-light" style="height: 28px; padding: 0 1rem;" /><img src="${baseUrl}img/vts-guide/fliight-logo-white.png" alt="FLIIGHT" class="fliight-logo-dark" style="height: 28px; padding: 0 1rem;" />`,
          },
          {
            type: 'html',
            position: 'right',
            value: `<div id="window-controls" style="display: flex; align-items: center; gap: 0.5rem;"><button id="minimize-btn" style="background: transparent; border: none; color: inherit; font-size: 1.5rem; font-weight: 300; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; transition: all 0.2s ease; padding: 0; line-height: 1;" title="Minimize">−</button><button id="close-btn" style="background: transparent; border: none; color: inherit; font-size: 1.5rem; font-weight: 300; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; border-radius: 4px; transition: all 0.2s ease; padding: 0; line-height: 1;" title="Close">×</button></div><script>(function(){function setupNavbar(){const rightItems=document.querySelector('.navbar__items--right');if(!rightItems)return;const items=Array.from(rightItems.children);let logoItem=null,themeItem=null,controlsItem=null;items.forEach(item=>{if(item.querySelector('.fliight-logo-light')||item.querySelector('.fliight-logo-dark')){logoItem=item;}else if(item.querySelector('button[class*="theme"]')||item.querySelector('[aria-label*="theme"]')||item.querySelector('[aria-label*="Theme"]')){themeItem=item;}else if(item.querySelector('#window-controls')){controlsItem=item;}});if(logoItem)logoItem.setAttribute('data-order','1');if(themeItem)themeItem.setAttribute('data-order','2');if(controlsItem)controlsItem.setAttribute('data-order','3');const minimize=document.getElementById('minimize-btn');const close=document.getElementById('close-btn');if(minimize&&close){if(window.electronAPI){minimize.addEventListener('click',()=>window.electronAPI.minimize());close.addEventListener('click',()=>window.electronAPI.close());}minimize.addEventListener('mouseenter',function(){this.style.background='rgba(0,0,0,0.1)'});minimize.addEventListener('mouseleave',function(){this.style.background='transparent'});close.addEventListener('mouseenter',function(){this.style.background='rgba(0,0,0,0.1)'});close.addEventListener('mouseleave',function(){this.style.background='transparent'});}}if(typeof window!=='undefined'){if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',function(){setTimeout(setupNavbar,300);});}else{setTimeout(setupNavbar,300);}}})();</script>`,
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Fliight-Technologies.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
