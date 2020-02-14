import * as React from "react";
import { Container } from 'react-layout-components';
import { Row, Col } from 'react-bootstrap';
// import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as util from 'util';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph';
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

class SelectLabelComponent extends React.Component {
  constructor (props) {
     super (props);

     this.state = {
        labels: [],
        selectedOption: '',
        cypherQuery: 'MATCH (n) RETURN distinct labels(n)'
     };

     this.handleLabelChange = this.handleLabelChange.bind(this);
     const graphDataFunctions = require('./graphDataFunctions');
     var labelArray = graphDataFunctions.getLabels(this.state.cypherQuery, this);
  }

  handleLabelChange(selectedOption) {
    this.props.handleLabelChange(selectedOption);
  }

  // This function is called when the user changes the value of the select object
  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => this.handleLabelChange(selectedOption)
    );
  };

  setLabels (theLabels) {
     console.log("In setLabels ");
     this.setState((state) => {
       let savedLabels = Object.assign({}, state.labels);
       console.log(theLabels);
       savedLabels = theLabels;
       return ({labels: savedLabels});
     });
  }  

  render() {

    const { selectedOption } = this.state;

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

class SelectViewComponent extends React.Component {
  constructor (props) {
  super (props);
     console.log("In constructor for SelectViewComponent");

     this.state = {
        selectedOption: 'All Nodes',
     };

     // The set of options is static, so build an array and jam it in.
     this.theViewList = [
        { value: 'all', label: 'All Nodes'},
        { value: 'roles', label: 'All Roles'},
        ];


     this.handleViewChange = this.handleViewChange.bind(this);
  }

  handleViewChange(selectedOption) {
    console.log(`Option selected:`, this.state.selectedOption);
    this.props.handleViewChange(selectedOption);
  }

  // This function is called when the user changes the value of the select object
  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => this.handleViewChange(selectedOption)
    );
  };

  render() {

    const { selectedOption } = this.state;

    return (
    <div style={{width: '200px'}}>
       <div className="label">Select A View</div>
      <Select
        value={selectedOption}
        onChange={this.handleChange}
        options={this.theViewList}
      />
    </div>
    );
  }
}

class SSMGraphData extends React.Component {
 
  constructor (props) {

    super (props);

	this.state = {
       showPopup : false,
       currentNode : '',
       cypherQuery: 'MATCH (n:LABEL)-[r]->(a) RETURN n,type(r),a',
	   graph : {
	      nodes : [],
		  links : []
       }
	};

    const label = props.label;
    console.log("label " + label);
  }

buildQuery(context) {

   var protoType = 'MATCH (n:%s)-[r]->(a) where a.shape = "%s" RETURN n,type(r),a';
   var theShape = context.state.currentNode.shape;
   var theLabel = context.state.label;
   var theQuery;

   switch (theShape) {
      case "circle":
          theQuery = util.format(protoType, theLabel, theShape);
          console.log ("theQuery :" + theQuery);
          break;
   }

}

filterNodes(event, context) {
   console.log("shape: " + context.state.currentNode.shape);
   this.buildQuery(context);
   context.setState((state) => {
//      var nodeArray = graphDataFunctions.getNodes('MATCH (n)-[r]->(a) where a.shape = "rectangle" RETURN n,type(r),a', this);
      return({cypherQuery: 'MATCH (n)-[r]->(a) where a.shape = "rectangle" RETURN n,type(r),a'});
    });
}

popupMenu(props) {
    console.log("entering popup menu");

        if (!this.state.showPopup) {
           console.log("popup menu not");
           return "";
        } else { return (
       <Popup trigger=<button>Node Menu</button>
          position="right top"
          on="hover"
          closeOnDocumentClick
          mouseLeaveDelay={300}
          mouseEnterDelay={0}
          contentStyle={{ padding: "0px", border: "none" }}
          arrow={false}
        >
        <div className="menu">
         <div className="menu-item"> <button onClick={(event) => this.filterNodes(event, this)}> Filter nodes</button></div>
         <div className="menu-item"> item 2</div>
         <div className="menu-item"> item 3</div>
      </div>
      </Popup>
   );
   }
}

  setNodesAndLinks (theNodes, theLinks) {
     console.log("In setNodes ");
     console.log ("Second node before function call is :" + theNodes[1]);
	 this.setState((state) => { 
       let savedGraph = Object.assign({}, state.graph);
       console.log ("Second node is :" + theNodes[1]);
       savedGraph.nodes = theNodes;
       savedGraph.links = theLinks;
	   return ({graph: savedGraph});
	 });
  }

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

 _handleRightClick = node => {
     this.setState({  
        showPopup: !this.state.showPopup  
     });
	 this.setState((state) => { 
	   return ({currentNode : node });
	 });
     console.log(this.state.showPopup);
     console.log(node);
  }

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
    console.log("rendering data from links " , data);

    return (
      <div>
        
        {this.popupMenu()}
        <div className="theGraph"><
           ForceGraph3D graphData={data} 
           ref={el => { this.fg = el; }}
           onNodeClick={this._handleClick}
           onNodeRightClick={this._handleRightClick}
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

class ParentContainer extends React.Component {
   constructor (props) {
   super (props);

      this.state = {
         labels: [],
         readyToRender: 'false',
         selectedOption: 'test',
         selectedViewOption: 'test',
      };

      this.cypherQuery = 'MATCH (n:LABEL)-[r]->(a) RETURN n,type(r),a';
      this.viewQuery = 'MATCH (n:LABEL)-[r]->(a) where a.shape = "rectangle" RETURN n,type(r),a';
      this.handleSelectLabelChange = this.handleSelectLabelChange.bind(this);
      this.handleSelectViewChange = this.handleSelectViewChange.bind(this);
      this.handleNodeStateChange = this.handleNodeStateChange.bind(this);
    
      this.graph = {
         nodes : [],
         links : [],
         setNodesAndLinks : function(nodes, links) {
            this.nodes = nodes;
            this.links = links;
         }
      };
   }

   getNodeData(selectedViewOption) {
     console.log(`In getNodeData `,this.state.selectedOption);
     var theQuery;
     switch (selectedViewOption.value) {
         case "roles":
             theQuery = this.viewQuery.replace("LABEL", this.state.selectedOption);
             console.log ("theQuery: " + theQuery);
             break;
         case "all":
             theQuery = this.cypherQuery.replace("LABEL", this.state.selectedOption);
             console.log ("theQuery: " + theQuery);
             break;
     }
     console.log(`handleSelectViewChange theQuery is `, theQuery);
     const graphDataFunctions = require('./graphDataFunctions');
     var nodeArray = graphDataFunctions.getNodes(theQuery, this.graph, this.handleNodeStateChange);
   };

   handleSelectViewChange(selectedViewOption) {
     console.log(`In handleSelectViewChange `, selectedViewOption);
     this.getNodeData(selectedViewOption)
     this.setState(
       { selectedViewOption: selectedViewOption.value},
//         this.getNodeData(selectedViewOption)
     );
   };

   handleNodeStateChange(status) {
     console.log(`In handleNotedStateChange `);
     this.setState(
       { readyToRender: 'true'},
//         this.getNodeData(selectedViewOption)
     );
   };


   handleSelectLabelChange(selectedOption) {
     console.log(`In handleSelectLabelChange `, selectedOption);
     console.log(`cypherQuery `, this.cypherQuery);
     const graphDataFunctions = require('./graphDataFunctions');
     var queryTemplate = this.cypherQuery;
     var realQuery = queryTemplate.replace("LABEL", selectedOption.value);
     console.log("handleSelectLabelChange ", realQuery);
     var nodeArray = graphDataFunctions.getNodes(realQuery, this.graph, this.handleNodeStateChange);

     console.log("setting state in handleSelectLabelChange");
     this.setState(
       { selectedOption: selectedOption.value}
//       this.getNodeData
     );
   };

   render () {
   return (
      <div>
        <div className="header"><h4>SSM Visualization</h4></div>
        <Container>
           <Row>
              <Col md="auto"><SelectLabelComponent handleLabelChange={this.handleSelectLabelChange}/></Col>
              <Col md="auto"><SelectViewComponent handleViewChange={this.handleSelectViewChange}/></Col>
           </Row>   
        </Container>   
        <SSMGraphData label={this.state.selectedOption} graph={this.graph}/>
     </div>
   );
   }
}
// ========================================

ReactDOM.render(
  <ParentContainer />,
  document.getElementById('root')
)
