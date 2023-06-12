const shopItems = document.querySelector(".shop-scroll");
const cartElement = document.querySelector(".cart-item")
const totalPrice = document.querySelector('#total-price');
const app = {
    shoes : [],

    getShoes:async function() {
        const _this = this;
        await fetch("./data/shoes.json")
            .then(res => res.json())
            .then( data => {
                _this.shoes = data.shoes.map(function(shoes) {
                    return shoes;
                })
            })
            .catch(err => console.error(err));
    },
    addToCard: function(shoes){
        return `
        <div class="product">
            <div class="product-img" style="background-color: ${shoes.color};">
                <img src=${shoes.image}>
            </div>            
            <h1 class="product-name">${shoes.name}</h1>
            <p class="product-detail">${shoes.description}</p>
            <div class="product-footer">
                <h1 class="product-price">$${shoes.price}</h1>
            <div class="add-to-cart" data-id=${shoes.id}>
                    ADD TO CART
                </div>
                <div class='added' hidden>
                    <img src="./assets/check.png" />
                </div>
            </div>
        </div>`
    },

    check: function(shoes){
        return `
        <div class="product">
            <div class="product-img" style="background-color: ${shoes.color};">
                <img src=${shoes.image}>
            </div>            
            <h1 class="product-name">${shoes.name}</h1>
            <p class="product-detail">${shoes.description}</p>
            <div class="product-footer">
                <h1 class="product-price">$${shoes.price}</h1>
                <div class="add-to-cart" data-id=${shoes.id} hidden>
                    ADD TO CART
                </div>
                <div class='added' >
                    <img src="./assets/check.png" />
                </div>
            </div>
        </div>`
    },
    renderProducts : function()  {
        let htmlProducts=[];
        let cartItems = JSON.parse(localStorage.getItem('shop-items'));
        cartItems ? cartItems : cartItems = [];
        if(cartItems.length) {
            htmlProducts = this.shoes.map( shoes => {
                let check = cartItems.some(item => {
                    return item.id === shoes.id;
                });
                if(check) {
                    return this.check(shoes)
                }
                else {
                    return this.addToCard(shoes)
                }
                
            });
        }
        else {
            htmlProducts = this.shoes.map(shoes => {
                return this.addToCard(shoes)
            });
        };
        shopItems.innerHTML = htmlProducts.join('');
    },

    showCart: function(shoes){
        return  `
        <div class="product-cart">
            <div class="pc-img" style="background-color: ${shoes.color}">
                <img src=${shoes.image} />
            </div>

            <div class="pc-info">
                <h2 class="pc-name">${shoes.name}</h2>
                <p class="pc-price">$${shoes.price}</p>
                <div class="pc-events">
                    <div>
                        <img id="pc-reduce" class="pc-btn-minus pc-btn" src="./assets/minus.png">
                        <p id=${shoes.id} class="pc-count">${shoes.count}</p>
                        <img id="pc-reduce" class="pc-btn-plus pc-btn" src="./assets/plus.png">
                        
                    </div>

                    <div class="pc-btn">
                        <img class="pc-btn-trash" data-id=${shoes.id} src="./assets/trash.png">
                    </div>
                </div>
            </div>
        </div>
    `
    },

    renderCards : function(){
    
        let shoes =localStorage.getItem('shop-items');
        shoes ? shoes = JSON.parse(shoes) : shoes = [];
        if(shoes.length) {
            let htmlCart = shoes.map(shoes => {
                return `
                    <div class="product-cart">
                        <div class="pc-img" style="background-color: ${shoes.color}">
                            <img src=${shoes.image} />
                        </div>
    
                        <div class="pc-info">
                            <h2 class="pc-name">${shoes.name}</h2>
                            <p class="pc-price">$${shoes.price}</p>
                            <div class="pc-events">
                                <div>
                                    <img id="pc-reduce" class="pc-btn-minus pc-btn" src="./assets/minus.png">
                                    <p id=${shoes.id} class="pc-count">${shoes.count}</p>
                                    <img id="pc-reduce" class="pc-btn-plus pc-btn" src="./assets/plus.png">
                                    
                                </div>
    
                                <div class="pc-btn">
                                    <img class="pc-btn-trash" data-id=${shoes.id} src="./assets/trash.png">
                                </div>
                            </div>
                        </div>
                    </div>
                `
            });
            cartElement.innerHTML = htmlCart.join('');   
        }
        else {
            cartElement.innerHTML =  `<div id="cart-empty">
                                        Your cart is empty
                                    </div>`; 
        }
    },

    addShoesToCard: function(shoes){
        let htmlProduct = `
        <div class="product-cart">
            <div class="pc-img delay-img" style="background-color: ${shoes.color}">
                <img src=${shoes.image} />
            </div>

            <div class="pc-info delay-info">
                <h2 class="pc-name">${shoes.name}</h2>
                <p class="pc-price">$${shoes.price}</p>
                <div class="pc-events">
                    <div>
                        <img id="pc-reduce" class="pc-btn pc-btn-minus" src="./assets/minus.png">
                        <p id=${shoes.id} class="pc-count">${shoes.count}</p>
                        <img id="pc-reduce" class="pc-btn pc-btn-plus" src="./assets/plus.png">
                        
                    </div>

                    <div class="pc-btn">
                        <img class="pc-btn-trash" data-id=${shoes.id} src="./assets/trash.png">
                    </div>
                </div>
            </div>
        </div>`
    cartElement.insertAdjacentHTML('beforeend', htmlProduct);

    },

    handleEvents : function() {
        const _this = this;
        document.onclick = function(e) {
            const element = e.target;
            let cartItems = JSON.parse(localStorage.getItem('shop-items'));
           
            if(element.classList.contains('add-to-cart')) {
               
                let id = +element.getAttribute('data-id');
                let cartItems = localStorage.getItem('shop-items'); 
                cartItems ? cartItems =  JSON.parse(cartItems) : cartItems = [];
                let product = _this.shoes.find(function(shoes) { 
                    return shoes.id === id;
                });
                product.count = 1;
                if(cartItems == null || !cartItems.length) {
                    localStorage.setItem('shop-items', JSON.stringify([product]));
                    cartElement.removeChild(cartElement.firstChild);
                }
                else {
                    cartItems.push(product);
                    localStorage.setItem('shop-items', JSON.stringify(cartItems));
                };
                _this.addShoesToCard(product);
                //Set total cart
                let total = _this.getTotalProduct();
                element.setAttribute('hidden', true);
                element.nextElementSibling.removeAttribute('hidden');
            }
            else if(element.classList.contains('pc-btn-minus')) {
                let countElement = element.nextElementSibling;
                let count = +countElement.innerHTML - 1;
                let id = countElement.id;
                
                if(count > 0) {
                    _this.handleCount(id, count, countElement, cartItems);
                }
                else {
                    //Xoa phan tu trong store va an di
                    _this.deleteItem(id, cartItems, element, count);
                }
            }
            else if(element.classList.contains('pc-btn-plus')) {
                let countElement = element.previousElementSibling;
                let count = +countElement.innerHTML + 1;
                let id = countElement.id;
                _this.handleCount(id, count, countElement, cartItems);
            }
            else if(element.classList.contains('pc-btn-trash')) {
                let id = element.getAttribute('data-id');
                _this.deleteItem(id, cartItems, element, 0);
            }
        }
    },
    getTotalProduct : function() {
        const products = JSON.parse(localStorage.getItem('shop-items')); //Array of products
        if(products) {
            let total = products.reduce(function(total, product) {
                return total + product.price*product.count;
            }, 0);
            totalPrice.innerHTML = `$${total.toFixed(2)}`;
        }
        else totalPrice.innerHTML = `$0.00`;
    },

    getEmptyCart : function() {
        cartElement.innerHTML =  `<div id="cart-empty">
                                        Your cart is empty
                                    </div>`; 
    },

    deleteItem : function(id, cartItems, element, count) {
        const _this = this;
        let countElement = element.nextElementSibling;
        let index;
        let newCart = cartItems.filter((item, i) => {
            if(item.id == id) {
                index = i;
            }
            return item.id != id;
        });
        localStorage.setItem('shop-items', JSON.stringify(newCart));
        const isTrash = element.classList.contains('pc-btn-trash');
        if(isTrash) {
            element.offsetParent.children[index].classList.add('fade-out');
        }
        else {
            countElement.innerHTML = '0';
            element.offsetParent.children[index].classList.add('fade-out');
        };
        _this.getTotalProduct();
        //Xoa hien thi item
        setTimeout(function() {
            element.offsetParent.removeChild(element.offsetParent.children[index]);
            if(newCart.length == 0) {
                _this.getEmptyCart(); 
            }
        }, 1000)
        _this.renderProducts();
        
    },

    handleCount: function(id, count, countElement, cartItems) {
        const _this = this;
        cartItems.forEach(item => {
            if(item.id == id) {
                item.count = count;
            }
        });
        localStorage.setItem('shop-items', JSON.stringify(cartItems));
        countElement.innerHTML = count;
        _this.getTotalProduct();
    },
   


   
    start:async function() {

       
        await this.getShoes();
        this.renderProducts();
        this.renderCards();
        this.getTotalProduct();
        this.handleEvents();
        
     
      
    }
}

app.start();