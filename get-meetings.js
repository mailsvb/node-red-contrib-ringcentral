module.exports = function(RED) {
    function GetMeetings(n) {
        RED.nodes.createNode(this, n);
        const node = this;
        node.creds = n.rccreds;
        node.credsNode = RED.nodes.getNode(node.creds);

        node.on('input', function(msg, send, done) {
            let status = {};
            const getAllMeetings = () => {
                node.status({fill:"green",shape:"ring",text:"sending"});

                let error = false;
                node.credsNode.platform.get('/restapi/v1.0/account/~/extension/~/meeting')
                    .then((resp)=> resp.json())
                    .then((result)=> {
                        status = result && result.records;
                    })
                    .catch(function(err){
                        node.error(err);
                        error = true;
                    })
                    .finally(function(){
                        node.status({fill:"green",shape:"dot",text:"sent"});
                        setTimeout(() => {
                            node.status({});
                        }, 2500);

                        if (!error) {
                            msg.records = status;
                            send(msg);
                        }
                        if (done) {
                            done();
                        }
                    });
            };

            if( !node.credsNode.platformReady ) {
                node.credsNode.addEventListener('rc-ready', function(evt) {
                    getAllMeetings();
                })
            }
            else {
                getAllMeetings();
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
    RED.nodes.registerType("get-meetings", GetMeetings);
}