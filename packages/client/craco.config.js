const CracoAntDesignPlugin = require('craco-antd');
const theme = require('./themeToLess');

module.exports = {
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: theme.variables,
        styleLoaderOptions: {
          insertAt: 'top',
        },
      },
    },
  ],
};
