import * as React from "react";
import Select from 'react-select';
/**
 * This is the container for the select concepts menu. This component allows the user to 
 * select one or more concepts from a list to be displayed. If the user doesn't select 
 * any concepts, then all the concepts for the
 * selected concept maps are displayed.
 */
export default class ConceptSelectComponent extends React.Component {
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
        selectedOptions: [],
        distinctConceptQuery: 'MATCH (n) where n.shape = "concept" RETURN n'
     };

     this.handleConceptListChange = this.handleConceptListChange.bind(this);
	 const graphDataFunctions = require('./graphDataFunctions');
     graphDataFunctions.getConcepts(this.state.distinctConceptQuery, this);
  }

/**
 * Function passed to the getMaps function to set the concept array
 * @param  {Object} the map array
 * @return {None}
 */
  setMaps (concepts) {
     console.log("In setMaps from SelectConceptsComponent");
     console.log(concepts);
     this.setState((state) => {
       let savedConcepts = Object.assign({}, state.concepts);
       savedConcepts = concepts;
       return ({concepts: savedConcepts});
     });
  }

/**
 * Local binding for the passed in function
 * @param  {Object} the user selected option
 * @return {None}
 */
  handleConceptListChange(selectedOptions) {
    this.props.handleConceptListChange(selectedOptions);
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
      () => this.handleConceptListChange(selectedOptions)
    );
  };

/**
 * Function called to get a list of just the concepts in this map.  
 * @param  {Object} An array of the concepts for this label
 * @param  {Object} The selected concept map
 * @return {returns an array of the concepts for the label and concept map}
 */
  createOptionList(conceptArray, conceptMap) {
     console.log("In createOptionList");
     console.log("In createOptionList: conceptArray ", conceptArray);
     console.log("In createOptionList: conceptMap ", conceptMap);
	 var optionList = [];
	 var i;
	 for (i = 0; i < conceptArray.length; i++) {
	    var thisConcept = conceptArray[i];
		if (thisConcept.value === conceptMap.value) {
           console.log("In createOptionList: thisConcept ", thisConcept);
		   var thisConceptOption = {label: thisConcept.name, value: thisConcept.name};
		   optionList.push(thisConceptOption);
		}
	 }

     console.log("optionList in createOptionList: ", optionList);
	 return(optionList);
  }

/**
 * The render function
 */
  render() {
    console.log("Rendering Concept Selector");
    console.log("\t" , this.props.conceptMap);
    console.log("\t" , this.props.label);
    console.log("\t" , this.state.concepts);

    // This seems to catch the case where we are trying to render this component before we
    // have the map data from the promise.
    if (this.state.concepts[this.props.label] === undefined || this.state.concepts.length === 0 ||
        this.props.conceptMap === undefined || this.props.conceptMap.length === 0) {
       // Let's not try to render what isn't there.
       return (null);
    } else {
	   // create the options list from all the concepts
	   var options = this.createOptionList(this.state.concepts[this.props.label]["maps"], 
	                                       this.props.conceptMap);
	   console.log("options rendering Consept Selector ", options);
       // The very cool multi select widget. It returns a possibly empty array of user selected values.
       return (
       <div style={{width: '400px'}}>
          <div className="concepts">Select Concepts</div>
         <Select
           isMulti
           value={this.selectedOptions}
           onChange={this.handleChange}
           options={options}
         />
       </div>
       );
    }
  }
}
