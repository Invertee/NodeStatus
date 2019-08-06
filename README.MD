# Bitcoin/Litecoin Node Status Page

A shameless ripoff of @xblau [node-interface](https://github.com/xblau/node-interface) in Javascript on Node.JS as a learning exercise. Uses Express and EJS to render the page. It should be reasonably secure but it has access to your full nodes RPC details so don't use it on nodes with your life savings on. 👍 

Tested under NodeJS 8, earlier versions may not work. 

## Install

Clone the repo, cd into the cloned folder and install the dependencies:

    C:\Users\Admin\Desktop>git clone https://github.com/Invertee/NodeStatus.git
    Cloning into 'NodeStatus'...

    C:\Users\Admin\Desktop>cd NodeStatus

    C:\Users\Admin\Desktop\NodeStatus>npm install --no-optional

Rename the .env example to .env and edit with your nodes RPC settings

Start the the server and browse to the status page:

    C:\Users\Admin\Desktop\NodeStatus>npm start
    Server running on port 3000



