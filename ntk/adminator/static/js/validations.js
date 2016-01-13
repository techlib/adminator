$(function() {

	var myNod = nod();

	myNod.configure({
		    submit: '#submit',
		    disableSubmit: true,
		    successClass: 'has-success',
		    errorClass: 'has-error'
	});

	myNod.add([{
		    selector: '.required',
		    validate: 'presence',
		    errorMessage: 'Toto pole je povinné. Vyplňte jej.'
	}]);
	myNod.performCheck();
});
