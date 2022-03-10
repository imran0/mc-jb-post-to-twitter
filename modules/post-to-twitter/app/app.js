// JOURNEY BUILDER CUSTOM ACTIVITY - discount-code ACTIVITY
// ````````````````````````````````````````````````````````````
// SERVER SIDE IMPLEMENTATION
//
// This example demonstrates
// * Configuration Lifecycle Events
//    - save
//    - publish
//    - validate
// * Execution Lifecycle Events
//    - execute
//    - stop

const express = require('express');
const configJSON = require('../config/config-json');

const {TwitterApi} = require('twitter-api-v2');

const client = new TwitterApi({
    appKey: 'P7Qph99uv4FqsOGGFhTmzoEVO',
    appSecret: 'aMpa4nPlhAMEsjlCiED7pVnbql0L827xQGMjC0Yp65dyQc4L7j',
    accessToken: '1499766115160899585-QbeUduDA4zez7R7w2w6y1bOZ9VyHpr',
    accessSecret: 'SNXb20vXYQn5Wak81b90zzlJvNY4ZlhO8NZUYHtXxB5wH',
});

// setup the discount-code example app
module.exports = function discountCodeExample(app, options) {
    const moduleDirectory = `${options.rootDirectory}/modules/post-to-twitter`;

    // setup static resources
    app.use('/modules/post-to-twitter/dist', express.static(`${moduleDirectory}/dist`));
    app.use('/modules/post-to-twitter/images', express.static(`${moduleDirectory}/images`));

    // setup the index redirect
    app.get('/modules/post-to-twitter/', function(req, res) {
        return res.redirect('/modules/post-to-twitter/index.html');
    });

    // setup index.html route
    app.get('/modules/post-to-twitter/index.html', function(req, res) {
        // you can use your favorite templating library to generate your html file.
        // this example keeps things simple and just returns a static file
        return res.sendFile(`${moduleDirectory}/html/index.html`);
    });

    // setup config.json route
    app.get('/modules/post-to-twitter/config.json', function(req, res) {
        // Journey Builder looks for config.json when the canvas loads.
        // We'll dynamically generate the config object with a function
        return res.status(200).json(configJSON(req));
    });

    // ```````````````````````````````````````````````````````
    // BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
    //
    // CONFIGURATION
    // ```````````````````````````````````````````````````````
    // Reference:
    // https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/interaction-operating-states.htm

    /**
     * Called when a journey is saving the activity.
     * @return {[type]}     [description]
     * 200 - Return a 200 iff the configuraiton is valid.
     * 30x - Return if the configuration is invalid (this will block the publish phase)
     * 40x - Return if the configuration is invalid (this will block the publish phase)
     * 50x - Return if the configuration is invalid (this will block the publish phase)
     */
    app.post('/modules/post-to-twitter/save', function(req, res) {
        console.log('debug: /modules/post-to-twitter/save');
        return res.status(200).json({});
    });

    /**
     * Called when a Journey has been published.
     * This is when a journey is being activiated and eligible for contacts
     * to be processed.
     * @return {[type]}     [description]
     * 200 - Return a 200 iff the configuraiton is valid.
     * 30x - Return if the configuration is invalid (this will block the publish phase)
     * 40x - Return if the configuration is invalid (this will block the publish phase)
     * 50x - Return if the configuration is invalid (this will block the publish phase)
     */
    app.post('/modules/post-to-twitter/publish', function(req, res) {
        console.log('debug: /modules/post-to-twitter/publish');
        return res.status(200).json({});
    });

    /**
     * Called when Journey Builder wants you to validate the configuration
     * to ensure the configuration is valid.
     * @return {[type]}
     * 200 - Return a 200 iff the configuraiton is valid.
     * 30x - Return if the configuration is invalid (this will block the publish phase)
     * 40x - Return if the configuration is invalid (this will block the publish phase)
     * 50x - Return if the configuration is invalid (this will block the publish phase)
     */
    app.post('/modules/post-to-twitter/validate', function(req, res) {
        console.log('debug: /modules/post-to-twitter/validate');
        client.v1.tweet('This tweet was written by a bot').then((val) => {
            console.log(val)
            console.log("success")
        }).catch((err) => {
            console.log(err)
        })
        return res.status(200).json({});
    });


    // ```````````````````````````````````````````````````````
    // BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
    //
    // EXECUTING JOURNEY
    // ```````````````````````````````````````````````````````

    /**
     * Called when a Journey is stopped.
     * @return {[type]}
     */
    app.post('/modules/post-to-twitter/stop', function(req, res) {
        console.log('debug: /modules/post-to-twitter/stop');
        return res.status(200).json({});
    });

    /**
     * Called when a contact is flowing through the Journey.
     * @return {[type]}
     * 200 - Processed OK
     * 3xx - Contact is ejected from the Journey.
     * 4xx - Contact is ejected from the Journey.
     * 5xx - Contact is ejected from the Journey.
     */
    app.post('/modules/post-to-twitter/execute', function(req, res) {
        console.log('debug: /modules/post-to-twitter/execute');

        const request = req.body;

        console.log(" req.body", JSON.stringify(req.body));

        // Find the in argument
        function getInArgument(k) {
            if (request && request.inArguments) {
                for (let i = 0; i < request.inArguments.length; i++) {
                    let e = request.inArguments[i];
                    if (k in e) {
                        return e[k];
                    }
                }
            }
        }

        /**
         * Generate a random discount code.
         *
         * Note: This function is for demonstration purposes only and is not designed
         * to generate real random codes. The first digit is always A, B, C, D, or E.
         *
         * @returns {Object}
         *
         * Example Response Object
         * {
         *    "discount":"15",
         *    "discountCode":"ADUXN-96454-15%"
         * }
         */
        function generateRandomCode() {
            let toReturn = String.fromCharCode(65+(Math.random() * 5));
            for(let i = 0; i < 4; i++) {
                toReturn += String.fromCharCode(65+(Math.random() * 25));
            }
            return toReturn + "-" + Math.round(Math.random() * 99999, 0);
        }

        // example: https://developer.salesforce.com/docs/atlas.en-us.noversion.mc-app-development.meta/mc-app-development/example-rest-activity.htm
        const discountInArgument = getInArgument('discount') || 'nothing';
        const responseObject = {
            discount: discountInArgument,
            discountCode: generateRandomCode() + `-${discountInArgument}%`
        };

        console.log('Response Object', JSON.stringify(responseObject));

        client.post(
            'statuses/update',
            {status: 'Posting via the API is awesome!'},
            function (error, tweet, response) {
              if (error) throw error;
              console.log(tweet); // Tweet body.
              console.log(response); // Raw response object.
            }
          );

        return res.status(200).json(responseObject);
    });

};
