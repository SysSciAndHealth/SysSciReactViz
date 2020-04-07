import * as React from "react";
import { Container } from 'react-layout-components';
import { Row, Col } from 'react-bootstrap';
// import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as util from 'util';
import { ForceGraph3D } from 'react-force-graph';
import * as graphDataFunctions from "./graphDataFunctions.js";
import 'react-sprite';
import 'three-spritetext';
import SpriteText from 'three-spritetext';
import Popup from "reactjs-popup";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import Popper from 'popper.js';
import { Dropdown, MenuItem, DropdownButton } from "react-bootstrap";
import Select from 'react-select';

// A global table used to associate the ring shapes with the names of the rings.
    var shapeTable = {
       roles: "circle",   
       responsibilities: "rectangle",
       needs: "diamond", 
       resources: "ellipse",
       wishes: "star"   
    };

/**
 * This is the container for the select label menu 
 */
class SelectLabelComponent extends React.Component {
/**
 * Constructor for this component
 * @param  {Object} a property object that includes the function that is called when the user 
 *                  makes a selection
 * @return {None}
 */
  constructor (props) {
     super (props);

     this.state = {
        labels: [],
        selectedOption: '',
        labelQuery: 'MATCH (n) RETURN distinct labels(n)',
        mapQuery: 'MATCH (n) RETURN distinct n.sourcefile, labels(n)'

     };

     this.handleLabelChange = this.handleLabelChange.bind(this);
     const graphDataFunctions = require('./graphDataFunctions');
     graphDataFunctions.getLabels(this.state.labelQuery, this);
  }

/**
 * Local binding for the passed in function
 * @param  {Object} the user selected option
 * @return {None}
 */
  handleLabelChange(selectedOption) {
    this.props.handleLabelChange(selectedOption);
  }

/**
 * Function called when the user changes the value of the select object
 * @param  {Object} the user selected option
 * @return {None}
 */
  // This function is called when the user changes the value of the select object
  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => this.handleLabelChange(selectedOption)
    );
  };


/**
 * Function passed to the getLabels function to set the label array
 * @param  {Object} the label array
 * @return {None}
 */
  setLabels (theLabels) {
     console.log("In setLabels ");
     this.setState((state) => {
       let savedLabels = Object.assign({}, state.labels);
       console.log(theLabels);
       savedLabels = theLabels;
       return ({labels: savedLabels});
     });
  }  

/**
 * The render function
 */
  render() {

    console.log("Rendering the label component with labels: ", this.state.labels);
    return (
    <div style={{width: '200px'}}>
       <div className="label">Select A Label</div>
      <Select
        value={this.selectedOption}
        onChange={this.handleChange}
        options={this.state.labels}
      />
    </div>
    );
  }
}

/**
 * This is the container for the select maps menu. This component allows the user to select one or more
 * maps from a list to be displayed. If the user doesn't select any maps, then all the maps for the
 * selected label are displayed.
 */
class SelectMapsComponent extends React.Component {
/**
 * Constructor for this component
 * @param  {Object} a property object that includes the function that is called when the user 
 *                  makes a selection
 * @return {None}
 */
  constructor (props) {
     super (props);

     this.state = {
        maps: {},
        selectedOptions: [],
        mapQuery: 'MATCH (n) RETURN distinct n.sourcefile, labels(n)'
     };

     this.handleMapsChange = this.handleMapsChange.bind(this);
     graphDataFunctions.getMaps(this.state.mapQuery, this);
  }

/**
 * Function passed to the getMaps function to set the map array
 * @param  {Object} the map array
 * @return {None}
 */
  setMaps (theMaps) {
     console.log("In setMaps ");
     this.setState((state) => {
       let savedMaps = Object.assign({}, state.maps);
       console.log(theMaps);
       savedMaps = theMaps;
       return ({maps: savedMaps});
     });
  }  


/**
 * Local binding for the passed in function
 * @param  {Object} the user selected option
 * @return {None}
 */
  handleMapsChange(selectedOptions) {
    console.log("Maps selected: ", selectedOptions);
    this.props.handleMapChange(selectedOptions);
  }

/**
 * Function called when the user changes the value of the select object
 * @param  {Object} the user selected option
 * @return {None}
 */
  // This function is called when the user changes the value of the select object
  handleChange = selectedOptions => {
    this.setState(
      { selectedOptions },
      () => this.handleMapsChange(selectedOptions)
    );
  };


/**
 * The render function
 */
  render() {

    // This seems to catch the case where we are trying to render this component before we
    // have the map data from the promise.
    if (this.state.maps[this.props.label] === undefined || this.state.maps.length === 0) {
       // Let's not try to render what isn't there.
       return (null);
    } else {

       console.log("Rendering the map component with maps: ", this.state.maps);
    
       // The very cool multi select widget.  It returns a possibly empty array of user selected values.
       return (
       <div style={{width: '300px'}}>
          <div className="maps">Select Maps</div>
         <Select
           isMulti
           value={this.selectedOptions}
           onChange={this.handleChange}
           options={this.state.maps[this.props.label]["maps"]}
         />
       </div>
       );
    }
  }
}


/**
 * This is the container for the select view menu.
 */
class SelectViewComponent extends React.Component {
/**
 * Constructor for this component
 * @param  {Object} a property object that includes the function that is called when the user 
 *                  makes a selection
 * @return {None}
 */
  constructor (props) {
  super (props);
     console.log("In constructor for SelectViewComponent");

     this.state = {
        selectedOption: 'All Nodes',
     };

     // The set of options is static, so build an array and jam it in.
     this.theViewList = [
        { value: 'all', label: 'All Nodes'},
        { value: 'roles', label: 'Roles'},
        { value: 'responsibilities', label: 'Responsibilities'},
        { value: 'needs', label: 'Needs'},
        { value: 'resources', label: 'Resources'},
        { value: 'wishes', label: 'Wishes'},
        ];


     this.handleViewChange = this.handleViewChange.bind(this);
  }

/**
 * Local binding for the passed in function
 * @param  {Object} the user selected option
 * @return {None}
 */
  handleViewChange(selectedOption) {
    console.log(`Option selected:`, this.state.selectedOption);
    this.props.handleViewChange(selectedOption);
  }

/**
 * Function called when the user changes the value of the select object
 * @param  {Object} the user selected option
 * @return {None}
 */
  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => this.handleViewChange(selectedOption)
    );
  };

/**
 * The render function
 */
  render() {

    const { selectedOption } = this.state.selectedOption;

    return (
    <div style={{width: '200px'}}>
       <div className="label">Select A View</div>
      <Select
        defaultValue={this.theViewList[0]}
        value={selectedOption}
        onChange={this.handleChange}
        options={this.theViewList}
      />
    </div>
    );
  }
}

/**
 * This is the container for the popup menu that is instantiated when the user
 * right clicks on a node.
 */
class PopupComponent extends React.Component {
/**
 * Constructor for this component
 * @param  {Object} a property object that includes the variable that controls whether or not
 *                  the popup is shown and the function that is called when the user makes a selection
 * @return {None}
 */
constructor (props) {
  super (props);
     console.log("In constructor for PopupComponent");

     this.state = {
        selectedOption: null,
     };

     // The set of options is static, so build an array and jam it in.
     this.thePopupList = [
        { value: 'roles', label: 'Show Roles'},
        { value: 'neighbor', label: 'Show Neighbors'},
        { value: 'sub', label: 'Show Sub Graph'},
        ];


     this.handlePopupChange = this.handlePopupChange.bind(this);
  }

/**
 * Local binding for the passed in function
 * @param  {Object} the user selected option
 * @return {None}
 */
  handlePopupChange(selectedOption) {
    console.log(`Option selected:`, this.state.selectedOption);
    this.props.handlePopupChange(selectedOption);
  }

/**
 * Function called when the user changes the value of the select object
 * @param  {Object} the user selected option
 * @return {None}
 */
  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => this.handlePopupChange(selectedOption)
    );
  };

/**
 * The render function
 */
  render() {

    if (!this.props.showPopup) {
       return null;
    }

    const { selectedOption } = this.state;

    return (
    <div style={{width: '200px'}}>
       <div className="label">Pick An Option</div>
      <Select
        value={selectedOption}
        onChange={this.handlePopupChange}
        options={this.thePopupList}
      />
    </div>
    );
  }
}

/**
 * This is the container which has the actual react-force-graph object
 */
class SSMGraphData extends React.Component {
 
/**
 * Constructor for this component
 * @param  {Object} a property object that includes the handlePopupStateChange function, the selected 
 *                  label, and the graph function that includes the nodes and links
 * @return {None}
 */
  constructor (props) {

    super (props);

	this.state = {
       showPopup : false,
       currentNode : '',
	};
  }

/**
 * The on click handler
 * @param  {Object} the node object that was clicked on.
 * @return {None}
 */
  _handleClick = node => {
     // Aim at node from outside it
     const distance = 100;
     const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);

     this.fg.cameraPosition(
       { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
         node, // lookAt ({ x, y, z })
         3000  // ms transition duration
        );
      };

/**
 * The on right click handler
 * @param  {Object} the node object that was clicked on.
 * @return {None}
 */
 _handleRightClick_old = node => {
     this.setState({  
        showPopup: !this.state.showPopup  
     });
	 this.setState((state) => { 
	   return ({currentNode : node });
	 });
     console.log(node);
  }

/**
 * The render function
 * @return {None}
 */
render() {
    
    console.log("rendering graph with label " + this.props.label);

    if (typeof this.props.graph === 'undefined') {
       return null;
    }

    const inputData = this.props.graph;

    var data = { nodes: inputData.nodes,
                 links: inputData.links};

    console.log("rendering data from props " , data.nodes);
    console.log("rendering data from links " , data.links);

    return (
      <div>
        
        <div className="theGraph"><
           ForceGraph3D graphData={data} 
           nodeRelSize={10}
           ref={el => { this.fg = el; }}
           onNodeClick={this._handleClick}
           onNodeRightClick={this.props.handlePopupStateChange}
		   backgroundColor={"darkgrey"}
           nodeAutoColorBy="shape"
           linkDirectionalArrowLength={3}
           // linkWidth={1}
           linkDirectionalArrowRelPos={1}
           linkColor={() => 'rgba(255,0,0,1.0)'}
           linkThreeObjectExtend={true}
           linkThreeObject={link => {
            // extend link with text sprite
            const sprite = new SpriteText(`${link.sourceName} > ${link.targetName}`);
            sprite.color = 'black';
            sprite.textHeight = 1.5;
            return sprite;
          }}
          linkPositionUpdate={(sprite, { start, end }) => {
            const middlePos = Object.assign(...['x', 'y', 'z'].map(c => ({
              [c]: start[c] + (end[c] - start[c]) / 2 // calc middle point
            })));
            // Position sprite
            Object.assign(sprite.position, middlePos);
          }}
        /></div>

      </div>
    );
  }
}

/**
 * This is the parent (highest level) container for the application.  It controls all of the
 * GUI elements as well as the actual graph
 */
class ParentContainer extends React.Component {
   constructor (props) {
   super (props);

      this.state = {
         labels: [],
         selectedMaps: [],
         maps: {},
         readyToRender: 'false',
         selectedLabel: 'test',
         selectedViewOption: 'test',
         selectedPopupOption: 'test',
         showPopup: false,
         selectedNode: ''
      };

      // Set the default querys.  LABEL will be replaced with what the user selected.
      this.nodeQuery = 'MATCH (n:`LABEL`)-[r]->(a) RETURN n,type(r),a';
      this.mapQuery = 'MATCH (n:`LABEL`)-[r]->(a) MAPCLAUSE RETURN n,type(r),a';
      this.viewQuery = 'MATCH (n:`LABEL`)-[r]->(a) where a.shape = "rectangle" RETURN n,type(r),a';
      this.viewDyadQuery = 'MATCH (n:`LABEL`)-[r]->(a) MAPCLAUSE a.shape = "rectangle" RETURN n,type(r),a';
      this.ringQuery ='MATCH p = (b)-[*0..]->(n:`LABEL`)-[*0..]->(a) MAPCLAUSE  a.shape = "SHAPE" and b.shape = "rectangle" RETURN p';
      this.neighborQuery = 'MATCH (n:`LABEL`)-[r]->(a) where n.sourcefile = "SOURCEFILE" and (n.id = ID or a.id = ID) RETURN n,type(r),a';

      // Using this query, when the user selects a circle node the underlying driver retures a failure
      // The query works in the Neo4J browser so I suspect this is a bug in the driver.
      this.subGraphQuery ='MATCH p = (b)-[*0..]->(n:`LABEL`)-[*0..]->(a) where n.id = ID and n.sourcefile = "SOURCEFILE" and b.shape = "circle" RETURN p';
      // Workaround for the above bug. Only used if the user has selected a circle (role node)
      this.subGraphWorkAroundQuery ='MATCH p = (b)-[*]->(n:test) where b.id = ID RETURN p';

      // Bind these functions so that when they get called in the individual components, they
      // execute in the ParentContainer context.
      this.handleSelectLabelChange = this.handleSelectLabelChange.bind(this);
      this.handleSelectMapsChange = this.handleSelectMapsChange.bind(this);
      this.handleSelectViewChange = this.handleSelectViewChange.bind(this);
      this.handlePopupStateChange = this.handlePopupStateChange.bind(this);
      this.handlePopupChange = this.handlePopupChange.bind(this);
      this.triggerRender = this.triggerRender.bind(this);
      this.setMapData = this.setMapData.bind(this);
    
      // the local copy of the graph 
      this.graph = {
         nodes : [],
         links : [],
         setNodesAndLinks : function(nodes, links) {
            this.nodes = nodes;
            this.links = links;
         }
      };
   }

/**
 * Callback function to pass to graphDataFunctions.getNodes.  This function is called in
 * the "then" portion of getNodes once the data has been retrieved from the Neo4J datastore. 
 * The only purpose of the function is to set the readyToRender state variable in this component
 * so that the React framework will re-render with the new node data. The status parameter
 * is currently unused.
 * @param  {String} status currently unused
 * @return {None}
 */
   triggerRender(status) {
     console.log(`In triggerRender `);
     this.setState(
       { readyToRender: 'true'},
     );
   };

/**
 * Function passed to the getMaps function to set the map array
 * @param  {Object} the map array
 * @return {None}
 */
  setMapData (theMaps) {
     console.log("In setMapData ");
     this.setState((state) => {
       let savedMaps = Object.assign({}, state.maps);
       console.log(theMaps);
       savedMaps = theMaps;
       return ({maps: savedMaps});
     });
  }

/**
 * Create a query based on the option the user selected, then call the getNodes function to
 * get the data from the Neo4J database.  We also pass in the callback function that triggers
 * the re-render once the promise in the getNodes function is fulfilled.
 * @param  {String} The option returned from the user's choice in the select in the lower
 *                  level component.
 * @return {None}
 */
   getNodeDataFromSelectViewChange(selectedViewOption) {
     console.log(`In getNodeDataFromSelectViewChange `, selectedViewOption);
     const graphDataFunctions = require('./graphDataFunctions');

     var theQuery;
     // Create the query depending on what the user's selected.
     var andClause = "";
     var mapClause = this.buildSelectedMapClause(this.state.selectedMaps);
     if (mapClause !== "") {
        mapClause = mapClause.concat(" and ");
     } else {
        mapClause = " where";
     }   
     console.log ("map clauses: " + mapClause);

     /* This case statement could easily be confusing.  The point of this code is to present a set 
      * of nodes to the user for viewing/sorting by ring. The user always wants to see the Responsibilities.  
      * If the user is viewing either the Roles or Responsibilities, we show both of those rings for some 
      * context. But if the user is viewing one of the "outer rings" we want to show all of the nodes in the
      * full path to the Responsibilities.  This requires a different query, and a different function to
      * retrieve the nodes from the database.
      */
     switch (selectedViewOption.value) {
         case "all":
             theQuery = this.nodeQuery.replace("LABEL", this.state.selectedLabel);
             graphDataFunctions.getNodes(theQuery, this.graph, this.triggerRender);
             break;

         case "roles":
         case "responsibilities":
             theQuery = this.viewDyadQuery.replace("LABEL", this.state.selectedLabel).replace("MAPCLAUSE", mapClause);
             graphDataFunctions.getNodes(theQuery, this.graph, this.triggerRender);
             break;

//             theQuery = this.ringQuery.replace("LABEL", this.state.selectedLabel).replace("SHAPE", "rectangle").replace("MAPCLAUSE", mapClause);
//             graphDataFunctions.getNodesFromPath(theQuery, this.graph, this.triggerRender);
//             break;

         case "needs":
             theQuery = this.ringQuery.replace("LABEL", this.state.selectedLabel).replace("SHAPE", "diamond").replace("MAPCLAUSE", mapClause);
             graphDataFunctions.getNodesFromPath(theQuery, this.graph, this.triggerRender);
             break;

         case "resources":
             theQuery = this.ringQuery.replace("LABEL", this.state.selectedLabel).replace("SHAPE", "ellipse").replace("MAPCLAUSE", mapClause);
             graphDataFunctions.getNodesFromPath(theQuery, this.graph, this.triggerRender);
             break;

         case "wishes":
             theQuery = this.ringQuery.replace("LABEL", this.state.selectedLabel).replace("SHAPE", "star").replace("MAPCLAUSE", mapClause);
             graphDataFunctions.getNodesFromPath(theQuery, this.graph, this.triggerRender);
             break;

         default:
             console.log ("unsupported view option: " + selectedViewOption.value);
     }
     console.log ("theQuery: " + theQuery);

   };

/**
 * Function passed to the SSMGraphDataCompont component. Function is bound to this context so 
 * that when it is executed in the lower level component, the state will be changed in the
 * parent component representing that the user has toggled the PopupMenu
 * @return {None}
 */
   handlePopupStateChange(node, event) {
     console.log(`In handlePopupStateChange with node: `, node);

     this.setState(prevState => ({
       showPopup: !prevState.showPopup
       }));

     this.setState(prevState => ({
       selectedNode: node
       }));
   };

/**
 * Create a query based on the option the user selected, then call the getNodes function to
 * get the data from the Neo4J database.  We also pass in the callback function that triggers
 * the re-render once the promise in the getNodes function is fulfilled.
 * @param  {String} The option returned from the user's choice in the select in the lower
 *                  level component.
 * @return {None}
 */
   getNodeDataFromPopupChange(selectedPopupOption) {
     console.log(`In getNodeDataFromPopupChange `, selectedPopupOption);
     console.log(`In getNodeDataFromPopupChange with node`, this.state.selectedNode);
     console.log(`In getNodeDataFromPopupChange with node id`, this.state.selectedNode.ssmId);
     var theQuery;

     // Once the user makes a selection, they are done with the popup. So let's make it go away
     this.setState(prevState => ({
       showPopup: !prevState.showPopup
       }));

     // Create the query depending on what the user's selected.
     switch (selectedPopupOption.value) {
         case "roles":
             theQuery = this.viewQuery.replace("LABEL", this.state.selectedLabel);
             console.log ("theQuery: " + theQuery);
             break;

         case "neighbor":
             theQuery = this.neighborQuery.replace("LABEL", this.state.selectedLabel).replace(/ID/g, this.state.selectedNode.ssmId).replace("SOURCEFILE", this.state.selectedNode.sourceFile);
             console.log ("theQuery: " + theQuery);
             break;

         case "sub":
             if (this.state.selectedNode.shape === "circle") {
               // Use the workaround query
               theQuery = this.subGraphWorkAroundQuery.replace("LABEL", this.state.selectedLabel).replace(/ID/g, this.state.selectedNode.ssmId).replace("SOURCEFILE", this.state.selectedNode.sourceFile);
             } else {
               // The normal query
               theQuery = this.subGraphQuery.replace("LABEL", this.state.selectedLabel).replace(/ID/g, this.state.selectedNode.ssmId).replace("SOURCEFILE", this.state.selectedNode.sourceFile);
             }
             console.log ("theQuery: " + theQuery);
             break;

         default:
             console.log ("unsupported option: " + selectedPopupOption.value);
     }
     const graphDataFunctions = require('./graphDataFunctions');

     // Get the data from Neo4j based on the user selection. Add the callback to
     // ensure the re-render happens once the data is all retrieved.
     if (selectedPopupOption.value === "sub") {
        // Path based queries
        graphDataFunctions.getNodesFromPath(theQuery, this.graph, this.triggerRender);
     } else {
        // "Normal node/link queries
        graphDataFunctions.getNodes(theQuery, this.graph, this.triggerRender);
     }
   };

/**
 * Function passed to the PopupComponent component. Function is bound to this context so
 * that when it is executed in the lower level component, the state will be changed in the
 * parent component, we can build the needed query, and call the appropriate getNodeData function.
 * @param  {String} The option returned from the user's choice in the select in the lower
 *                  level component.
 * @return {None}
 */
   handlePopupChange(selectedPopupOption) {
     console.log(`In handlePopupChange `, selectedPopupOption);
     this.getNodeDataFromPopupChange(selectedPopupOption)

     this.setState(
       { selectedPopupOption: selectedPopupOption.value},
     );
   };

/**
 * Function passed to the SelectViewComponent component. Function is bound to this context so 
 * that when it is executed in the lower level component, the state will be changed in the
 * parent component and we can call the appropriate getNodeData function.
 * @param  {String} The option returned from the user's choice in the select in the lower
 *                  level component.
 * @return {None}
 */
   handleSelectViewChange(selectedViewOption) {
     console.log(`In handleSelectViewChange `, selectedViewOption);

     // Call the getNodeDataFromSelectViewChange function to build the correct query 
     // and make the getNodes call.
     this.getNodeDataFromSelectViewChange(selectedViewOption)
     this.setState(
       { selectedViewOption: selectedViewOption.value},
     );
   };


/**
 * Function passed to the SelectLabelComponent component. Function is bound to this context so 
 * that when it is executed in the lower level component, the state will be changed in the
 * parent component and we can call the appropriate getNodeData function.
 * @param  {String} The option returned from the user's choice in the select in the lower
 *                  level component.
 * @return {None}
 */
   handleSelectLabelChange(selectedLabel) {
     console.log(`In handleSelectLabelChange `, selectedLabel);
     const graphDataFunctions = require('./graphDataFunctions');
     var realQuery = this.nodeQuery.replace("LABEL", selectedLabel.value);
     console.log("handleSelectLabelChange ", realQuery);

     // Get the data from Neo4j based on the user selection. Add the callback to
     // ensure the re-render happens once the data is all retrieved.
     graphDataFunctions.getNodes(realQuery, this.graph, this.triggerRender);

     console.log("setting state in handleSelectLabelChange");
     this.setState(
       { selectedLabel: selectedLabel.value}
     );
   };

/**
 * Function to create a "map" clause from an array of selected maps.  This is used to allow
 * the user to select which set of maps they want to view.  It's used in several contexts, which is why
 * it's a function instead of in-line code.
 * @param  {String} The option array returned from the user's choice in the select in the lower
 *                  level component.
 * @return {String} The possible empy string which contains the where clause to include in a node query.
 */
  buildSelectedMapClause(selectedMaps) {
     console.log(`In buildSelectedMapClause `, selectedMaps);

     var mapClause;
     var newClause;
     
     if (selectedMaps === undefined || selectedMaps ===  null || selectedMaps.length === 0) {
       // If the user hasn't selected any maps, we show them all
       mapClause = "";
     } else {
       console.log(`maps length is `, selectedMaps.length);
       // We set the map clause to include an or clause for every map
       mapClause = "where (";
       for (var i = 0; i < selectedMaps.length; i++) {
          newClause = "n.sourcefile = '" + selectedMaps[i].value + "'";
          if ( i === 0) {
            // The first clause : just append the condition
            mapClause = mapClause.concat(newClause);
          } else {
            // Not the first condition: we'll need an or clause
            mapClause = mapClause.concat(" or ").concat(newClause);
          }
       }
       mapClause = mapClause.concat(")")
     }

     return (mapClause);
  }

/**
 * Function passed to the SelectMap component. Function is bound to this context so 
 * that when it is executed in the lower level component, the state will be changed in the
 * parent component and we can call the appropriate getNodeData function.
 * @param  {String} The option array returned from the user's choice in the select in the lower
 *                  level component.
 * @return {None}
 */
   handleSelectMapsChange(selectedMaps) {
     console.log(`In handleSelectMapsChange `, selectedMaps);
     const graphDataFunctions = require('./graphDataFunctions');

     var mapClause = this.buildSelectedMapClause(selectedMaps);
     var realQuery = this.mapQuery.replace("LABEL", this.state.selectedLabel).replace("MAPCLAUSE", mapClause);
     console.log("handleSelectMapsChange ", realQuery);

     // Get the data from Neo4j based on the user selection. Add the callback to
     // ensure the re-render happens once the data is all retrieved.
     graphDataFunctions.getNodes(realQuery, this.graph, this.triggerRender);

     console.log("setting state in handleSelectMapsChange");
     this.setState(
       { selectedMaps: selectedMaps}
     );
   };


/**
 * This is the render function for the top-level component.
 * The container is for controls. The SSMGraphData component is the actual graph
 */
   render () {
   return (
      <div>
        <div className="header"><h4>SSM Visualization</h4></div>
        <Container>
           <Row>
              <Col md="auto"><SelectLabelComponent handleLabelChange={this.handleSelectLabelChange} setMapData={this.setMapData}/></Col>
              <Col md="auto"><SelectMapsComponent handleMapChange={this.handleSelectMapsChange} 
                                                  label={this.state.selectedLabel}/></Col>
              <Col md="auto"><SelectViewComponent handleViewChange={this.handleSelectViewChange}/></Col>
              <Col md="auto"><PopupComponent showPopup={this.state.showPopup} handlePopupChange={this.handlePopupChange}/></Col>
           </Row>   
        </Container>   
        <SSMGraphData handlePopupStateChange={this.handlePopupStateChange} label={this.state.selectedLabel} graph={this.graph}/>
     </div>
   );
   }
}
// ========================================

ReactDOM.render(
  <ParentContainer />,
  document.getElementById('root')
)
