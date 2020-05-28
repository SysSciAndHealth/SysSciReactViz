import * as React from "react";
import Select from 'react-select';


/**
 * This is the container for the select maps menu. This component allows the user to select one or more
 * maps from a list to be displayed. If the user doesn't select any maps, then all the maps for the
 * selected label are displayed.
 */
export default class ConceptMapComponent extends React.Component {
/**
 * Constructor for this component
 * @param  {Object} a property object that includes the function that is called when the user
 *                  makes a selection
 * @return {None}
 */
  constructor (props) {
     super (props);

     this.state = {
        conceptMaps: [],
        selectedOption: [],
        conceptMapQuery: 'MATCH (n) where n.shape = "concept" RETURN distinct n.sourcefile, labels(n)'
     };

     this.theOptions = [];
 //  this.state.conceptMaps[this.props.label] = {};
 //  this.state.conceptMaps[this.props.label]["maps"] = {value: "none", label: "none"};
     this.handleConceptMapsChange = this.handleConceptMapsChange.bind(this);
     const graphDataFunctions = require('./graphDataFunctions');
     graphDataFunctions.getMaps(this.state.conceptMapQuery, this);
  }

/**
 * Function passed to the getMaps function to set the map array.  In this case we are actually
 * getting sort/comcept map objects but the underlying code is the same
 * @param  {Object} the map array
 * @return {None}
 */
  setMaps (theConceptMaps) {
     console.log("In setMaps from ConceptMapComponent");
     this.setState((state) => {
       let savedConceptMaps = Object.assign({}, state.conceptMaps);
       console.log(theConceptMaps);
       var savedConcepts = theConceptMaps;
       return ({conceptMaps: savedConcepts});
     });
  }

/**
 * Local binding for the passed in function
 * @param  {Object} the user selected option
 * @return {None}
 */
  handleConceptMapsChange(selectedOption) {
    console.log("Concept map selected: ", selectedOption);
    var newConceptMapName;

    if (selectedOption.value === "new") {
       newConceptMapName = prompt("Enter the name of the new concept map");
       selectedOption.value = newConceptMapName;
       selectedOption.label = newConceptMapName;
    }   

    this.props.handleConceptMapChange(selectedOption);
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
      () => this.handleConceptMapsChange(selectedOption)
    );
  };


/**
 * The render function
 */
  render() {

    // This seems to catch the case where we are trying to render this component before we
    // have the map data from the promise.
	this.theOptions = [];
    this.theOptions[0] = {value: "new", label: "Add A New Concept Map"};
    if (this.state.conceptMaps[this.props.label] !== undefined 
	    && this.state.conceptMaps.length !== 0) {
       this.theOptions = this.theOptions.concat(this.state.conceptMaps[this.props.label]["maps"]);
    }

    if (typeof this.handleChange !== "function") {
	   return null;
	}
    console.log("Rendering the concept map  component with label: ", this.props.label);
    console.log("Rendering the concept map  component with options: ", this.theOptions);

    // The very cool select widget.  It returns a possibly empty array of user selected values.
    return (
    <div style={{width: '400px'}}>
       <div className="conceptMaps">Select Concept Map</div>
      <Select
        onChange={this.handleChange}
        value={this.selectedOption}
        options={this.theOptions}
      />
    </div>
    );
  }
}
