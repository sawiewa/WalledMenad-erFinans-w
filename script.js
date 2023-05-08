const incomeSection = document.querySelector('.income-area');
const expansesSection = document.querySelector('.expanses-area');
const availableMoney = document.querySelector('.available-money');
const addTransactionPanel = document.querySelector('.add-transaction-panel');

const nameInput = document.querySelector('#name');
const amoutInput = document.querySelector('#amount');
const categorySelect = document.querySelector('#category');

const addTransactionBtn = document.querySelector('.add-transaction');
const saveBtn = document.querySelector('.save');
const cancelBtn = document.querySelector('.cancel');
const deleteBtn = document.querySelector('.delete'); //każdy osobny x
const deleteAllBtn = document.querySelector('.delete-all');

const lightStyleBtn = document.querySelector('.light');
const darkStyleBtn = document.querySelector('.dark');

let root = document.documentElement;
let ID = 0;
let categoryIcon;
let selectedCategory;
let moneyArr = [0]; //musi byc 0 dodane ponieważ w tablicy byłoby puste i nie dałoby sie wykonac reduce, na pustej tablisy sie nieda

const showPanel = () => {
	addTransactionPanel.style.display = 'flex';
};

const closePanel = () => {
	addTransactionPanel.style.display = 'none';
	clearInputs();
};

const checkForm = () => {
	if (
		nameInput.value !== '' &&
		amoutInput.value !== ' ' &&
		categorySelect.value !== 'none'
	) {
		createNewTransaction();
	} else {
		alert('Wypełnij wszystkie pola');
	}
};

const clearInputs = () => {
	nameInput.value = '';
	amoutInput.value = '';
	categorySelect.selectedIndex = 0;
};

const createNewTransaction = () => {
	const newTransaction = document.createElement('div');
	newTransaction.classList.add('transaction');
	newTransaction.setAttribute('id', ID);

	checkCategory(selectedCategory); //musimy wybrac najpierw kategorie i przypisac ikone
	newTransaction.innerHTML = `
    <p class="transaction-name">${categoryIcon} ${nameInput.value}</p>
    <p class="transaction-amount">${amoutInput.value} zł 
    <button class="delete" onclick = "deleteTransaction(${ID})"><i class="fas fa-times"></i></button>
    </p>`;
	amoutInput.value > 0 //instrukcja warunkowa, jezeli wartosc jest większa od 0
		? incomeSection.appendChild(newTransaction) && //to dodajemy newTransaction do sekcji income
		  newTransaction.classList.add('income') // i dodajemy mu class income
		: expansesSection.appendChild(newTransaction) && //w przeciwnym wypadku jak kwota jest ujemna to do expanses czyli do wydatków
		  newTransaction.classList.add('expense');

	moneyArr.push(parseFloat(amoutInput.value)); // dodajemy do tablicy moneyArr elementy jakie są pobrane z inputa, ale w inpucie zawsze jest string, parseFloat zamienia go na liczbę

	countMoney(moneyArr); //wywolujemy funkcję co zlicza pieniądze, argumentem jest tablica z całą wpisaną kasą

	closePanel();
	ID++;
	clearInputs();
};
const selectCategory = () => {
	selectedCategory = categorySelect.options[categorySelect.selectedIndex].text; //wybieranie kategorii, wywoływane onclickiem w htmlu
};

const checkCategory = (transaction) => {
	//bedziemy sprawdzac transakcję do jakiej przypisac i wrzucac odpowiednią ikone pod categoryIcon
	switch (transaction) {
		case '[+]Przychód':
			categoryIcon = '<i class="fas fa-money-bill-wave"></i>';
			break;
		case '[-]Zakupy':
			categoryIcon = '<i class="fas fa-cart-arrow-down"></i>';
			break;
		case '[-]Jedzenie':
			categoryIcon = '<i class="fas fa-times"></i>';
			break;
		case '[-]Kino':
			categoryIcon = '<i class="fas fa-film"></i>';
			break;
	}
};
const countMoney = (money) => {
	const newMoney = money.reduce((a, b) => a + b); //reduce to metoda wykonywana na kazdym elemencie tablicy
	availableMoney.textContent = ` ${newMoney} zł`;
};

const deleteTransaction = (id) => {
	const transactionToDelete = document.getElementById(id);

	const transactionAmount = parseFloat(
		transactionToDelete.childNodes[3].innerText
	); //indekx 3 przechowuje wartość którą potem bedziemy wywalac
	//parsefloat bierze tylko cyfry dlatego nie bedzie zł, nie zwraca liter
	const indexOfTransaction = moneyArr.indexOf(transactionAmount);
	moneyArr.splice(indexOfTransaction, 1);
	transactionToDelete.classList.contains('income')
		? incomeSection.removeChild(transactionToDelete)
		: expansesSection.removeChild(transactionToDelete);

	countMoney(moneyArr);
	// console.log(transactionAmount);
	// console.log(moneyArr);
};

const deleteAllTransaction = () => {
	incomeSection.innerHTML = '<h3>Przychód</h3>';
	expansesSection.innerHTML = '<h3>Wydatki</h3>';
	availableMoney.textContent = '0zł';
	moneyArr = [0];
};

const changeStyleToLight = () => {
	root.style.setProperty('--first-color', '#f9f9f9');
	root.style.setProperty('--second-color', '#14161f');
	root.style.setProperty('--border-color', 'rgba(0, 0, 0, 0.2)');
};
const changeStyleToDark = () => {
	root.style.setProperty('--first-color', '#14161f');
	root.style.setProperty('--second-color', '#f9f9f9');
	root.style.setProperty('--border-color', 'rgba(255, 255, 255, 0.4)');
};

addTransactionBtn.addEventListener('click', showPanel);
cancelBtn.addEventListener('click', closePanel);
saveBtn.addEventListener('click', checkForm);
deleteAllBtn.addEventListener('click', deleteAllTransaction);
lightStyleBtn.addEventListener('click', changeStyleToLight);
darkStyleBtn.addEventListener('click', changeStyleToDark);
