<div id="contact">
    <form action="" class="contact-form aurora-tile">
        <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="phone">Phone Number:</label>
            <input type="tel" id="phone" name="phone" required>
        </div>
        <div class="form-group">
            <label for="orderType">Order Type:</label>
            <select id="deliveryOption" name="orderType" onchange="toggleAddressField()" required>
                <option value="pickup">Pickup</option>
                <option value="delivery">Delivery</option>
            </select>
        </div>
        <div id="addressField" class="form-group" style="display: none;">
            <label for="address">Delivery Address:</label>
            <input type="text" id="address" name="address">
        </div>
        <div class="form-group">
            <label for="comment">Comment:</label>
            <textarea id="comment" name="comment" rows="4" required></textarea>
        </div>
        <div class="form-group">
            <button type="submit">Checkout</button>
        </div>
    </form>
</div>
<?php ?>