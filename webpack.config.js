const discountCodeExample = require('./modules/discount-code/webpack.config');
const postToTwitter = require('./modules/post-to-twitter/webpack.config');
const splitExample = require('./modules/discount-redemption-split/webpack.config');

module.exports = function(env, argv) {
    return [
        discountCodeExample(env, argv),
        splitExample(env, argv),
        postToTwitter(env, argv)
    ];
};
