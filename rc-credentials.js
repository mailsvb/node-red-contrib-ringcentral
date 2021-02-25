module.exports = function(RED) {
    const SDK = require('@ringcentral/sdk').SDK;

    function RingCentralCredentials(n) {
        RED.nodes.createNode(this,n);
        
        const node = this;
        node.username = node.credentials.username;
        node.server = node.credentials.server;
        node.clientid = node.credentials.clientid;
        node.extension = node.credentials.extension;

        const rcsdk = new SDK({
            server: node.credentials.server,
            clientId: node.credentials.clientid,
            clientSecret: node.credentials.clientsecret
        });
        
        node.platformReady = false;

        node.platform = rcsdk.platform();
        node.platform.login({
                username: node.credentials.username,
                password: node.credentials.password,
                extension: node.credentials.extension
            })
            .then(function(resp) {
                node.platformReady = true;
                node.emit("rc-ready", {
                    platform: node.platform
                });
            })
            .catch(function(err) {
                node.error(err);
            });

        async function handleResponse(promiseRequest) {
            return promiseRequest
            .then(response => response && response.json())
            .then(jsonResponse => jsonResponse)
            .catch(err => {
                node.error(`handleResponse error ${err}`);
            });
        }

        async function getRequest(url) {
            return handleResponse(node.platform.get(url));
        }

        async function getAllPages(url, response) {
            if (!response) {
                response = await getRequest(url);
            }
            if (response && response.navigation) {
                if (response.navigation.nextPage) {
                    const result = await getRequest(response.navigation.nextPage.uri);
                    if (result && result.records) {
                        response.records = response.records.concat(result.records);
                    }
                    response.navigation.nextPage = result.navigation.nextPage;
                }
                if (response.navigation.nextPage) {
                    response = await getAllPages(url, response);
                }
            }
            return response;
        }

        async function get(url, cb) {
            const data = await getAllPages(url);
            cb(data);
        }
        node.get = get;

        node.on('close', function(removed, done) {
            if (removed) {
                // This node has been deleted
            } else {
                // This node is being restarted
            }
            done();
        });
    }

    RED.nodes.registerType("rc-credentials", RingCentralCredentials, {
        credentials: {
            username: {type:"text"},
            extension: {type:"text"},
            password: {type:"password"},
            clientid: {type:"text"},
            clientsecret: {type:"password"},
            server: {type:"text"}
        }
    });
}