/** @type {import('next').NextConfig} */
const path = require("path");
const apiUrl = process.env.NEXT_PUBLIC_API_URL + "/";
const fhirServerBaseURL = process.env.FREESHR_API_BASEURL;
const fhirServerRelativePath = process.env.FREESHR_API_FHIR_PATH;


const nextConfig = {
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
    preload: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  webpack: (config, { isServer }) => {
    if (config.name === 'server') config.optimization.concatenateModules = false

    config.resolve.fallback = {
      ...config.resolve.fallback,
      "original-fs": false,
      "fs": false,
    };
    config.devtool = process.env.NODE_ENV === 'development' ? 'eval-source-map' : false;
    if (!isServer) {
      config.cache = {
        type: 'filesystem', // Use filesystem-based caching
        buildDependencies: {
          config: [__filename] // Cache based on changes in this config file
        }
      };
    }
    return config;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  experimental: {
    // https://nextjs.org/docs/app/building-your-application/configuring/typescript#statically-typed-links
    // typedRoutes: true,
    //https://nextjs.org/docs/app/api-reference/next-config-js/optimizePackageImports
    optimizePackageImports: [
      "@elastic/elasticsearch",
      "highcharts",
      "highcharts-react-official",
      "@nivo/axes",
      "@nivo/bar",
      "@nivo/core",
      "@nivo/legends",
      "@nivo/line",
      "@nivo/pie",
      "@mui/icons-material",
      "xlsx",
      "d3-time-format",
      "highcharts",
      "jspdf",
      "material-react-table",
      "@tinymce/tinymce-react",
      "fhir-react"],
    // https://nextjs.org/docs/app/api-reference/functions/server-actions
    webVitalsAttribution: process.env.NODE_ENV === "production" ? [] : ['CLS', 'LCP']
  },
  // images: {
  //   domains: ['placehold.co'],
  // },
  //Increase API Request Timeouts
  serverRuntimeConfig: {
    // Increase backend API request timeout
    apiTimeout: 300000, // 300 seconds
  },
  //Next.js provides gzip compression to compress rendered content and static files.
  compress: true,
  //https://nextjs.org/docs/app/api-reference/next-config-js/output
  //Next.js can automatically create a standalone folder that copies only the necessary files for a production deployment including select files in node_modules.
  reactStrictMode: true, //true by default. If true, react strict mode is enabled.
  productionBrowserSourceMaps: false,
  async redirects() {
    return [
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.php",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ]
      }
    ]
  },
  async rewrites() {
    //https://nextjs.org/docs/api-reference/next.config.js/rewrites
    return {
      beforeFiles: [
        // These rewrites are checked after headers/redirects
        // and before all files including _next/public files which
        // allows overriding page files
        // {
        //   source: '/index',
        //   destination: '/',
        // },
        // {
        //   source: '/index.html',
        //   destination: '/',
        // },
        // {
        //   source: '/index.php',
        //   destination: '/',
        // },
      ],
      afterFiles: [
        // These rewrites are checked after pages/public files
        // are checked but before dynamic routes
        {
          source: "/non-existent",
          destination: "/404",
        },
      ],
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
        {
          source: "/external/:path*",
          destination: `${apiUrl}:path*`,
        },
        {
          source: "/fhir/:path*",
          destination: `${fhirServerBaseURL + fhirServerRelativePath}/:path*`,
        },
      ],
    };
  },
};
// Using Bundle Analyzer to check & Optimize Next.js Applications
// module.exports = nextConfig;
//Provides a cleaner API for enabling and
// configuring plugins for next.js because the default
// way next.js suggests to enable and configure plugins
// can get unclear and confusing when you have many plugins.
// Ref: https://github.com/vercel/next.js/tree/canary/packages/next-bundle-analyzer
//bun i next-compose-plugins
//bun i -D @next/bundle-analyzer
//
const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withPlugins([
  // add plugins here..
  [withBundleAnalyzer],
], nextConfig);