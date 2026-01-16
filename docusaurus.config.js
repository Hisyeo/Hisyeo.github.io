// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

import { themes } from 'prism-react-renderer';
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Hîsyêô',
  tagline: 'A world language & community',
  favicon: 'img/hisyeo.ico',
  url: 'https://hisyeo.github.io',
  baseUrl: '/',
  organizationName: 'Hisyeo',
  projectName: 'Hisyeo.github.io',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'log'
    }
  },
  onBrokenLinks: 'log',

  plugins: [
    [ require.resolve('docusaurus-lunr-search'), {
      languages: ['en', 'fr',], // language codes
      excludeRoutes: [
        '/hyo/docs/Glossary',
      ],
    } ],
    [ require.resolve('docusaurus-plugin-llms'), {
      title: 'Hîsyêô',
      description: 'Documentation of Hîsyêô language & culture',
      docsDir: 'docs',
      includeBlog: false,
      excludeImports: true,
      removeDuplicateHeadings: false,
      includeOrder: [
        'docs/intro.mdx',
        'docs/lessons/*',
        'docs/language/*',
        'docs/science/*',
        'docs/religion/*',
        'docs/sciences/*',
        'docs/works/*',
        'docs/community.mdx',
        'docs/faq.mdx',
      ],
      includeUnmatchedLast: false,
      customLLMFiles: [
        {
          filename: 'llms-lexicon.txt',
          includePatterns: ['docs/words/**/*.md'],
          fullContent: true,
          title: 'Hîsyêô Lexicon',
          descrition: 'The closed dictionary of Hîsyêô words',
          orderPatterns: [
            'docs/words/o/*',
            'docs/words/ô/*',
            'docs/words/e/*',
            'docs/words/ê/*',
            'docs/words/i/*',
            'docs/words/î/*',
            'docs/words/u/*',
            'docs/words/û/*',
            'docs/words/h/*',
            'docs/words/k/*',
            'docs/words/g/*',
            'docs/words/t/*',
            'docs/words/c/*',
            'docs/words/s/*',
            'docs/words/x/*',
            'docs/words/d/*',
            'docs/words/z/*',
            'docs/words/b/*',
            'docs/words/f/*',
            'docs/words/m/*',
            'docs/words/n/*',
            'docs/words/l/*',
            'docs/words/w/*',
            'docs/words/y/*',
          ]
        }
      ]
    } ],
    'docusaurus-plugin-goatcounter',
    './src/plugins/error_ignorer',
  ],
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
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
          sidebarPath: require.resolve('./sidebars.js'),
          onInlineTags: 'ignore'
        },
        blog: {
          showReadingTime: true,
          onUntruncatedBlogPosts: 'ignore',
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/hisyeo-social-card.jpg',
      // announcementBar: {
      //   id: 'support_us',
      //   content:
      //     'We are looking to revamp our docs, please fill <a target="_blank" rel="noopener noreferrer" href="#">this survey</a>',
      //   backgroundColor: '#fafbfc',
      //   textColor: '#091E42',
      //   isCloseable: false,
      // },
      navbar: {
        title: 'Hîsyêô',
        logo: {
          alt: 'Hîsyêô Flag',
          src: 'img/hisyeo_flag.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Learn',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://hisyeo.github.io/mocko/',
            label: 'yôn Mocko',
            position: 'right',
          },
          {
            href: 'https://www.appsheet.com/start/b51571b2-bba5-4b6e-9055-207a8d59ad4e',
            label: 'Dictionary',
            position: 'right',
          },
          {
            href: 'https://github.com/govuliel/hyo',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/docs/intro',
              },
              {
                label: 'Deckademy',
                href: 'https://deckademy.com/#/deck/view/1007/Hisy%C3%AB%C3%B6',
              },
              {
                label: 'Kennings (Archived)',
                href: 'https://hisyeo-kennings.glitch.me',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Reddit',
                href: 'https://www.reddit.com/r/hisyeo/',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/48mUPRan9G',
              },
              {
                label: 'Matrix',
                href: 'https://matrix.to/#/#hisyeo:matrix.org',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/Hisyeo',
              },
              {
                label: 'Goatcounter',
                href: 'https://hisyeo.goatcounter.com',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Hîsyêô, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      goatcounter: {
        code: 'hisyeo',
      },
    }),
};

export default config;
