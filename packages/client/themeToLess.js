// This is in order to be able to require the theme which is in typescript
require('ts-node').register({
  compilerOptions: {
    // Because node does not understand import yet
    module: 'commonjs',
  },
});
const { paramCase } = require('change-case');

const variables = require('./src/theme/variables');

const keyBlackList = ['googleFonts'];

function addNumberDash(target) {
  if (target.search(/\d+/) > 0) {
    return target.replace(/(\d+)/, '-$1');
  }
  return target;
}

module.exports.variables = Object.entries(variables).reduce(
  (themeVars, [name, value]) => {
    // We do not want to change every name
    if (keyBlackList.includes(name)) {
      module.exports[name] = value;

      return themeVars;
    }

    return {
      ...themeVars,
      [`@${paramCase(addNumberDash(name))}`]: value,
    };
  },
  {},
);
