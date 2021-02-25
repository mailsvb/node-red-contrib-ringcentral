module.exports = function(RED) {
    function GetRecordings(n) {
        RED.nodes.createNode(this, n);
        const node = this;
        node.creds = n.rccreds;
        node.credsNode = RED.nodes.getNode(node.creds);
        node.source = n.source || 'account';

        node.on('input', function(msg, send, done) {
            let status = {};
            const getAllRecordings = () => {
                node.status({fill:"green",shape:"ring",text:"sending"});

                let url = '/restapi/v1.0/account/~/';
                if (node.source === 'user') {
                    url += 'extension/~/';
                }
                url += 'meeting-recordings?';
                if (msg.payload && msg.payload.meetingId && typeof msg.payload.meetingId === 'string') {
                    url += 'meetingId=';
                    url += msg.payload.meetingId;
                } else {
                    url += 'meetingStartTimeFrom=0';
                }
                node.log(`path[${url}]`);
                let error = false;
                node.credsNode.platform.get(url)
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
    RED.nodes.registerType("get-recordings", GetRecordings);
}