import { existsSync } from 'fs';
import assign from 'object-assign-deep';
import Handlebars from 'handlebars';
import { getPath, getContext } from 'packing-template-util';

module.exports = function(options) {
  options = assign({
    encoding: 'utf-8',
    extension: '.hbs',
    templates: '.',
    mockData: '.',
    globalData: '__global.js',
    rewriteRules: {}
  }, options);
  return async (req, res, next) => {
    const { templatePath, pageDataPath, globalDataPath } = getPath(req, options);
    if (existsSync(templatePath)) {
      const context = await getContext(req, res, pageDataPath, globalDataPath);
      try {
        const tpl = fs.readFileSync(templatePath, { encoding: options.encoding });
        const compiledTpl = Handlebars.compile(tpl);
        const output = compiledTpl(context);
        res.end(output);
      } catch (e) {
        console.log(e);
        next();
      }
    } else {
      next();
    }
  };
};
