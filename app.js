

//BUDGET CONTROLLER
var budgetController = (function(){
	
	var Expense = function(id,description,value){

		this.id=id;
		this.description =description;
		this.value = value;
		this.percentage=-1;

	};

	Expense.prototype.calcPercentages= function(totalIncome)
	{

		if(totalIncome>0)
		{
		this.percentage=Math.round((this.value/totalIncome)*100);			
		}
		else
		{
			this.percentage=-1;
		}

	};

	Expense.prototype.getPercentage  =function(){
		return this.percentage;

	};


	var Income= function(id,description,value)
	{
		this.id = id;
		this.description=description;
		this.value=value;

	};

	var calculateTotal = function(type){
		var sum =0;
		data.allItems[type].forEach(function(cur){
			sum = sum + cur.value;
		});

		data.totals[type] = sum; 

	};


	var data={
		allItems:{
			expense:[],
			income:[]
		},
		totals:{
			expense:0,
			income:0
		},
		budget:0,
		percentage:-1
	};

	return{
		addItem: function(type,des,val)
		{
			var newItem,ID;
			
			//Create new ID
			if (data.allItems[type].length > 0)
			{

			ID=data.allItems[type][data.allItems[type].length-1].id +1;

			}
			else
			{
				ID=0;
			}


			//Create new item based on income or expense type
			if (type === 'expense')
			{
				newItem = new Expense(ID,des,val);
			}

			else if(type === 'income')
			{
				newItem = new Income(ID,des,val);
			}
			
			// Push it into data structure
			data.allItems[type].push(newItem);
			//Return the new element
			return newItem;


		},

		deleteItem:function(type, id){
			var ids,index;

			//id = 3
			ids= data.allItems[type].map(function(current){
				return current.id;
			});

			index=ids.indexOf(id);

			if (index !== -1)
			{
				console.log("inside the if statement of deletion");
				data.allItems[type].splice(index, 1);
			}

		},

		calculateBudget:function(){

			//calculate total income and expenses
			calculateTotal('expense');
			calculateTotal('income');
			//calculate the budget which will be income -expenses

			data.budget = data.totals.income - data.totals.expense;
			//Calculate the percentage of income spent
			if(data.totals.income > 0)
			{
			data.percentage=Math.round((data.totals.expense/data.totals.income)*100);
			}
			else
			{
				data.percentage=-1;
			}


		},

		calculatePercentages: function(){

			data.allItems.expense.forEach(function(cur)
			{
				cur.calcPercentages(data.totals.income);
			})
		},

		getPercentages:function(){
			var allPerc = data.allItems.expense.map(function(cur) {
				return cur.getPercentage();
			});

			return allPerc;

		},

		getBudget:function(){
			return {
				budget: data.budget,
				totalInc: data.totals.income,
				totalExp: data.totals.expense,
				percentage:data.percentage
			}

		},
		testing: function(){
			console.log(data);
		}
	};

})();




















//UI CONTROLLER
var UIController=(function(){

	var DOMstrings = {
		inputType:'.add__type',
		inputDescription:'.add__description',
		inputValue:'.add__value',
		inputBtn:'.add__btn',
		incomeContainer:'.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel:'.budget__value',
		incomeLabel:'.budget__income--value',
		expensesLabel:'.budget__expenses--value',
		percentageLabel:'.budget__expenses--percentage',
		container:'.container',
		expensesPercLabel:'.item__percentage',
		dateLabel:'.budget__title--month'
	}



	var formatNumber = function(num,type){
			var numSplit,int,dec,type; 
			//1= or - before the number
			//exactly 2 decimal points
			//comma separation

			num = Math.abs(num);
			num = num.toFixed(2);

			numSplit = num.split('.');
			int= numSplit[0];

			//if(int.length> 3)
			//{
			//	console.log("The digit block is here");

			//	int =int.substr(0, int.length-3) + ',' + int.substr(int.length-3,int.length);
			//}
			int = Number(int);
			int = int.toLocaleString("en-US");



			dec = numSplit[1];
			

			return (type === 'expense' ? '-' : '+') + ' ' + int+'.' +dec;

		};

	var formatNumber2 = function(num,type){
			var numSplit,int,dec,type; 
			//1= or - before the number
			//exactly 2 decimal points
			//comma separation

			num = Math.abs(num);
			num = num.toFixed(2);

			numSplit = num.split('.');
			int= numSplit[0];
			//if(int.length> 3)
			//{
			//	int =int.substr(0, int.length-3) + ',' + int.substr(int.length-3,int.length);
			//}
			int = Number(int);
			int = int.toLocaleString("en-US");

			dec = numSplit[1];
			

			return  int+'.' +dec;

		};

	var nodeListForEach=function(list,callback){
				for(var i=0;i < list.length;i++)
				{
					callback(list[i],i);
				}
			};


	return{
		getInput:function(){

			return {

			type:document.querySelector(DOMstrings.inputType).value, //Willbe either inc or exp
			description: document.querySelector(DOMstrings.inputDescription).value,
			value : parseFloat(document.querySelector(DOMstrings.inputValue).value)


			};
		},

		addListItem:function(obj,type){
			var html,newHtml,element;
			//Create HTML string with placeholder text
			if (type === 'income')
			{
				element=DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix item400"><div class="item__value">+%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

			}
			else if(type === 'expense')
			{
				element=DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix item400"><div class="item__value">-%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        

			}

		//Replace the placeholder text with some actual data

		newHtml =html.replace('%id%',obj.id);
		newHtml =newHtml.replace('%description%',obj.description);
		newHtml = newHtml.replace('%value%', formatNumber2(obj.value));




			//Insert the HTML into the DOM
		document.querySelector(element).insertAdjacentHTML('beforeend',newHtml);



		},

		deleteListItem: function(selectorID){

			var el = document.getElementById(selectorID);
			el.parentNode.removeChild(el);
		},




		clearFields: function(){
			var fields,fieldsArr;
			fields=document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

			var fieldsArr =Array.prototype.slice.call(fields);

			fieldsArr.forEach(function(current,index,array){

				current.value = "";
			});

			fieldsArr[0].focus();

		},

		displayBudget:function(obj)
		{

			var type;
			obj.budget > 0 ? type = 'income' : type = 'expense';
			document.querySelector(DOMstrings.budgetLabel).textContent=formatNumber(obj.budget,type);
			document.querySelector(DOMstrings.incomeLabel).textContent=formatNumber(obj.totalInc,'income');
			document.querySelector(DOMstrings.expensesLabel).textContent=formatNumber(obj.totalExp,'expense');

			if(obj.percentage >0)
			{
			
			document.querySelector(DOMstrings.percentageLabel).textContent=obj.percentage + '%';
		}
		else{
			document.querySelector(DOMstrings.percentageLabel).textContent='---';
		}



		},

		displayPercentages:function(percentages){

			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

			

			nodeListForEach(fields,function(current,index)
			{
				if (percentages[index] > 0)
				{
					current.textContent=percentages[index]+ '%';
				}
				else
				{
					current.textContent='---';
				}
				
			});

		},

		displayMonth: function(){
			var now, year,month,months;

			months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

			 now = new Date();
			 year = now.getFullYear();
			 month = now.getMonth();
			 document.querySelector(DOMstrings.dateLabel).textContent=months[month]+ ' '+ year;

		},

		changedType: function(){

		var fields= document.querySelectorAll(DOMstrings.inputType, + ',' + DOMstrings.inputDescription + ',' + DOMstrings.inputValue);


		nodeListForEach(fields, function(cur){

			cur.classList.toggle('red-focus');

		});

		document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

		},

		getDOMstrings:function(){
			return DOMstrings;
		}
	};




})();





















// GLOBAL APP CONTROLLER
var controller=(function(budgetCtrl,UICtrl){

		var setupEventListeners=function(){
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);


		document.addEventListener('keypress',function(event){

		if(event.keyCode === 13 || event.which=== 13)
		{
			ctrlAddItem();
		}
	});   

		document.querySelector(DOM.container).addEventListener("click",ctrlDeleteItem);

		document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changedType);



	};

	var updateBudget =function(){
	//1) Calculate the budget
	budgetCtrl.calculateBudget();


	//2) return the budget
	var budget = budgetCtrl.getBudget();



	//3) Display the budget on the interface
	//console.log(budget); 
	UICtrl.displayBudget(budget);

	};



	var updatePercentages= function(){

		//1 Caculate percentages
		budgetCtrl.calculatePercentages();
		
		//2 Read percentages from the budget controller
		var percentages=budgetCtrl.getPercentages();

		//3 Update the UI with the new percentages
		console.log(percentages);
		UICtrl.displayPercentages(percentages);


	};



	var ctrlAddItem=function(){
		var input, newItem;

	//1) Get the field input data

	input = UICtrl.getInput();
	console.log(input);

	if(input.description!=="" && !isNaN(input.value) && input.value > 0)
	
	{
	//2) Add the item to the budget controller
	newItem = budgetCtrl.addItem(input.type, input.description, input.value);
	//3) Add the item to the USER interface
	UICtrl.addListItem(newItem, input.type);
	//4) Clearing of the input fields
	UICtrl.clearFields();
	//5) Calulate and update budget
	updateBudget();

	//6) Calculate the updated percentages
	updatePercentages();
	}


	};

	var ctrlDeleteItem = function(event){

		var itemID,splitID,type,ID;


		itemID=event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID){
			//income-1
			splitID =itemID.split('-');
			type = splitID[0];
			ID = parseInt(splitID[1]);

			//1 delete the item from the Data Structure
			budgetCtrl.deleteItem(type, ID);

			//2 Then we delete the item from the user interface
			UICtrl.deleteListItem(itemID);

			//3 Update and show the new budget
			updateBudget();

			//4 Calculate and update percentages
			updatePercentages();
		}

	};

	return{
		init: function(){
			console.log('Application has started');
			UICtrl.displayMonth();
			UICtrl.displayBudget({

				budget:0,
				totalInc:0,
				totalExp:0,
				percentage:-1
			});
			setupEventListeners();
		}
	};


})(budgetController,UIController);


controller.init();