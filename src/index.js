import * as React from "react";
import { Container } from 'react-layout-components';
import { Row, Col } from 'react-bootstrap';
// import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import * as util from 'util';
import { ForceGraph3D } from 'react-force-graph';
import * as graphDataFunctions from "./graphDataFunctions.js";
import 'react-sprite';
import 'three-spritetext';
import SpriteText from 'three-spritetext';
//import Popup from "reactjs-popup";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
//import Popper from 'popper.js';
//import { Dropdown, MenuItem, DropdownButton } from "react-bootstrap";
import Select from 'react-select';

// Other app components
import ConceptMapComponent from './ConceptMapComponent.js'
import ConceptComponent from './ConceptComponent.js'
import ConceptPopupComponent from './ConceptPopupComponent.js'
import ConceptSelectComponent from './ConceptSelectComponent.js'

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

//  console.log("Rendering the label component with labels: ", this.state.labels);
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
        distinctLabelQuery: 'MATCH (n) where n.shape <> "concept" RETURN distinct n.sourcefile, labels(n)'
     };

     this.handleMapsChange = this.handleMapsChange.bind(this);
     graphDataFunctions.getMaps(this.state.distinctLabelQuery, this);
  }

/**
 * Function passed to the getMaps function to set the map array
 * @param  {Object} the map array
 * @return {None}
 */
  setMaps (theMaps) {
//   console.log("In setMaps ");
     this.setState((state) => {
       let savedMaps = Object.assign({}, state.maps);
       //nsole.log(theMaps);
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
    //nsole.log("Maps selected: ", selectedOptions);
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

 //    console.log("Rendering the map component with maps: ", this.state.maps);
    
       // The very cool multi select widget.  It returns a possibly empty array of user selected values.
       return (
       <div style={{width: '400px'}}>
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
     //console.log("In constructor for SelectViewComponent");

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
        { value: 'concepts', label: 'Concept Nodes'},
        ];


     this.handleViewChange = this.handleViewChange.bind(this);
  }

/**
 * Local binding for the passed in function
 * @param  {Object} the user selected option
 * @return {None}
 */
  handleViewChange(selectedOption) {
    //nsole.log(`Option selected:`, this.state.selectedOption);
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
     //nsole.log("In constructor for PopupComponent");

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
    //nsole.log(`Option selected:`, this.state.selectedOption);
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
 * @param  {Object} a property object that includes the handleRightClick function, the selected 
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
 * The on click handler. Currently unused
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
 * The render function
 * @return {None}
 */
render() {
    
    console.log("rendering graph with label " + this.props.label);

    if (typeof this.props.graph === 'undefined') {
       return null;
    }

    const inputData = this.props.graph;

//    var data = { nodes: inputData.nodes,
//                 links: inputData.links};

      var data = {};
      data.nodes = [...inputData.nodes];
      data.links = [...inputData.links];

 // console.log("rendering nodes " , data.nodes);
    console.log("********** Nodes to render ****");
    console.log("nodes ", data.nodes);
//  console.log("rendering links " , data.links);
    console.log("********** Links to render ****");
    console.log("links ", data.links);

    return (
      <div>
        
        <div className="theGraph"><
           ForceGraph3D graphData={data} 
           nodeRelSize={10}
           onNodeClick={this.props.handleClick}
           onNodeRightClick={this.props.handleRightClick}
		   onLinkClick={this.props.handleLinkClick}
		   onLinkRightClick={this.props.handleLinkRightClick}
           nodeVisibility={"visibility"}
           linkVisibility={"visibility"}
		   backgroundColor={"darkgrey"}
           linkDirectionalArrowLength={3}
           linkWidth={2}
           linkDirectionalArrowRelPos={1}
           linkOpacity={1}
           linkThreeObjectExtend={true}
           linkThreeObject={link => {
            // extend link with text sprite
            const sprite = new SpriteText(`${link.sourceName} > ${link.targetName}`);
            sprite.color = 'black';
            sprite.textHeight = 3.0;
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
         popupDiv:{
                padding: 5000,
                top: 300 + 'px',
                left: 300 + 'px', // hide div first
                position: 'absolute'
            },
         labels: [],
         selectedMaps: [],
         selectedConcepts: [],
         maps: {},
         conceptNodes: [],
         conceptLinks: [],
         readyToRender: 'false',
         selectedLabel: '',
         selectedViewOption: '',
         selectedPopupOption: 'test',
         selectedConceptPopupOption: 'test',
         selectedConceptMapOption: {value: "none", label: "none"},
         selectedConceptSelectOption: {value: "none", label: "none"},
         selectedConceptOption: 'new',
         showPopup: false,
         showConceptPopup: false,
         selectedNode: '',
         selectedLink: ''
      };

      // Set the default querys.  LABEL will be replaced with what the user selected.
      // This quert gives all the nodes for a given label.  All the other queries used to return
      // nodes also include the label.
      this.nodesByLabelQuery = 'MATCH (n:`LABEL`)-[r]->(a) RETURN n,type(r),a';

	  // This query is used to add nodes with no relationships into the graph. The
	  // most common time this will happen is when a concept node has been added and there are no links
	  // to it.
	  this.orphanQuery = 'MATCH (n:`LABEL`) WHERE NOT (n)-[*]-() and n.shape <> "noBorder" and n.sourcefile = "MAP" RETURN n';
	  this.singleNodeQuery = 'MATCH (n:`LABEL`) WHERE  n.id = ID and n.sourcefile = "MAP" RETURN n';
      this.mapQuery = 'MATCH (n:`LABEL`)-[r]->(a) MAPCLAUSE RETURN n,type(r),a';

      // Queries for the popup menu
      this.popupRoleQuery = 'MATCH (n:`LABEL`)-[r]->(a) where a.shape = "rectangle" and n.sourcefile = "SOURCEFILE" RETURN n,type(r),a';
      this.popupNeighborQuery = 'MATCH (n:`LABEL`)-[r]->(a) where n.sourcefile = "SOURCEFILE" and (n.id = ID or a.id = ID) RETURN n,type(r),a';

      // Using this query, when the user selects a circle node the underlying driver retures a failure
      // The query works in the Neo4J browser so I suspect this is a bug in the driver.
      this.popupSubGraphQuery ='MATCH p = (b)-[*0..]->(n:`LABEL`)-[*0..]->(a) where n.id = ID and n.sourcefile = "SOURCEFILE" and b.shape = "circle" RETURN p';
      // Wokaround for the above bug. Only used if the user has selected a circle (role node)
      this.popupSubGraphWorkAroundQuery ='MATCH p = (b)-[*]->(n:test) where b.id = ID RETURN p';

      // Bind these functions so that when they get called in the individual components, they
      // execute in the ParentContainer context.
      this.handleSelectLabelChange = this.handleSelectLabelChange.bind(this);
      this.handleSelectMapsChange = this.handleSelectMapsChange.bind(this);
      this.handleSelectViewChange = this.handleSelectViewChange.bind(this);
      this.handleRightClick = this.handleRightClick.bind(this);
      this.handleLinkClick = this.handleLinkClick.bind(this);
      this.handleLinkRightClick = this.handleLinkRightClick.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handlePopupChange = this.handlePopupChange.bind(this);
      this.handleConceptPopupChange = this.handleConceptPopupChange.bind(this);
      this.handleConceptMapChange = this.handleConceptMapChange.bind(this);
      this.handleConceptSelectChange = this.handleConceptSelectChange.bind(this);
      this.handleConceptChange = this.handleConceptChange.bind(this);
      this.handleConceptListChange = this.handleConceptListChange.bind(this);
      this.getNodeCallback = this.getNodeCallback.bind(this);
      this.writeNodeCallback = this.writeNodeCallback.bind(this);
      this.triggerRender = this.triggerRender.bind(this);
      this.setMapData = this.setMapData.bind(this);
      this.addConceptNode = this.addConceptNode.bind(this);
      this.addConceptLink = this.addConceptLink.bind(this);

    
      // the local copy of the graph 
      this.graph = {
         nodes : [],
         links : [],
         setNodesAndLinks : function(nodes, links) {
            console.log("***************************");
            console.log("setNodesAndLinks" );
            console.log("***************************");
            this.nodes = [...nodes];
            this.links = [...links];
         },

         appendNodeAndLink : function(nodes, links) {
            console.log("***************************");
            console.log("current nodes: ", this.nodes)
            console.log("current links: ", this.links)
            console.log("nodes to add: ", nodes)
            console.log("links to add: ", links)
            if (nodes !== undefined && nodes !==  null && nodes.length !== 0) {
               let nodeCopy = Object.assign({}, nodes);
               this.nodes.push(nodeCopy);
            }
            if (links !== undefined && links !==  null && links.length !== 0) {
               let linkCopy = Object.assign({}, links);
               this.links.push(linkCopy);
            }
            for (var i = 0; i < this.links.length; i++) {
               console.log("final link: " , this.links[i]);
            }
            console.log("***************************");
         }

      };
   }

/**
 * Function passed to the ConceptComponent.  It's called when a new
 * concept is created in the map.  The ConceptComponent creates a new node and
 * this function adds it to the list in the state array so it can eventually be 
 * rendered properly.
 * @param  {Object} the newly created concept node
 * @return {None}
 */
  addConceptNode (theNode) {
 //    this.graph.appendNodeAndLink(theNode, null);
     const graphDataFunctions = require('./graphDataFunctions');
	 graphDataFunctions.writeANode(theNode, this.writeNodeCallback);
 return;

//   console.log("in addConceptNode: ", theNode);
//   this.setState({
//     conceptNodes: [...this.state.conceptNodes, theNode]
//   })
  }   

/**
 * Callback function to pass to getSingleNode.
 * @param  {Object} the node retireved from the database
 * @return {None}
 */
  writeNodeCallback (theNode) {
     var realQuery = this.singleNodeQuery.replace("LABEL", this.state.selectedLabel).replace("MAP", this.state.selectedConceptMapOption.value).replace("ID", theNode.id);
	 console.log("realQuery in writeNodeCallback", realQuery);
     graphDataFunctions.getSingleNode(realQuery, this.getNodeCallback);
  }

/**
 * Callback function to pass to getSingleNode.
 * @param  {Object} the node retireved from the database
 * @return {None}
 */
  getNodeCallback (theNode) {
 //    this.graph.appendNodeAndLink(theNode, null);
     console.log("in getNodeCallback: ", theNode);
     theNode.visibility = true;
     this.graph.appendNodeAndLink(theNode, null);
     this.triggerRender(true);
  }

/**
 * Function to create the ConceptComponent.  It's called when the user has selected 
 * the link function from the concept map and has selected the node to which to link
 * the concept. Thus function creates the link and adds it to the conceptLinks array so
 * it can be properly rendered and eventually stored in the database,
 * @param  {Object} The concept node
 * @param  {Object} The node being linked to the concpet node.
 * @return {None}
 */
  addConceptLink (conceptNode, targetNode) {
     //nsole.log("in addConceptLink: ", targetNode);
     const graphDataFunctions = require('./graphDataFunctions');

     // Create a link connecting the concept and target nodes
     var theLink = {
         source: conceptNode.id,
         target: targetNode.id,
         sourceName: conceptNode.name,
         targetName: targetNode.name,
         color: graphDataFunctions.colorTable["conceptLink"],
		 visibility: true,
         name: conceptNode.name
      }
     console.log("in addConceptLink: link is", theLink);
     this.graph.appendNodeAndLink(null, theLink);
     
     this.setState({
       conceptLinks: [...this.state.conceptLinks, theLink]
     })
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
     var nodeLength = this.state.conceptNodes.length;
     for (var i = 0; i < nodeLength; i++) {
         if (this.state.conceptNodes[i].zombie === false) {
            // A zombie node has been removed from the database, but the 
            // database may not have been re-read before this render.
            this.graph.appendNodeAndLink(this.state.conceptNodes[i], null);
		 }
     }    

     var linkLength = this.state.conceptLinks.length;
     for (i = 0; i < linkLength; i++) {
         if (this.state.conceptLinks[i].zombie === false) {
            // A zombie link has been removed from the database, but the 
            // database may not have been re-read before this render.
            console.log("appending link: ", this.state.conceptLinks[i]);
            this.graph.appendNodeAndLink(null, this.state.conceptLinks[i]);
         }
     }    

    console.log("calling this.filterNodesAndLinks with: ", 
                this.state.selectedViewOption);
    this.filterNodesAndLinks(this.state.selectedViewOption, 
                             this.state.selectedConceptMapOption, 
							 this.state.selectedConcepts, true);

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
 * Is this node in one of the user selected maps.  If so, return true, otherwise false.
 * @param  {String} The node to check
 * @param  {Array}  The array of user selected maps.
 *                 
 * @return {Boolean} True if the node is in one of the selected maps, otherwise false.
 */
   isNodeInMapList(node, selectedMaps) {
     console.log("isNodeInMapList selectedMaps: ", selectedMaps);
     console.log("isNodeInMapList node: ", node);
     if (selectedMaps === undefined || 
        selectedMaps ===  null || selectedMaps.length === 0) {
           // No maps selected: By default we want to show all maps
           // so we return true
           return true;
     }
     for (var i = 0; i < selectedMaps.length; i++) {
        console.log("comparing " + node.sourcefile + " to " + selectedMaps[i].value);
        if (node.sourceFile === selectedMaps[i].value) {
           console.log("node found returning true  node: ", node);
           // The node is in a selected map.
           return true;
        }
     }
 
     // If we got here, it wasn't found
     console.log("node not found returning false  node: ", node);
     return false;
   }


/**
 * Is this concept one of the user selected concepts.  If so, return true, otherwise false.
 * @param  {String} The concept to check
 * @param  {Array}  The array of user selected concepts.
 *                 
 * @return {Boolean} True if the node is in one of the selected maps, otherwise false.
 */
   isConceptInConceptList(concept, selectedConcepts) {
     console.log("isConceptInConceptist node: ", concept);
     console.log("isConceptInConceptist selectedConcepts: ", selectedConcepts);
     if (selectedConcepts === undefined || 
        selectedConcepts ===  null || selectedConcepts.length === 0) {
           // No concepts selected: By default we want to show all concepts
           // so we return true
           return true;
     }
     for (var i = 0; i < selectedConcepts.length; i++) {
        console.log("comparing " + concept.sourcefile + " to " + selectedConcepts[i].value);
        if (concept.name === selectedConcepts[i].value) {
           console.log("concept found returning true  concept: ", concept);
           // The concept one of the user selected concepts.
           return true;
        }
     }
 
     // If we got here, it wasn't found
     console.log("concept not found returning false concept: ", concept);
     return false;
   }

/**
 * Filter the node and link lists based on the selectedViewOption. This avoids a query to the
 * database and is a lot easier to understand and code than the old way.  We simply set the
 * visibility of all of the nodes we don't want to see to false: any link that has either
 * node not visible is also marked as not visible.
 * @param  {String} The option returned from the user's choice in the select in the lower
 *                  level component.
 * @param  {String} Whether or not we are showing concept nodes.
 *                 
 * @return {None}
 */
   filterNodesAndLinks(selectedViewOption, selectedConceptMapOption, 
                       selectedConcepts, showConceptNodes) {
     console.log("***************************");
     console.log(`In filterNodesAndLinks `, selectedViewOption);
     console.log("length of node array: ", this.graph.nodes.length);
     console.log("selectedMaps of node array: ", this.state.selectedMaps);
     console.log("selectedViewOption: ", selectedViewOption);
     console.log("selectedNode: ", this.state.selectedNode);
     console.log("selectedConcepts: ", selectedConcepts);
     console.log("***************************");
     var filteredNodes = {};
     var conceptLinkedNodes = {};
     var i = 0;
     if (selectedViewOption !== undefined && 
        selectedViewOption !==  null && selectedViewOption.length !== 0) {
        // No view filtering has been asked for, let's not do any.

       // Start with filtering by selectedView
	   // Note that the isNodeInMapList function detemines whether or not the node
	   // is in a map currently selected for display by the Select Maps component.
	   console.log("selectedViewOption 0: ", selectedViewOption);
       switch (selectedViewOption.value) {
           case "all":
	           console.log("selectedValue 1: ", selectedViewOption.value);
               for (i = 0; i < this.graph.nodes.length; i++) {
                 if (this.isNodeInMapList(this.graph.nodes[i], this.state.selectedMaps)) {
                    this.graph.nodes[i].visibility = true;
                    filteredNodes[this.graph.nodes[i].id]  = 0;
                 } else {
                    this.graph.nodes[i].visibility = false;
                    filteredNodes[this.graph.nodes[i].id] = 1;
                 }
               }
               break;
   
           case "roles":
           case "responsibilities":
	           console.log("selectedValue 2: ", selectedViewOption.value);
               for (i = 0; i < this.graph.nodes.length; i++) {
                  if ((this.graph.nodes[i].shape !== "circle" && 
                      this.graph.nodes[i].shape !== "rectangle") || 
                      (!this.isNodeInMapList(this.graph.nodes[i], this.state.selectedMaps))) {
                     console.log("unsetting visibility for node: ", i);
                     this.graph.nodes[i].visibility = false;
                     filteredNodes[this.graph.nodes[i].id] = 1;
                  } else {
                     this.graph.nodes[i].visibility = true;
                     filteredNodes[this.graph.nodes[i].id] = 0;
                  }
               }
               break;
   
           case "needs":
	           console.log("selectedValue 3: ", selectedViewOption.value);
               for (i = 0; i < this.graph.nodes.length; i++) {
                  if ((this.graph.nodes[i].shape !== "diamond" && 
                      this.graph.nodes[i].shape !== "rectangle") ||
                      (!this.isNodeInMapList(this.graph.nodes[i], this.state.selectedMaps))) {
                     console.log("unsetting visibility for node: ", i);
                     this.graph.nodes[i].visibility = false;
                     filteredNodes[this.graph.nodes[i].id] = 1;
                  } else {
                     this.graph.nodes[i].visibility = true;
                     filteredNodes[this.graph.nodes[i].id] = 0;
                  }
               }
               break;
   
           case "resources":
	           console.log("selectedValue 4: ", selectedViewOption.value);
               for (i = 0; i < this.graph.nodes.length; i++) {
                  if ((this.graph.nodes[i].shape !== "diamond" && 
                      this.graph.nodes[i].shape !== "ellipse" && 
                      this.graph.nodes[i].shape !== "rectangle") ||
                      (!this.isNodeInMapList(this.graph.nodes[i], this.state.selectedMaps))) {
                     console.log("unsetting visibility for node: ", i);
                     this.graph.nodes[i].visibility = false;
                     filteredNodes[this.graph.nodes[i].id] = 1;
                  } else {
                     this.graph.nodes[i].visibility = true;
                     filteredNodes[this.graph.nodes[i].id] = 0;
                  }
               }
                break;
   
           case "wishes":
	           console.log("selectedValue 5: ", selectedViewOption.value);
               for (i = 0; i < this.graph.nodes.length; i++) {
                  if ((this.graph.nodes[i].shape !== "diamond" && 
                      this.graph.nodes[i].shape !== "ellipse" && 
                      this.graph.nodes[i].shape !== "star" && 
                      this.graph.nodes[i].shape !== "rectangle") ||
                      (!this.isNodeInMapList(this.graph.nodes[i], this.state.selectedMaps))) {
                     console.log("unsetting visibility for node: ", i);
                     this.graph.nodes[i].visibility = false;
                     filteredNodes[this.graph.nodes[i].id] = 1;
                  } else {
                     this.graph.nodes[i].visibility = true;
                     filteredNodes[this.graph.nodes[i].id] = 0;
                  }
               }    
               break;
   
           case "concepts":
               console.log("selectedValue 6: ", selectedViewOption.value);
               // If there is no selected node, or the selected node is not a 
               // concept we don't care
               if (this.state.selectedNode !== "" &&
                   this.state.selectedNode.shape === "concept") {
                  // Now look at all the links. Turn on any node that is linked to the
                  // selected concept,
                  var source;
                  var target;
                  var linkedNode;
                  for (i = 0; i < this.graph.links.length; i++) {
                      // OK, so this is a bit weird.  Because the react force 3d rendering
                      // can change the value of what is rendered, the links can be in 2 forms.
                      // Rather than argue about it, we handle either case. Strange but it works.
                      if (this.graph.links[i].source.id !== undefined) {
                         source = this.graph.links[i].source.id;
                         target = this.graph.links[i].target.id;
                      } else {
                         source = this.graph.links[i].source;
                         target = this.graph.links[i].target;
                      }
                      if ((source === this.state.selectedNode.id) ||
                          (target === this.state.selectedNode.id)) {
                          linkedNode = (source === this.state.selectedNode.id) ? target : source
						  // This is the array of node ids that are linked to the selected node.
                          conceptLinkedNodes[linkedNode] = 1;
                          console.log("adding to conceptLinkedNodes ", linkedNode)
                      }
                  }

				  // Now we go through all of the nodes setting the visibility of all of the
				  // nodes that are both in the mapped list and in the conceptLinked nodes
				  // to true
                  for (i = 0; i < this.graph.nodes.length; i++) {
                    if (this.isNodeInMapList(this.graph.nodes[i], this.state.selectedMaps)) {
					   // The node is in a visible map. Is it linked to the selected concept node? 
					   if (conceptLinkedNodes[this.graph.nodes[i].id] === 1) {
					      // Yes:  Make sure the node is visible
                          this.graph.nodes[i].visibility = true;
                          filteredNodes[this.graph.nodes[i].id] = 0;
                       } else {
                          // No: turn off the node
                          this.graph.nodes[i].visibility = false;
                          filteredNodes[this.graph.nodes[i].id] = 1;
					   }
                    }
                 }
               } else {
			      // Let's be nice and mention to the user that they have not selected a concept
				  alert("No concept selected: select a concept and try again");
			   }
			   break;

           default:
	           console.log("selectedValue 7: ", selectedViewOption.value);
               console.log ("unsupported view option: " , selectedViewOption);
               break;
       }
     }

     // One more thing: we want to handle conceptNodes. They are turned off or on 
     // with the showConceptNodes flag: This needs to be updated to handle the 
     // "Concept Maps"
     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
     console.log("filtering concepts for map: ", selectedConceptMapOption);
     console.log("filteredNodes: ", filteredNodes);
     console.log("showConceptNodes: ", showConceptNodes);
     console.log("option: ", selectedViewOption.value);
     console.log("selectedNode: ", this.state.selectedNode);
     console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
     for (i = 0; i < this.graph.nodes.length; i++) {
        if (this.graph.nodes[i].shape === "concept") {
           var conceptMapForThisNode = this.graph.nodes[i].sourceFile;
           console.log("node: ", this.graph.nodes[i]);
           console.log("conceptMapForThisNode: ", conceptMapForThisNode);
           console.log("zombie: ", this.graph.nodes[i].zombie);
           console.log("filtered: ", filteredNodes[this.graph.nodes[i].id] );
		   if (selectedViewOption.value === "concepts" &&
		       this.state.selectedNode.id !== this.graph.nodes[i].id) {
			   // We are in "concept mode". We only want to show the
			   // selected node.
			  console.log ("turning off ", this.graph.nodes[i])
              this.graph.nodes[i].visibility = false;
              filteredNodes[this.graph.nodes[i].id] = 1;
		   } else if (showConceptNodes && 
               conceptMapForThisNode === selectedConceptMapOption.value &&
			   this.isConceptInConceptList(this.graph.nodes[i], selectedConcepts) &&
			   this.graph.nodes[i].zombie !== true) {
              console.log("turning on node: ", this.graph.nodes[i]);
              this.graph.nodes[i].visibility = true;
              filteredNodes[this.graph.nodes[i].id] = 0;
           } else {   
              this.graph.nodes[i].visibility = false;
              filteredNodes[this.graph.nodes[i].id] = 1;
           }   
        }
     }   

     // At this point we have created the filtered node list.  Any link which connects
     // to any node in the list should also not be rendered
     console.log("filteredNodes: ", filteredNodes);
	 var sourceNode;
	 var targetNode;
     for (i = 0; i < this.graph.links.length; i++) {
		// OK, so this is a bit weird.  Because the react force 3d rendering
		// can change the value of what is rendered, the links can be in 2 forms here.
		// Rather than argue about it, we just handle either case. Strange but it works.
		if (this.graph.links[i].source.id !== undefined) {
           sourceNode = this.graph.links[i].source.id;
           targetNode = this.graph.links[i].target.id;
		} else {
           sourceNode = this.graph.links[i].source;
           targetNode = this.graph.links[i].target;
		}
//      console.log("filtering links: source node:" , sourceNode);
        if (filteredNodes[sourceNode] === 1 || 
            filteredNodes[targetNode] === 1 ||
            this.graph.links[i].zombie === true ){
           console.log("setting visibility for link: ", i);
           this.graph.links[i].visibility = false;
        } else { 
           this.graph.links[i].visibility = true;
        }
     }

     // Now we can re-render
//     this.triggerRender();
   };

/**
 * Create a query based on the option the user selected, then call the getNodes function to
 * get the data from the Neo4J database.  We also pass in the callback function that triggers
 * the re-render once the promise in the getNodes function is fulfilled.
 * @param  {String} The option returned from the user's choice in the select in the lower
 *                  level component.
 * @return {None}
 */
   getNodeDataFromSelectViewChange(selectedViewOption) {
      this.filterNodesAndLinks(selectedViewOption.value, true);
   }


/**
 * The on link click handler
 * @param  {Object} the node object that was clicked on.
 * @return {None}
 */
   handleLinkClick(link, event) {

     const graphDataFunctions = require('./graphDataFunctions');
     console.log(`In handleLinkClick with node: `, link);
     console.log(`In handleLinkClick with event: `, event);
     console.log(`In handleLinkClick with selectedConceptOption: `,
                  this.state.selectedConceptOption);
     if ( this.state.selectedConceptOption.value === "deleteLink") {
        if (link.source.shape === "concept") {
          var confirmText =
               "Deleting link " + link.name + 
               " from node " + link.sourceName + 
               " to " + link.targetName;
          if (window.confirm(confirmText)) {
             console.log(confirmText);
             link.visibility = false;

             // Mark this link as a zombie so it doesn't get rendered.
             link.zombie = true;
             graphDataFunctions.deleteALink(link.source, link.target, this.triggerRender);
          }
       } else {
         alert("Only concept links may be deleted");
       }
     } else {
        alert("Link name: " + link.name + "\n" + 
              "Source: " + link.sourceName + "\n" +
              "Target: " + link.targetName);
   } 
};

/**
 * Callback function to pass to deleteALink
 * @param  {boolean} true or false, ignored currently
 * @return {None}
 */
  deleteLinkCallback (val) {
 //    this.graph.appendNodeAndLink(theNode, null);
     console.log("in deleteLinkCallback: ", val);
     this.triggerRender(true);
  }

/**
 * The on click handler
 * @param  {Object} the node object that was clicked on.
 * @return {None}
 */
   handleClick(node, event) {

     const graphDataFunctions = require('./graphDataFunctions');
     var type = graphDataFunctions.shapeTable[node.shape];
     console.log(`In handleClick with node: `, node);
     console.log(`In handleClick with event: `, event);
     console.log(`In handleClick with selectedConceptOption: `, 
                  this.state.selectedConceptOption);
     if (this.state.selectedNode.shape === "concept" && 
         this.state.selectedConceptOption.value === "link") {
		// The user wants to link this node to another node.
        if (this.state.selectedNode.id === node.id) {
		   // You can't link a node to itself
           alert("Linking node to itself is not allowed");
           return;
        }  else {
           var confirmText = 
             "Linking node " + node.name + " with node " + this.state.selectedNode.name;
           if (window.confirm(confirmText)) {
		      // The user actually wants to make the link
              console.log(confirmText);
              const graphDataFunctions = require('./graphDataFunctions');
		      graphDataFunctions.writeALink(this.state.selectedNode, node, null);
              this.addConceptLink(this.state.selectedNode, node);
           }
        }
	 } else if (this.state.selectedNode.shape === "concept" &&
	          this.state.selectedConceptOption.value === "deleteConcept") {
		// The user wants to delete this node.  Note they can only delete concept nodes
		// Do we want to alert?
       confirmText = "Deleting node " + node.name + " and all it's links";
       if (window.confirm(confirmText)) {
          console.log(confirmText);
		  // Mark this node as a zombie to prevent rendering before the database
		  // is re-read
		  var dummySelectedNode = {...this.state.selectedNode}
		  dummySelectedNode.zombie = true
		  this.setState(prevState => ({
             selectedNode: dummySelectedNode
          }));
//  this.state.selectedNode.zombie = true;
          const graphDataFunctions = require('./graphDataFunctions');
	      graphDataFunctions.deleteANode(this.state.selectedNode, this.triggerRender);
       }
     } else {
        alert("Node name: " + node.name + "\n" + "Node type: " + type);
     }
   };

/**
 * Function passed to the SSMGraphDataCompont component. Function is bound to this context so 
 * that when it is executed in the lower level component, the state will be changed in the
 * parent component representing that the user has toggled the PopupMenu
 * @return {None}
 */
   handleRightClick(node, event) {
     console.log(`In handleRightClick with node: `, node);
     console.log(`In handleRightClick with event: `, event);
     if (node.shape === "concept") {
	   // Setting node to selected node color"
       console.log(`In handleRightClick setting node color`);
	   if (node.color === graphDataFunctions.colorTable["concept"]) {
	      // Node is not selected so swith to the selected color
          node.color = graphDataFunctions.colorTable["conceptSelected"];

          // Mark this as the selected node
          this.setState(prevState => ({
            selectedNode: node
          }));
       } else {
	      // Node is already selected so swith to the basic color
          node.color = graphDataFunctions.colorTable["concept"];

          // No node is currently selected
          this.setState(prevState => ({
            selectedNode: ''
          }));
	   }
	 }  
	 return;
   };

/**
 * Function passed to the SSMGraphDataCompont component. Function is bound to this context so
 * that when it is executed in the lower level component, the state will be changed in the
 * parent component representing that the user has toggled the PopupMenu
 * @return {None}
 */
   handleLinkRightClick(link, event) {
     console.log(`In handleRightLinkClick with link: `, link);
     console.log(`In handleRightLinkClick with event: `, event);
     
     if (link.color === graphDataFunctions.colorTable["link"]) {
       // This is not a concept link so there is nothing to fdo
       return
     }
     if (link.color === graphDataFunctions.colorTable["conceptLink"]) {
        // Node is not selected so swith to the selected color
        link.color = graphDataFunctions.colorTable["conceptLinkSelected"];

        // Mark this as the selected node
        this.setState(prevState => ({
          selectedLink: link
         }));
     } else {
        // Node is already selected so swith to the basic color
        link.color = graphDataFunctions.colorTable["conceptLink"];

        // No node is currently selected
        this.setState(prevState => ({
          selectedlink: ''
        }));
     }
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

     // Also, once the user has selected one node, they are working with just one map, so we should
     // reset the selectedMaps list.  This requires us to search the current selected maps list for the
     // one that matches the sourceFile of the selected node ???. Note this whole menu may be going away...

     // Create the query depending on what the user's selected.
     switch (selectedPopupOption.value) {
         case "roles":
             theQuery = this.popupRoleQuery.replace("LABEL", this.state.selectedLabel).replace("SOURCEFILE", this.state.selectedNode.sourceFile);
             console.log ("theQuery: " + theQuery);
             break;

         case "neighbor":
             theQuery = this.popupNeighborQuery.replace("LABEL", this.state.selectedLabel).replace(/ID/g, this.state.selectedNode.ssmId).replace("SOURCEFILE", this.state.selectedNode.sourceFile);
             console.log ("theQuery: " + theQuery);
             break;

         case "sub":
             if (this.state.selectedNode.shape === "circle") {
               // Use the workaround query
               theQuery = this.popupSubGraphWorkAroundQuery.replace("LABEL", this.state.selectedLabel).replace(/ID/g, this.state.selectedNode.ssmId).replace("SOURCEFILE", this.state.selectedNode.sourceFile);
             } else {
               // The normal query
               theQuery = this.popupSubGraphQuery.replace("LABEL", this.state.selectedLabel).replace(/ID/g, this.state.selectedNode.ssmId).replace("SOURCEFILE", this.state.selectedNode.sourceFile);
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
        graphDataFunctions.getNodesFromPath(theQuery, this.graph,  this.triggerRender);
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
 * Take action based on the option the user selected. If they are saving or deleting we need
 * to generate and execute a query.  If they are adding a link we need to arrang things so 
 * that the next left click on a non-concept node creates the link and add it's it to the
 * list of in memory links.
 * @param  {String} The option returned from the user's choice in the select in the lower
 *                  level component.
 * @return {None}
 */
   processConceptPopupChange(selectedConceptPopupOption) {
     console.log(`In processConceptPopupChange `, selectedConceptPopupOption);
     console.log(`In processConceptPopupChange with node`, this.state.selectedNode);
     console.log(`In processConceptPopupChange with node id`, this.state.selectedNode.ssmId);
     const graphDataFunctions = require('./graphDataFunctions');

     // Once the user makes a selection, they are done with the popup. So let's make it go away
     // ??? Is this actually the behavior we want here?  Might be awkward for adding multiple links,
     // but maybe make it easier to be sure we are creating the correct linlk.  Needs mor thought
//   this.setState(prevState => ({
//     showConceptPopup: !prevState.showConceptPopup
//     }));

     // Create the query depending on what the user's selected.
     switch (selectedConceptPopupOption.value) {
         case "link":
             break;

         case "delete":
             break;

         case "save":
		     graphDataFunctions.writeNodesAndLinks(this.state.conceptNodes, 
			                                       this.state.conceptLinks,
												   this.readyToRender);
             break;

         default:
             console.log ("unsupported option: " + selectedConceptPopupOption.value);
     }

   };


/**
 * Function passed to the ConceptPopupComponent component. Function is bound to this context so
 * that when it is executed in the lower level component, the state will be changed in the
 * parent component, we can build the needed query, and call the appropriate getNodeData function.
 * @param  {String} The option returned from the user's choice in the select in the lower
 *                  level component.
 * @return {None}
 */
   handleConceptPopupChange(selectedConceptPopupOption) {
     console.log(`In handleConceptPopupChange `, selectedConceptPopupOption);
     this.processConceptPopupChange(selectedConceptPopupOption);
     this.setState(
       { selectedConceptPopupOption: selectedConceptPopupOption.value},
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
     var showConceptNodes = false;
     if (selectedViewOption.value === "all" || selectedViewOption.value === "concepts") {
        showConceptNodes = true;
     }

     this.filterNodesAndLinks(selectedViewOption,
                              this.state.selectedConceptMapOption, 
							  this.state.selectedConcepts, showConceptNodes);
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
     var realQuery = this.nodesByLabelQuery.replace("LABEL", selectedLabel.value);
     console.log("handleSelectLabelChange ", realQuery);
     console.log("handleSelectLabelChange ", this.state.selectedConceptMapOption);

	 var realOrphanQuery = this.orphanQuery.replace("LABEL", selectedLabel.value).replace("MAP", this.state.selectedConceptMapOption.value);
     console.log("handleSelectLabelChange ", realOrphanQuery);

     // Get the data from Neo4j based on the user selection. Add the callback to
     // ensure the re-render happens once the data is all retrieved.
     graphDataFunctions.getNodes(realQuery, this.graph, this.triggerRender);
     this.filterNodesAndLinks(this.state.selectedViewOption, 
                              this.state.selectedConceptMapOption, 
							  this.state.selectedConcepts, true);

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
     var newAClause;
     
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
 //    mapClause = mapClause.concat('or (n.shape = "concept")');

	   // Because there can be concept nodes that are not connected to any
	   // of the maps the user wants to display we have to check that the 
	   // the concept nodes are connected to nodes that are in the one of the
	   // maps that the user wants to select
       mapClause = mapClause.concat('or (n.shape = "concept" and (');
       for (i = 0; i < selectedMaps.length; i++) {
          newAClause = "a.sourcefile = '" + selectedMaps[i].value + "'";
          if ( i === 0) {
            // The first clause : just append the condition
            mapClause = mapClause.concat(newAClause);
          } else {
            // Not the first condition: we'll need an or clause
            mapClause = mapClause.concat(" or ").concat(newAClause);
          }
	   }
	   mapClause = mapClause.concat("))")
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
     console.log("mapClause ", mapClause);
     var realQuery = this.mapQuery.replace("LABEL", this.state.selectedLabel).replace("MAPCLAUSE", mapClause);
     console.log("handleSelectMapsChange ", realQuery);

     // Get the data from Neo4j based on the user selection. Add the callback to
     // ensure the re-render happens once the data is all retrieved.
     graphDataFunctions.getNodes(realQuery, this.graph, this.triggerRender);
     this.filterNodesAndLinks(this.state.selectedViewOption, 
                              this.state.selectedConceptMapOption, 
							  this.state.selectedConcepts, true);

     console.log("setting state in handleSelectMapsChange");
     this.setState(
       { selectedMaps: selectedMaps}
     );
   };

/**
 * Function passed to the ConceptMap component. Function is bound to this context so
 * that when it is executed in the lower level component, the state will be changed in the
 * parent component and we can call the appropriate getNodeData function.
 * @param  {String} The option returned from the user's choice in the select in the lower
 *                  level component.
 * @return {None}
 */
   handleConceptMapChange(selectedConceptMapOption) {
     console.log(`In handleConceptMapChange `, selectedConceptMapOption);

     // Make an appropriate call to get the concept map nodes and link
     // and make the getNodes call.
 //  this.getConceptMapNodesAndLinks(selectedConceptMapOption)
     this.filterNodesAndLinks(this.state.selectedViewOption, 
	                          selectedConceptMapOption, 
							  this.state.selectedConcepts, true);
	 console.log ("setting selectedConceptMapOption to ", selectedConceptMapOption);
     this.setState(
       { selectedConceptMapOption: selectedConceptMapOption},
     );
   };  

/**
 * Function passed to the ConceptSelect component. Function is bound to this context so
 * that when it is executed in the lower level component, the state will be changed in the
 * parent component and we can call the appropriate getNodeData function.
 * @param  {String} The option returned from the user's choice in the select in the lower
 *                  level component.
 * @return {None}
 */
   handleConceptSelectChange(selectedConceptSelectOption) {
     console.log(`In handleConceptSelectChange `, selectedConceptSelectOption);

     // Make an appropriate call to get the concept map nodes and link
     // and make the getNodes call.
 //  this.getConceptMapNodesAndLinks(selectedConceptMapOption)
     this.filterNodesAndLinks(this.state.selectedViewOption, 
	                          selectedConceptSelectOption, 
							  this.state.selectedConcepts, true)
     this.setState(
       { selectedConceptSelectOption: selectedConceptSelectOption},
     );
   };  


/**
 * Function passed to the Concept component. Function is bound to this context so
 * that when it is executed in the lower level component, the state will be changed in the
 * parent component and we will know what the user selection was
 * @param  {String} The option returned from the user's choice in the select in the lower
 *                  level component.
 * @return {None}
 */
   handleConceptChange(selectedConceptOption) {
     this.triggerRender(true);
     console.log(`In handleConceptChange `, selectedConceptOption);

     this.setState(
       { selectedConceptOption: selectedConceptOption},
     );
   };

/**
 * Function passed to the ConceptSelect component. Function is bound to this context so 
 * that when it is executed in the lower level component, the state will be changed in the
 * parent component and we can call the appropriate getNodeData function.
 * @param  {String} The option array returned from the user's choice in the select in the lower
 *                  level component.
 * @return {None}
 */
   handleConceptListChange(selectedConcepts) {
     console.log(`In handleConceptListChange `, selectedConcepts);
     this.filterNodesAndLinks(this.state.selectedViewOption, 
                              this.state.selectedConceptMapOption, 
							  selectedConcepts, true);

     console.log("setting state in handleConceptListChange");
     this.setState(
       { selectedConcepts: selectedConcepts}
     );
   };

/**
 * This is the render function for the top-level component.
 * The containers are for controls. The SSMGraphData component is the actual graph
 */
   render () {
   return (
      <div>
        <Container>
           <Row>
              <Col md="auto" className="header"><h2>Visualization</h2></Col>
              <Col md="auto"><SelectLabelComponent handleLabelChange={this.handleSelectLabelChange} 
                                                   setMapData={this.setMapData}/></Col>
              <Col md="auto"><SelectMapsComponent handleMapChange={this.handleSelectMapsChange} 
                                                  label={this.state.selectedLabel}/></Col>
              <Col md="auto"><SelectViewComponent handleViewChange={this.handleSelectViewChange}/></Col>
              <Col md="auto"><PopupComponent showPopup={this.state.showPopup} handlePopupChange={this.handlePopupChange}/></Col>
           </Row>   
        </Container>   
        <div>
        <Container>
           <Row>
            <Col md="auto" className="header"><h2>Concepts</h2></Col>
            <Col md="auto"><ConceptMapComponent handleConceptMapChange={this.handleConceptMapChange}
			                                    label={this.state.selectedLabel}/></Col>
            <Col md="auto"><ConceptSelectComponent 
			                   handleConceptListChange={this.handleConceptListChange}
                               conceptMap={this.state.selectedConceptMapOption}
                               label={this.state.selectedLabel}/></Col>
            <Col md="auto"><ConceptComponent label={this.state.selectedLabel} 
                                             link={this.state.selectedLink}
                                             conceptMap={this.state.selectedConceptMapOption}
                                             handleConceptChange={this.handleConceptChange}
                                             addConceptNode={this.addConceptNode}/></Col>
              <Col md="auto"><ConceptPopupComponent 
                                showPopup={this.state.showConceptPopup} 
                                handleConceptPopupChange={this.handleConceptPopupChange}/></Col>
           </Row>   
        </Container>   
        <Container>
           <Row>
           <Col md="auto"> <SSMGraphData handleRightClick={this.handleRightClick} 
                                         handleClick={this.handleClick}
                                         handleLinkClick={this.handleLinkClick}
                                         handleLinkRightClick={this.handleLinkRightClick}
                                         label={this.state.selectedLabel} 
                                         graph={this.graph}/> </Col>
           </Row>   
        </Container>   
        </div>
     </div>
   );
   }
}
//========================================

ReactDOM.render(
  <ParentContainer />,
  document.getElementById('root')
)
