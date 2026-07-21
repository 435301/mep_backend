export default () => ({
  app: {
    name: 'MEP',
    env: process.env.NODE_ENV,
    port: Number(process.env.PORT) || 8000,
  },
});
