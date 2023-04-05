function addToCart(id) {
    $.ajax({
        url: '/carts/add/' + id,
        method: 'get',
        success: (response) => {
            if (response.status) {
                alert('Item Added to cart');
            } else {
                window.location = "https://e-commerce-clone123.herokuapp.com/auths/signup/";
            }
        }
    })
}

function addFav(id) {
    $.ajax({
        url: '/favourites/add/' + id,
        method: 'get',
        success: (response) => {
            if (response.status) {
                alert('Item Added to Fav');
            } else {
                window.location = "https://e-commerce-clone123.herokuapp.com/auths/signup/";
            }
        }
    })
}