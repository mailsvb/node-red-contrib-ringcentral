module.exports = function(RED) {
    function SmsReceive(n) {
        RED.nodes.createNode(this, n);
        const node = this;
        node.creds = n.rccreds;
        node.credsNode = RED.nodes.getNode(node.creds);
        node.page = n.page || 1;
        node.perPage = n['per-page'] || 100;

        function getDateFromPast() {
            const now = new Date();
            const past = new Date(now.getTime() - (60 * 24 * 60 * 60 * 1000));
            let MM = (past.getMonth() + 1);
                if (MM < 10) { MM = '0' + MM; }
            let DD = past.getDate();
                if (DD < 10) { DD = '0' + DD; }

            return `${past.getFullYear()}-${MM}-${DD}`;
        }

        node.on('input', function(msg, send, done) {
            const dateFrom = msg.dateFrom || getDateFromPast();
            let response = [];
            const receiveSms = () => {
                node.status({fill:"green",shape:"ring",text:"receiving"});

                let url = `/restapi/v1.0/account/~/extension/~/message-store?messageType=SMS&direction=Inbound&dateFrom=${dateFrom}&page=${node.page}&perPage=${node.perPage}&`
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
                receiveSms();
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
    RED.nodes.registerType("sms-receive", SmsReceive);
}