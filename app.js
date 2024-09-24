const form = document.querySelector('.form-input');
const input = document.querySelector('.input-field');
const categoriesBtn = document.querySelectorAll('.categories-btn');
const url = 'https://fakestoreapi.com/products';
let produtsContainer = document.querySelector('.products')
let allProducts = [];
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
const modal = document.getElementById('modal');
const cartBtn = document.getElementById('cart-btn');
const closeModal = document.getElementById('close-modal');
const cartItemList = document.getElementById('cart-item-list')
const totalAmount = document.getElementById("total-amount")
//it will show diaglog box
cartBtn.addEventListener('click', () => {
    modal.showModal();
})

//it will close dialog box
closeModal.addEventListener('click', () => {
    modal.close();
})

//to prevent formm reload and filter userinput
form.addEventListener('submit', (event) =>{
    event.preventDefault();
    let productName = input.value.toLowerCase().trim();
    if(productName.length <=0){
        produtsContainer.innerHTML = "Types something to search";
    }
    else{
    let filterProductByName = allProducts.filter((product) => {   
        if(product.title.toLowerCase().includes(productName)){
        return product;
        }
    })
    if(filterProductByName.length == 0){
        produtsContainer.innerHTML = "No product found";
    }
   else {   
    renderProductsToDom(filterProductByName)
   }
    input.value = '';
}
})


//fetching api 
function fetchProducts(){
    fetch(url)
        .then(res => res.json())
        .then(data => {
            allProducts = data;
            renderProductsToDom(allProducts);        
        })
        .catch(err => console.error(err));
}
fetchProducts();


//to show api content to dom
function renderProductsToDom(allProducts) {
    produtsContainer.innerHTML = '';
    allProducts.forEach((product, productIndex) => {    
        let isInCart = cartItems.some(item => item.id == product.id)  //false
        const productDiv = `
            <div class="product">
                <img src="${product.image}" alt="${product.title}">
                <p>${product.title}</p>
                <h2>$${product.price}</h2>
                <button class="add-to-cart ${isInCart && 'hidden'}" onclick="addToCart(${productIndex}, ${product.id})">Add to cart</button>
                <button class="added-to-cart ${!isInCart && 'hidden'}">Added to cart</button>
            </div>`;
        produtsContainer.innerHTML += productDiv;
    });
}


//to push product to cartItmes arrya and sum of all products
function addToCart(productIndex, productId){
    let prodcutToAdd = allProducts.find((elem) => elem.id == productId);
    cartItems.push(prodcutToAdd);
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
    renderProductsToDom(allProducts );
    showProcutInCart();
}

//to show product in cart once broswer render
showProcutInCart()

//to show in product in broswer whenever the new item is added or removed
function showProcutInCart(){
    let totalAmt = 0;
    totalAmount.innerText = "0";
    cartItemList.innerHTML = "";
    cartItems.forEach((cartItem, cartItemIndex) => {
        cartProducts = `<div class="cart-flex">
        <img class="cart-img" src="${cartItem.image}" alt="${cartItem.title}">
        <h3 class="item-name">${cartItemIndex + 1}. ${cartItem.title}</h3>
        <h3 class="item-price">$${cartItem.price}</h3>
        <button class="remove-from-cart" onclick="removeFromCart(${cartItemIndex})">Remove</button> 
        </div>`
        totalAmt += cartItem.price;
        totalAmount.innerText = totalAmt.toFixed(2);   
        cartItemList.innerHTML +=  cartProducts;
    })
}

//removing product from cart
function removeFromCart(cartItemIndex) {
    cartItems.splice(cartItemIndex, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
    renderProductsToDom(allProducts)
    showProcutInCart();
}

//filter product through category button
categoriesBtn.forEach((btn) => {
    btn.addEventListener('click', () => {
        if(btn.innerHTML == 'All'){
            renderProductsToDom(allProducts);
        }
        else{
        let filterProductByCategory = allProducts.filter((product) => {
            if(btn.innerHTML == product.category){
                return product;
            }
        })
        renderProductsToDom(filterProductByCategory);
    }
    })
})