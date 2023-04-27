/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  rewrites: async () => {
    return [
      {
        source: '/api/items',
        destination: `http://localhost:8000/items`,
      },
      {
        source: '/api/items/:slug',
        destination: `http://localhost:8000/items/:slug`,
      },

      {
        source: '/api/users',
        destination: `http://localhost:8000/users`,
      },
      {
        source: '/api/users/:slug',
        destination: `http://localhost:8000/users/:slug`,
      },

      {
        source: '/api/purchaseHistories',
        destination: `http://localhost:8000/purchaseHistories`,
      },
      {
        source: '/api/purchaseHistories/:slug',
        destination: `http://localhost:8000/purchaseHistories/:slug`,
      },

      {
        source: '/api/favorites',
        destination: `http://localhost:8000/favorites`,
      },
      {
        source: '/api/favorites/:slug',
        destination: `http://localhost:8000/favorites/:slug`,
      },
      {
        source: '/api/subscriptionCart',
        destination: `http://localhost:8000/subscriptionCart`,
      },
      {
        source: '/api/subscriptionCart/:slug',
        destination: `http://localhost:8000/subscriptionCart/:slug`,
      },
      {
        source: '/api/subscription',
        destination: `http://localhost:8000/subscription`,
      },
      {
        source: '/api/subscription/:slug',
        destination: `http://localhost:8000/subscription/:slug`,
      },
      {
        source: '/api/subscriptionHistories',
        destination: `http://localhost:8000/subscriptionHistories`,
      },
      {
        source: '/api/subscriptionHistories/:slug',
        destination: `http://localhost:8000/subscriptionHistories/:slug`,
      },
      {
        source: '/api/carts',
        destination: `http://localhost:8000/carts`,
      },
      {
        source: '/api/carts/:slug',
        destination: `http://localhost:8000/carts/:slug`,
      },
      {
        source: '/',
        destination: '/items/',
      },
      {
        // source: '/api/login',
        source: '/api/login',
        destination: 'http://backend:3005/auth/login',
      },

      // {
      //   source: 'PROTEIN',
      //   destination: 'NEXT_PUBLIC_PROTEIN',
      // },
      // {
      //   source: 'PROTEIN_DATA',
      //   destination: 'NEXT_PUBLIC_PROTEIN_DATA',
      // },
    ];
  },
};

require('dotenv').config({
  path: `./.env.${process.env.ENVIRONMENT}`,
});

module.exports = {};

module.exports = nextConfig;
