export function getNodes(query, graphObject, callback) {
	var colorTable = {
	   circle: "#8800ff",
	   rectangle: "#0000ff",
	   diamond: "#00bdbd",
	   ellipse: "#000000",
	   star: "#999900"
	};

	// The node list is used to keep track of which nodes have already been added
	// to the nodes array.  This is needed because the query we are using returns 
	// both nodes in a relationship, but does not return nodes with no outgoing relationships.
	// The query also doesn't return any non-connected nodes, but that should be OK.
    var nodesAdded = {};
    var nodes = [];
    var links = [];
	
    // Pull the connection info from the ,env file.  Copy and change template.env
    const neo4j = require('neo4j-driver').v1;
    const driver = neo4j.driver(process.env.REACT_APP_BOLT_URL,
                                 neo4j.auth.basic(process.env.REACT_APP_BOLT_USER, 
                                 process.env.REACT_APP_BOLT_PASSWORD));
    const session = driver.session();
    const nodeResult = session.run(query)

    var nodePromise = nodeResult.then(result => {
       var nRecords = result.records.length;
       console.log("nRecords in getNodes is: " + nRecords);
       for (var i = 0; i < nRecords; i++) {
	     // we start by looking at the first node
         var identity1 = result.records[i]._fields[0].identity;
         var thisName = result.records[i]._fields[0].properties["name"];
         var thisTargetName = result.records[i]._fields[2].properties["name"];

		 // Have we seen this node already?
		 if (!(identity1 in nodesAdded)) {
		   // Not there, lets add it to the array
		   nodesAdded[identity1] = 1;
           var thisLabel = result.records[i]._fields[0].labels;
           var thisShape = result.records[i]._fields[0].properties["shape"];
           var thisColor = colorTable[thisShape];
           var thisSSMId = result.records[i]._fields[0].properties["id"];
           var thisSourceFile = result.records[i]._fields[0].properties["sourcefile"];
           
           var thisNode = 
           { id: identity1, shape: thisShape, label: thisLabel, color: thisColor,
             name:  thisName, ssmId: thisSSMId, sourceFile: thisSourceFile
           }
           
           if (thisNode.shape !== "noBorder") {
             nodes.push(thisNode);
             console.log(result.records[i]);
           }
		 }

		 // Now let's look at the second node.
         var identity2 = result.records[i]._fields[2].identity;

		 // Have we seen this node already?
		 if (!(identity2 in nodesAdded)) {
		   // Not there, lets add it to the array
		   nodesAdded[identity2] = 1;
           thisLabel = result.records[i]._fields[2].labels;
           thisShape = result.records[i]._fields[2].properties["shape"];
           thisColor = colorTable[thisShape];
           thisSSMId = result.records[i]._fields[2].properties["id"];
           thisSourceFile = result.records[i]._fields[2].properties["sourcefile"];
           
           thisNode = 
           { id: identity2, shape: thisShape, label: thisLabel, color: thisColor,
             name:  thisTargetName, ssmId: thisSSMId, sourceFile: thisSourceFile
           }
           
           if (thisNode.shape !== "noBorder") {
             nodes.push(thisNode);
             console.log(result.records[i]);
             //console.log(result.records[i]._fields[0]);
           }
		 } // end of second node loop
		 // Now let's add a link.  Each record represents the 2 nodes and the link, so there is no
		 // testing or exclusions or repeats to worry about.
		 var thisLink = {
		    source: identity1,
			target: identity2,
			sourceName: thisName,
			targetName: thisTargetName,
			name: "to"
		 }

		 links.push(thisLink);
       }
    session.close();
    driver.close();
    if (typeof nodes[0] !== 'undefined') {
       console.log("First node to return " + nodes[0].shape);
    }
     if (typeof graphObject.setNodesAndLinks !== 'undefined') {
	    graphObject.setNodesAndLinks(nodes, links);
     } else {
        console.log ("Second node from get is :" + nodes[1]);
        graphObject.nodes = nodes.slice();
        graphObject.links = links.slice();
     }

     // Now we call the callback so that the parent component knows the data is ready to render.
     if (typeof callback === "function") {
        callback('true');
     }
  });
  console.log("after nodeResult");
  return nodes;
}

export function getLabels(query, labelObject) {
	
    // Pull the connection info from the ,env file.  Copy and change template.env
    const neo4j = require('neo4j-driver').v1;
    const driver = neo4j.driver(process.env.REACT_APP_BOLT_URL,
                                 neo4j.auth.basic(process.env.REACT_APP_BOLT_USER, 
                                 process.env.REACT_APP_BOLT_PASSWORD));
    const session = driver.session();
    console.log(query);
    const labelResult = session.run(query)
    var labels = [];

    console.log("before labelResult");
    var labelPromise = labelResult.then(result => {
       console.log("in labelResult");
       var nRecords = result.records.length;
       console.log("number of labels found is: " + nRecords);
       for (var i = 0; i < nRecords; i++) {
           console.log(result.records[i]._fields[0]);
           var thisLabel = { value: result.records[i]._fields[0], label: result.records[i]._fields[0]};
		   labels.push(thisLabel);
       }

    session.close();
    driver.close();
    console.log("First label to return " + labels[0]);
    labelObject.setLabels(labels);
  });
  console.log("after labelResult");
  return labels;
}

