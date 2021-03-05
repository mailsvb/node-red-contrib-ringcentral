module.exports = function(RED) {
    function GetPresence(n) {
        RED.nodes.createNode(this, n);
        const node = this;
        node.creds = n.rccreds;
        node.credsNode = RED.nodes.getNode(node.creds);
        node.source = n.source || 'user';

        node.on('input', function(msg, send, done) {
            let status = {};
            const getPresenceState = () => {
                node.status({fill:"green",shape:"ring",text:"sending"});

                let url = '/restapi/v1.0/account/~';
                if (node.source === 'user') {
                    url += '/extension/';
                    if (msg.payload && msg.payload.userId && typeof msg.payload.userId === 'string') {
                        url += msg.payload.userId;
                    } else {
                        url += '~';
                    }
                }
                url += '/presence?detailedTelephonyState=true&sipData=true';
                node.log(`path[${url}]`);
                let error = false;
                node.credsNode.get(url, (data) => {
                    node.status({fill:"green",shape:"dot",text:"sent"});
                    setTimeout(() => {
                        node.status({});
                    }, 2500);
                    if (data) {
                        msg.presence = data && data.records || data;
                        send(msg);
                    }
                });
            };

            if( !node.credsNode.platformReady ) {
                node.error(node.credsNode.lastError);
            }
            else {
                getPresenceState();
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
    RED.nodes.registerType("presence", GetPresence);
}