const decodeParams = (params, target) => {
  const start = params.indexOf(`${target}=`) + target.length + 1;
  let end = start;

  for (let i = start; i < params.length; i++) {
    if (params[i] === '&') break;
    end++;
  }

  return params.slice(start, end);
};

module.exports = { decodeParams };
