// A global color table defined so that the colors we display in our react graph
// match the colors used in the original ssm graphs.
	var colorTable = {
	   circle: "#8800ff",      // purple
	   rectangle: "#0000ff",   // blue
	   diamond: "#00bdbd",     // teal
	   ellipse: "#000000",     // black
	   star: "#999900"         // yellow-green
	};

/**
 * This function executes the given query to retrieve data from our Neo4j data store. We use
 * a java script promise to handle the asynchronous nature of the query. In the then clause, we
 * construct arrays of nodes and links that conform to the react force graph requirements and call 
 * the setNodesAndLinks function of the graphObject to set add the arrays to the object.  Finally
 * we call then provide callback function to ensure that the individual components will be re-rendered
 * with the new data.
 * @param  {String} the query to execute
 * @param  {Object} the graph object
 * @param  {Function} the callback function to execute when the data is ready to render
 * @return {None}
 */
export function getNodes(query, graphObject, callback) {
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
    var path = require('path');
    console.log("query in getNodes is: " + query);

    nodeResult.then(result => {
       var nRecords = result.records.length;
       console.log("nRecords in getNodes is: " + nRecords);
       console.log("records in getNodes: " , result.records);
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
   //          console.log(result.records[i]);
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
			name: path.basename(thisSourceFile, 'json')
			//name: "to"
		 }

		 links.push(thisLink);
       }
    session.close();
    driver.close();
    if (typeof nodes[0] !== 'undefined') {
       console.log("First node to return " + nodes[0].shape);
    }

    // Set the nodes and links for return in the graph object
    graphObject.setNodesAndLinks(nodes, links);

    // Now we call the callback so that the parent component knows the data is ready to render.
    if (typeof callback === "function") {
        callback('true');
    }
  });
  return nodes;
}

/**
 * This function executes the given query to retrieve data from our Neo4j data store. We use
 * a java script promise to handle the asynchronous nature of the query. In the then clause, we
 * construct arrays of nodes and links that conform to the react force graph requirements and call 
 * the setNodesAndLinks function of the graphObject to set add the arrays to the object.  Finally
 * we call then provide callback function to ensure that the individual components will be re-rendered
 * with the new data. The difference between this function and getNodes is that this function is used
 * for queries that return a path.  Because the returned data from the Cypher query is in a different 
 * form, we need to process it differently, but the end goal is the same.
 * @param  {String} the query to execute
 * @param  {Object} the graph object
 * @param  {Function} the callback function to execute when the data is ready to render
 * @return {None}
 */
export function getNodesFromPath(query, graphObject, callback) {
	// The node list is used to keep track of which nodes have already been added
	// to the nodes array.  This is needed because the query we are using returns 
	// both nodes in a relationship, but does not return nodes with no outgoing relationships.
	// The query also doesn't return any non-connected nodes, but that should be OK.
    var nodesAdded = {};
    var linksAdded = {};
    var nodes = [];
    var links = [];
	
    // Pull the connection info from the ,env file.  Copy and change template.env
    const neo4j = require('neo4j-driver').v1;
    const driver = neo4j.driver(process.env.REACT_APP_BOLT_URL,
                                 neo4j.auth.basic(process.env.REACT_APP_BOLT_USER, 
                                 process.env.REACT_APP_BOLT_PASSWORD));
    const session = driver.session();
    const nodeResult = session.run(query)
    console.log("query in getNodesFromPath is: " + query);

    nodeResult.then(result => {
       var nRecords = result.records.length;
       console.log("nRecords in getNodesFromPath is: " + nRecords);
       for (var i = 0; i < nRecords; i++) {
         var nSegments = result.records[i]._fields[0].segments.length;
//       console.log("nSegments in getNodesFromPath is: " + nSegments);
         for (var j = 0; j < nSegments; j++) {
            var thisSegment = result.records[i]._fields[0].segments[j];
//          console.log("thisSegment in getNodesFromPath is: " , thisSegment);

   	        // we start by looking at the first node
            var startNode = thisSegment.start;
            var identity1 = startNode.identity;
            var thisName = startNode.properties["name"];
            var endNode = thisSegment.end;
            var thisTargetName = endNode.properties["name"];

            // Have we seen this node already?
		    if (!(identity1 in nodesAdded)) {
		       // Not there, lets add it to the array
		       nodesAdded[identity1] = 1;
               var thisLabel = startNode.labels;
               var thisShape = startNode.properties["shape"];
               var thisColor = colorTable[thisShape];
               var thisSSMId = startNode.properties["id"];
               var thisSourceFile = startNode.properties["sourcefile"];
           
               var thisNode = 
               { id: identity1, shape: thisShape, label: thisLabel, color: thisColor,
                 name:  thisName, ssmId: thisSSMId, sourceFile: thisSourceFile
               }
           
               if (thisNode.shape !== "noBorder") {
                 nodes.push(thisNode);
//               console.log("pushed this node:", thisNode);
               }
             }

     		 // Now let's look at the end node in this segment.
              var identity2 = endNode.identity;

		      // Have we seen this node already?
		      if (!(identity2 in nodesAdded)) {
		        // Not there, lets add it to the array
		        nodesAdded[identity2] = 1;
                thisLabel = endNode.labels;
                thisShape = endNode.properties["shape"];
                thisColor = colorTable[thisShape];
                thisSSMId = endNode.properties["id"];
                thisSourceFile = endNode.properties["sourcefile"];
                
                thisNode = 
                { id: identity2, shape: thisShape, label: thisLabel, color: thisColor,
                  name:  thisTargetName, ssmId: thisSSMId, sourceFile: thisSourceFile
                }
           
                if (thisNode.shape !== "noBorder") {
                  nodes.push(thisNode);
//                console.log("pushed this node:", thisNode);
                }
		      }

              // Now we need to know whether or not we have already seen this segment. If not, then we 
              // want to add a link
              var linkIdentity = identity1 + "-" +identity2;
		      if (!(linkIdentity in linksAdded)) {
                 linksAdded[linkIdentity] = 1;
		         var thisLink = {
		            source: identity1,
			        target: identity2,
			        sourceName: thisName,
			        targetName: thisTargetName,
			        name: "to"
		         }
		         links.push(thisLink);
             }

           } // end of segment loop
		 } // end of records
         console.log("added these nodes: ", nodes);
         console.log("added these links: ", links);
    session.close();
    driver.close();
    if (typeof nodes[0] !== 'undefined') {
       console.log("First node to return " + nodes[0].shape);
    }

    // Set the nodes and links for return in the graph object
    graphObject.setNodesAndLinks(nodes, links);

    // Now we call the callback so that the parent component knows the data is ready to render.
    if (typeof callback === "function") {
        callback('true');
    }
  });
  return nodes;
}

/**
 * This function retrieves the list of labels/namespaces/studies in the Neo4j database. Before the user
 * does anything else, they need to select which label they want to work with.
 * We use a java script promise to handle the asynchronous nature of the query. In the then clause, we
 * construct an array of labels that eventually get added to the inputed label object. There is no
 * callback function here because this call is made from the constructor of the SelecteLabelComponent
 * component and there is nothing the user can do to change the contents.  In other words, once the
 * app all mounted, the list of labels is constant.
 * @param  {String} the query to execute
 * @param  {Object} the label object
 * @return {None}
 */
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
    labelResult.then(result => {
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
}


/**
 * This function retrieves the list of maps for a label in the Neo4j database. 
 * We use a java script promise to handle the asynchronous nature of the query. In the then clause, we
 * construct an array of maps that eventually get added to the inputed map object. 
 * @param  {String} the query to execute
 * @param  {Object} the map object
 * @param  {Function} the callback function to execute when the data is ready to render
 * @return {None}
 */
export function getMaps(query, mapObject) {
	
    // Pull the connection info from the ,env file.  Copy and change template.env
    const neo4j = require('neo4j-driver').v1;
    const driver = neo4j.driver(process.env.REACT_APP_BOLT_URL,
                                 neo4j.auth.basic(process.env.REACT_APP_BOLT_USER, 
                                 process.env.REACT_APP_BOLT_PASSWORD));
    const session = driver.session();
    console.log(query);
    const mapResult = session.run(query)
    var maps = [];
    var mapsByLabel = {};
    var path = require('path');

    mapResult.then(result => {
       var nRecords = result.records.length;
       console.log("number of maps found is: " + nRecords);
       for (var i = 0; i < nRecords; i++) {
           var thisMap = { sourceFile: result.records[i]._fields[0], 
                           name: path.basename(result.records[i]._fields[0], 'json'), 
                           label: result.records[i]._fields[1][0]};
		   maps.push(thisMap);
       }

    // We currently have an array of objects that have sourceFile, name and label attributes. What we actually
    // want is an array of objects with a label attribute, where each of these objects contains an array of
    // objects with the sourceFile and name attributes
    for (i = 0; i < maps.length; i++) {
       var retrievedMap = maps[i];
       var thisMapToInsert = {value: retrievedMap.sourceFile, label: retrievedMap.name};
       var thisLabel = retrievedMap.label;
       if (mapsByLabel.hasOwnProperty(retrievedMap.label)){
         // Not the first time we have seen this label
         mapsByLabel[thisLabel].maps.push(thisMapToInsert);
       } else {
         mapsByLabel[thisLabel] = {};
         mapsByLabel[thisLabel].maps = [];
         mapsByLabel[thisLabel].maps.push(thisMapToInsert);
       }

    }

    console.log("mapsByLabel: ", mapsByLabel);
    session.close();
    driver.close();
    console.log("First map to return " + maps[0]);
    mapObject.setMaps(mapsByLabel);

    // Now we call the callback so that the parent component knows the data is ready to render.
//    if (typeof callback === "function") {
//        callback('true');
//    }
  });
}

