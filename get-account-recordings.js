module.exports = function(RED) {
    function GetRecordings(n) {
        RED.nodes.createNode(this, n);
        const node = this;
        node.creds = n.rccreds;
        node.credsNode = RED.nodes.getNode(node.creds);

        node.on('input', function(msg, send, done) {
            let status = {};
            const getAllRecordings = () => {
                node.status({fill:"green",shape:"ring",text:"sending"});

                node.credsNode.platform.get('/restapi/v1.0/account/~/meeting-recordings?meetingStartTimeFrom=0')
                    .then((resp)=> resp.json())
                    .then((result)=> {
                        status = result;
                    })
                    .catch(function(err){
                        node.error(err);
                    })
                    .finally(function(){
                        node.status({fill:"green",shape:"dot",text:"sent"});
                        setTimeout(() => {
                            node.status({});
                        }, 2500);

                        msg.deliveryStatus = status;
                        send(msg);
                        if (done) {
                            done();
                        }
                    });
            };

            if( !node.credsNode.platformReady ) {
                node.credsNode.addEventListener('rc-ready', function(evt) {
                    getAllRecordings();
                })
            }
            else {
                getAllRecordings();
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
    RED.nodes.registerType("get-account-recordings", GetRecordings);
}