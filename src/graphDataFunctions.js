export function getNodesByLabel(label, graphObject) {
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
    const neo4j = require('neo4j-driver').v1;
    const driver = neo4j.driver('http://syssci2.edc.renci.org:7474', 
                                 neo4j.auth.basic('neo4j', 'SSMProjectFirstPassword'));
    const session = driver.session();
//  const nodeResult = session.run('MATCH (n) return n');
    const nodeResult = session.run('MATCH (n)-[r]->(a) RETURN n,type(r),a')

    console.log("before nodeResult");
    var nodePromise = nodeResult.then(result => {
    console.log("in nodeResult");
       var nRecords = result.records.length;
       console.log(nRecords);
       for (var i = 0; i < nRecords; i++) {
	     // we start by looking at the first node
         var identity1 = result.records[i]._fields[0].identity;

		 // Have we seen this node already?
		 if (!(identity1 in nodesAdded)) {
		   // Not there, lets add it to the array
		   nodesAdded[identity1] = 1;
           var thisLabel = result.records[i]._fields[0].labels;
           var thisShape = result.records[i]._fields[0].properties["shape"];
           var thisColor = colorTable[thisShape];
           var thisName = result.records[i]._fields[0].properties["name"];
           var thisSSMId = result.records[i]._fields[0].properties["id"];
           var thisSourceFile = result.records[i]._fields[0].properties["sourceFile"];
           
           var thisNode = 
           { id: identity1, shape: thisShape, label: thisLabel, color: thisColor,
             name:  thisName, ssmId: thisSSMId, sourceFile: thisSourceFile
           }
           
           if (thisNode.shape !== "noBorder") {
             nodes.push(thisNode);
             console.log(result.records[i]);
             //console.log(result.records[i]._fields[0]);
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
           var thisTargetName = result.records[i]._fields[2].properties["name"];
           thisSSMId = result.records[i]._fields[2].properties["id"];
           thisSourceFile = result.records[i]._fields[2].properties["sourceFile"];
           
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
    console.log("First node to return " + nodes[0].shape);
    // End of the result code that returns the promise
  }).then(function(result) {
     console.log("in node promise"); 
	 graphObject.setNodesAndLinks(nodes, links);
     console.log("node 0: " + graphObject.state.graph.nodes[0].shape);
  });
  console.log("after nodeResult");
  return nodes;
}
