module.exports = function(RED) {
    function GetExtensions(n) {
        RED.nodes.createNode(this, n);
        const node = this;
        node.creds = n.rccreds;
        node.credsNode = RED.nodes.getNode(node.creds);

        node.on('input', function(msg, send, done) {
            let status = {};
            const getAllExtensions = () => {
                node.status({fill:"green",shape:"ring",text:"sending"});

                const url = '/restapi/v1.0/account/~/extension';

                node.log(`path[${url}]`);

                node.credsNode.get(url, (data) => {
                    node.status({fill:"green",shape:"dot",text:"sent"});
                    setTimeout(() => {
                        node.status({});
                    }, 2500);
                    if (data) {
                        msg.records = data && data.records;
                        send(msg);
                    }
                });
            };

            if( !node.credsNode.platformReady ) {
                node.error(node.credsNode.lastError);
            }
            else {
                getAllExtensions();
            }
            
        });

        node.on('close', function(removed, done) {
            if (removed) {
                // This node has been deleted
            } else {
                // This node is being restarted
            }
            done();
        });
    }
    RED.nodes.registerType("extensions", GetExtensions);
}