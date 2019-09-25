import * as React from "react";
// import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { ForceGraph2D, ForceGraph3D, ForceGraphVR } from 'react-force-graph';
import * as graphDataFunctions from "./graphDataFunctions.js";
import 'react-sprite';
import 'three-spritetext';
import SpriteText from 'three-spritetext';

class Square extends React.Component {
  render() {
    return (
      <button className="square">
        {/* TODO */}
      </button>
    );
  }
}

class SSMGraphData extends React.Component {
 
  constructor (props) {

    super (props);

	this.state = {
	   headerStatus : 'The SSM Graph',
	   graph : {
	      nodes : [],
		  links : []
       }
	};

    const graphDataFunctions = require('./graphDataFunctions');
    var nodeArray = graphDataFunctions.getNodesByLabel("test", this);
    console.log("First returned node " + nodeArray[0]);
  }

  setHeaderStatus (theStatus) {
     console.log("In setHeaderStatus with " + theStatus);
	 this.setState((state) => { 
	   // return {headerStatus : state.headerStatus + 'x'}
	   return ({headerStatus : theStatus });
	 });
  }


  setNodesAndLinks (theNodes, theLinks) {
     console.log("In setNodes ");
     console.log ("Second node before function call is :" + theNodes[1]);
	 this.setState((state) => { 
	   // return {headerStatus : state.headerStatus + 'x'}
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

  render() {

  //  this.setHeaderStatus(listStatus);

    const data = this.state.graph;
    return (
      <div>
        <div className="ourGraph">{this.state.headerStatus}</div>
        <div className="theGraph"><
           ForceGraph3D graphData={data} 
           ref={el => { this.fg = el; }}
           onNodeClick={this._handleClick}
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

// class SSMGraph extends React.Component {
//   render() {
//     return (
//       <div className="SSM Graph">
//         <div className="theGraph">
//           <SSMGraph/>
//         </div>
//         <div className="graph-info">
//           <div>{/* headerStatus */}</div>
//           <ol>{/* TODO */}</ol>
//         </div>
//       </div>
//     );
//   }
// }

// ========================================

ReactDOM.render(
  <SSMGraphData />,
  document.getElementById('root')
)
