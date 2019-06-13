export const getFlag = (
  defaultFlag: boolean,
  productionDefaultFlag: boolean,
  overrideVariableName?: string,
) => {
  if (process.env.NODE_ENV !== 'production') {
    return defaultFlag;
  }

  if (overrideVariableName == null) {
    return productionDefaultFlag;
  }

  if (process.env[overrideVariableName] === 'true') {
    return true;
  }
  return false;
};

export const isProduction = () => process.env.NODE_ENV === 'production';
