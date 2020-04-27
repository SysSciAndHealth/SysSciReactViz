import * as React from "react";
import Select from 'react-select';

/**
 * This is the container for the popup menu that is instantiated when the user
 * right clicks on a concept node.
 */
export default class ConceptPopupComponent extends React.Component {
/**
 * Constructor for this component
 * @param  {Object} a property object that includes the variable that controls whether or not
 *                  the popup is shown and the function that is called when the user makes a selection
 * @return {None}
 */
constructor (props) {
  super (props);
     console.log("In constructor for ConceptPopupComponent with propsi  ", props);

     this.state = {
        selectedOption: null,
     };

     // The set of options is static, so build an array and jam it in.
     this.thePopupList = [
        { value: 'link', label: 'Make a Concept Link'},
        { value: 'delete', label: 'Delete This Concept'},
        { value: 'save', label: 'Save This Concept'},
        ];


     this.handleConceptPopupChange = this.handleConceptPopupChange.bind(this);
  }

/**
 * Local binding for the passed in function
 * @param  {Object} the user selected option
 * @return {None}
 */
  handleConceptPopupChange(selectedOption) {
    console.log(`Option selected:`, this.state.selectedOption);
    this.props.handleConceptPopupChange(selectedOption);
  }

/**
 * Function called when the user changes the value of the select object
 * @param  {Object} the user selected option
 * @return {None}
 */
  handleChange = selectedOption => {
    this.setState(
      { selectedOption },
      () => this.handleConceptPopupChange(selectedOption)
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
       <div className="label">Concept Options</div>
      <Select
        value={selectedOption}
        onChange={this.handleChange}
        options={this.thePopupList}
      />
    </div>
    );
  }
}
