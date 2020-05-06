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

     this.state = {
        concepts: {},
        selectedOption: [],
        temporaryId: 9999999
     };

     this.state.concepts[this.props.label] = {};
     this.state.concepts[this.props.label]["maps"] = {value: "none", label: "none"};
     this.handleConceptChange = this.handleConceptChange.bind(this);
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
       selectedOption.value = newConceptName;
       selectedOption.label = newConceptName;

       console.log("this.props.label ", this.props.label)

       // We are using the temporary for the SSM ID and the ID field.  Note that
       // the ID field will get replaced when this node is eventually written to Neo4j.
       // The SSM ID will not be overwritten, but those ids don't have to be unique.
       // Create a new nore dor this concept
       const graphDataFunctions = require('./graphDataFunctions');
       var thisId = String(this.state.temporaryId);
       var thisShape = "concept"

       // I don't know why the label is coming in as an array ???
//       var thisLabel = this.props.label[0];
       var thisColor = graphDataFunctions.colorTable[thisShape];
       var thisSSMId = this.state.temporaryId;
       var thisSourceFile = this.props.conceptMap.value;

       var thisNode = { 
           id: thisId, shape: thisShape, label: this.props.label, color: thisColor,
           name:  newConceptName, ssmId: thisSSMId, sourceFile: thisSourceFile
       }

       // Decrement the temporary ID
       this.setState(prevState => {
          return {temporaryId: prevState.temporaryId - 1}
       });   

       console.log("New concept node: ", thisNode);
       this.props.addConceptNode(thisNode);

    }   

    //this.props.handleSortChange(selectedOptions);
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
    var theOptions = [];
    if (this.state.concepts[this.props.label] === undefined || this.state.concepts.length === 0) {
       // Let's not try to render what isn't there.
       theOptions[0] = {value: "new", label: "new"};
    } else {
       theOptions = this.state.concepts[this.props.label]["maps"];
    }

    console.log("Rendering the concepts component with label: ", this.props.label);
    console.log("Rendering the concepts component with options: ", theOptions);

    // The very cool select widget.  It returns a possibly empty array of user selected values.
    return (
    <div style={{width: '200px'}}>
       <div className="concepts">Select A Concept</div>
      <Select
        onChange={this.handleChange}
        value={this.selectedOption}
        options={theOptions}
      />
    </div>
    );
  }
}
