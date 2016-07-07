
const {
  Component,
  PropTypes
} = React;

// Define references to global var ReactBootstrap
const {

  Modal,
  Button,
  Grid,
  Col,
  Row,
  FormGroup,
  FormControl,
  ControlLabel,
  ButtonToolbar,
  Table,
  thead,
  tbody,
  tr,
  td,
  Well	
	
} = ReactBootstrap;

var SetInicialStorage  = function (localStorageName){
	var TestStorage = [
	{"recipeName": "Mamão com acucar" , "ingredients": "mamão, acucar" },
	{"recipeName": "Maca com acucar e canela" , "ingredients": "mamao, acucar, canela" },
	{"recipeName": "Um monte de nada com acucar e canela" , "ingredients": "mamao, maca, acucar, canela" },	
];
	
	if (!localStorage.getItem(localStorageName)) {
		
			localStorage.setItem(localStorageName, JSON.stringify(TestStorage));
			
	}
	
	return JSON.parse(localStorage.getItem(localStorageName));
	
};

var Popup = React.createClass({
	
	getInitialState: function() {		
		return ({			
			newRecipeName:'',
			newIngredients:'',
			popupToShow:"NewRecipe" 
		})				
	},	
	

	
	handleChangeNewIngredients: function(event){
			this.setState({
				newIngredients: event.target.value
			});
			
	},
	
	handleChangeRecipeName: function(event){
		this.setState({
			newRecipeName: event.target.value
		});
			
	},	
	
	handleClickNewRecipe: function (){
		
		this.props.newRecipe({"recipeName": this.state.newRecipeName , "ingredients":  this.state.newIngredients });
		this.setState(this.props.toggle)
	},
	
  	render: function () {
		/* Setting References Optional */
		const Header = Modal.Header;
		const Body = Modal.Body;
		const Title = Modal.Title;
		const Footer = Modal.Footer;

		/*
		  show controls if the modal is shown or not
		  onHide takes a callback function to control
		  hiding or not, here its using a call back
		  that effects if the component is even mounted
		  hence the hard coded true in show.
		*/
		return(
		  <Modal show={true} onHide={this.props.toggle}>
			<Header>
			  <Title>{this.props.title}</Title>
			</Header>
			<Body>
				<Popup.NewRecipe 
					handleChangeRecipeName = {this.handleChangeRecipeName}
					handleChangeNewIngredients ={this.handleChangeNewIngredients}
				/>
			</Body>
			<Footer>
			<ButtonToolbar>
			  <Button 
				id="New" 
				bsSize="small" 			
				bsStyle="primary"
				onClick={this.handleClickNewRecipe}>
					Add
				</Button>
			  <Button 
				id="close"
				bsSize="small"
				bsStyle="info"
				onClick={this.props.toggle}>
					Close
				</Button>
			 </ButtonToolbar>
			</Footer>
		  </Modal>
		);

	  }
});


Popup.NewRecipe = React.createClass({ 
	render: function () {
				return (
				
			<form>
				<FormGroup
				  controlId='formBasicText'
				>
				  <ControlLabel>Recipe Name</ControlLabel>
				  <FormControl
					type='text'
					placeholder='Recipe Title'
					onChange={this.props.handleChangeRecipeName}

				  />
				  <ControlLabel>Ingredients</ControlLabel>
				  <FormControl
					type='text'
					placeholder='Recipe Ingredients coma separeted'
					onChange={this.props.handleChangeNewIngredients}
				  />
				</FormGroup>
      		</form>
				
				
				
				)
	
	
			}, 

	
});
	
var Accordion = React.createClass({
	
    getInitialState: function() {
        // we should also listen for property changes and reset the state
        // but we aren't for this demo
        return {
            // initialize state with the selected section if provided
			//dialogNewRecipeShow: false,
            selected: this.props.selected,
			showPopup: false
			
        };	
    },
	
	handleNewRecipe: function(recipeToAdd) {
		var	newStorage = this.props.storage;
			
			newStorage.push(recipeToAdd);
			localStorage.setItem(this.props.localStorageName, JSON.stringify(newStorage));
			this.setState ({
				storage:newStorage
			})
	
		
	},
	
	handleDeleteRecipe: function (recipeToDelete) {
		
		var	newStorage = this.props.storage;
		newStorage.splice(recipeToDelete -1,1);				  
		localStorage.setItem(this.props.localStorageName, JSON.stringify(newStorage));
		this.setState ({ 
				storage:newStorage
			})
			
	},
	
	handleDeleteRow: function (id, line){
	id--;	
		
		var arrIngredients = this.props.storage[id].ingredients.split(",");
		arrIngredients.splice(line,1);
		this.props.storage[id].ingredients =  arrIngredients.toString();
		var	newStorage = this.props.storage;
						  
		localStorage.setItem(this.props.localStorageName, JSON.stringify(newStorage));
		this.setState ({ 
			storage:newStorage
			})
	
	},
	
	handleEditRow: function (id, line, text){
		
		console.log(id + " " + line + "text" + text);
	},
	
	ShowNewRecipeDialog: function (){
			//unhide the modal dialog
		
		 this.setState({ dialogNewRecipeShow: true })			
	},
	
	 /**
   * Toggle Showing Modal
   * 
   * !var returns opposite boolean value, false becomes true, true becomes false
   */
  	togglePopup: function() {
    	this.setState({
			showPopup: !this.state.showPopup
    	});
  	},
	
	displayPopup:  function (show, callback, props) {
	  if (show) {
		 
		/**
		 * ...props is a spread operation, allowing the
		 * recieving component to access the props via
		 * this.props.title
		 */
		return (
		  <Popup
			toggle={callback}
			{...props}
		  />
		);
	  }

	  return null;
	},
			
    render: function() {
		const showPopup = this.state.showPopup;
    	/* using bind so this.setState in the function is this component */
    	const togglePopup = this.togglePopup;
		var sections = []; 
		var i = 1;
		var _this = this; 
		let dialogNewRecipeClose = () =>  this.setState({ dialogNewRecipeShow: false });
		this.props.storage.forEach(function(item) {
			
			var temp = <Accordion.Section 
							title={item.recipeName}  
							handleDelete={_this.handleDeleteRecipe} 
							ingredients={item.ingredients}
							handleDeleteRow ={_this.handleDeleteRow}
							handleEditRow ={_this.handleEditRow}
							key={i} 
							id={i}
						/>;
			sections.push(temp);
			i++;
		});
        // enhance the section contents so we can track clicks and show sections
        var children = React.Children.map(
            sections, this.enhanceSection);
		
		
		
        return (
			
            <div className="accordion col-md-offset-2">
				<Well id="Title" bsSize="small" ><h3>Recipe Box</h3> </Well>
                {children}
				<Button 
					id="btnNewRecipe"
					bsSize="large"
					 bsStyle="primary"
					onClick={this.togglePopup}>
						New Recipe
				</Button>
				 {this.displayPopup( this.state.showPopup, this.togglePopup, {title:"New Recipe", newRecipe: this.handleNewRecipe})}		
            </div>
        );
    },

    // return a cloned Section object with click tracking and "active" awareness
    enhanceSection: function(child) {
        var selectedId = this.state.selected;
         var  id = child.props.id;
		
		//ate aqui esta certo	
        return React.cloneElement(child, {
            key: id,
            // private attributes/methods that the Section component works with
            _selected: id === selectedId,
            _onSelect: this.onSelect
        });
    },

    // when this section is selected, inform the parent Accordion component
    onSelect: function(id) {
        this.setState({selected: id});
    }
});
// the Accordion Section component
Accordion.Section = React.createClass({
	
	deleteRecipe: function(event) {
		this.props.handleDelete(this.props.id);
		
	},
	
	deleteLine: function(line) {
		this.props.handleDeleteRow(this.props.id,line); 
		
	},
	
	editLine: function(line, Newtext) {
		this.props.handleEditRow(this.props.id,line, Newtext); 
		
	},
	
    render: function() {
        var className = 'accordion-section' + (this.props._selected ? ' selected' : '');
			var rows = [];
			var i = 0;
			var _this = this;
		if (this.props.ingredients.length > 0) { 
			
    		var arrIngredients =this.props.ingredients.split(",");
		
			arrIngredients.forEach(function (item){
				var row = <Accordion.Section.Ingredients 
							item={item} 
							key={i} 
							id={i}  
							handleLineEdit={_this.editLine}
							handleLineDelete={_this.deleteLine}/>; 
				rows.push(row);
				i++;
			})
		} 
		
        return (
            <Well  bsSize="small" className={className}>
			  <Well className="titleBar row" >
                <Col md={11} elementType="h3"  onClick={this.onSelect}>
                    {this.props.title}
				</Col>
				<Col md={1} elementType="span"
					className="DeleteRecipe glyphicon glyphicon-remove" 
					onClick={this.deleteRecipe}>
				</Col>          
			  </Well>
                <div className="body">
					<Table  striped bordered condensed hover>
						<tbody>
							{rows }
						</tbody>
					</Table>
                 
                </div>
            </Well>
        );
    },

    onSelect: function() {
        // tell the parent Accordion component that this section was selected
        this.props._onSelect(this.props.id);   
    }
});
//The ingredients to diplay as a table
Accordion.Section.Ingredients = React.createClass({
	 getInitialState() {
    return {
      value: this.props.item.toString(),
	  readOnly: true	
    };
  },

	
	deleteRow: function (){
		
		this.props.handleLineDelete(this.props.id);
		
	},
	
	handleKeyPress: function (e){
			if (e.charCode === 13) {
					this.props.handleLineEdit(this.props.id, this.state.value);
					this.setState({ readOnly:true});
			};
		
	},
	
	editRow: function (e){
		
		//if (e.e.target.value = ){}
	
	
		this.setState({ value: e.target.value });
	},
	
	enableEditRow: function () {
			this.setState({ readOnly:false});
		
	},
	
	render: function(){
		
		
		return (
		
			<tr id={this.props.id}> 
				<td>
					<FormControl
						readOnly = {this.state.readOnly}
            		  	type="text"
            			value={this.state.value}
            			onChange={this.editRow}
						onKeyPress={this.handleKeyPress} 
						
          			/>
				</td>  
				<td width="30"><span 
									className="glyphicon glyphicon-edit" 
									onClick={this.enableEditRow}>
								</span>
				</td>
				<td width="30"><span 
									className="glyphicon glyphicon-remove" 
									onClick={this.deleteRow}>
								</span>
				</td>
			</tr>
		
		
		);		
		
	}	
	
});



ReactDOM.render((
   <Accordion storage= {SetInicialStorage('_jrogatis_recipes')} localStorageName ='_jrogatis_recipes' selected="2"/>
), document.getElementById('mountNode'));



