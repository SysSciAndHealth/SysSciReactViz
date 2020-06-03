import * as React from "react";
import Select from 'react-select';


/**
 * This is the container for the select maps menu. This component allows the user to select one or more
 * maps from a list to be displayed. If the user doesn't select any maps, then all the maps for the
 * selected label are displayed.
 */
export default class ConceptComponent extends React.Component {
/**
 * Constructor for this component
 * @param  {Object} a property object that includes the function that is called when the user
 *                  makes a selection
 * @return {None}
 */
  constructor (props) {
     super (props);
     console.log("intitializing concept component");

     this.state = {
        concepts: {},
        selectedOption: [],
     };

     this.state.concepts[this.props.label] = {};
     this.state.concepts[this.props.label]["maps"] = {value: "none", label: "none"};
     this.handleConceptChange = this.handleConceptChange.bind(this);

	 this.theOptions =[
        {value: "new", label: "Add A New Concept"},
        {value: "link", label: "Link Selected Concept"},
        {value: "deleteConcept", label: "Delete Selected Concept"},
        {value: "deleteLink", label: "Delete Selected Link"}
	 ]
  }

/**
 * Local binding for the passed in function
 * @param  {Object} the user selected option
 * @return {None}
 */
  handleConceptChange(selectedOption) {
    console.log("Concept selected: ", selectedOption);
    var newConceptName;

    if (selectedOption.value === "new") {
       newConceptName = prompt("Enter the name of the new concept");
       if (newConceptName === null) {
	      return;
	   }

       console.log("this.props.label ", this.props.label)

       // We are using the temporary for the SSM ID and the ID field.  Note that
       // the ID field will get replaced when this node is eventually written to Neo4j.
       // The SSM ID will not be overwritten, but those ids don't have to be unique.
       // Create a new nore dor this concept
       const graphDataFunctions = require('./graphDataFunctions');
	   var generatedId = Date.now();
       var thisShape = "concept"

       // I don't know why the label is coming in as an array ???
//       var thisLabel = this.props.label[0];
       var thisColor = graphDataFunctions.colorTable[thisShape];
       var thisSSMId = generatedId;
       var thisSourceFile = this.props.conceptMap.value;

       var thisNode = { 
           id: generatedId, shape: thisShape, label: this.props.label, color: thisColor,
           name:  newConceptName, ssmId: thisSSMId, sourceFile: thisSourceFile, visibility: true
       }

       console.log("New concept node: ", thisNode);
       this.props.addConceptNode(thisNode);


    }   

	this.props.handleConceptChange(selectedOption);
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
      () => this.handleConceptChange(selectedOption)
    );
  };


/**
 * The render function
 */
  render() {

    // This seems to catch the case where we are trying to render this component before we
    // have the map data from the promise.
    console.log("rendering the concept component");

    // The very cool select widget.  It returns a possibly empty array of user selected values.
    return (
    <div style={{width: '400px'}}>
       <div className="concepts">Concept Menu</div>
      <Select
        onChange={this.handleChange}
        value={this.selectedOption}
        options={this.theOptions}
      />
    </div>
    );
  }
}
