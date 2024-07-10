<div id="controller" class="controller-hidden aurora-tile">
    <h3 class="flexwriting">Aurora's Controller</h3>

    <form id="controller-validate">
        <div class="controller-flex">
            <label for="controllerCode">Passcode</label>
            <input type="password" id="controllerCode" name="controllerCode">
        </div>
        <button type="submit">Verify</button>
    </form>
    <div class="controller-section">
        <h3>Orders</h3>
        <div id="controller-orders">
            <form id="controller-orders-form">
                <button id="controller-list-orders" type="submit">Scan</button>
                <input id="display-all-orders-check" type="checkbox"> Lookup
            </form>
            <div id="controller-orders-list-div">
                <div id="following-arrows">
                    <div class="left-arrow following-arrow">&lt;</div>
                    <div class="right-arrow following-arrow">&gt;</div>
                </div>
                <table id="controller-orders-list">
                </table>
            </div>
        </div>
    </div>
    <form class="hidden" id="controller-configuration" action="" method="post">
        <div class="controller-section">
            <h2>Document Configuration</h2>
            <label for="docTitle">Title:</label>
            <input type="text" id="docTitle" value="unset_title"><br>

            <label for="docDescription">Description:</label>
            <input type="text" id="docDescription" value="unset_description"><br>

            <label for="docKeywords">Keywords (comma separated):</label>
            <input type="text" id="docKeywords" value=""><br>

            <label for="docAuthor">Author:</label>
            <input type="text" id="docAuthor" value="unset_author"><br>

            <label for="docCharset">Charset:</label>
            <input type="text" id="docCharset" value="UTF-8"><br>

            <label for="docViewport">Viewport:</label>
            <input type="text" id="docViewport" value="width=device-width, initial-scale=1.0"><br>

            <label for="docCanonical">Canonical URL:</label>
            <input type="text" id="docCanonical" value="unset_canonical_url"><br>

            <label for="docLanguage">Language:</label>
            <input type="text" id="docLanguage" value="en"><br>

            <label for="docFavicon">Favicon URL:</label>
            <input type="text" id="docFavicon" value="unset_favicon_url"><br>

            <label for="docThemeColor">Theme Color:</label>
            <input type="text" id="docThemeColor" value="#ffffff"><br>

            <label for="docRobots">Robots:</label>
            <input type="text" id="docRobots" value="index, follow"><br>

            <h3>Open Graph Settings</h3>
            <label for="ogEnabled">Enabled:</label>
            <input type="checkbox" id="ogEnabled"><br>

            <label for="ogTitle">OG Title:</label>
            <input type="text" id="ogTitle" value="unset_og_title"><br>

            <label for="ogType">OG Type:</label>
            <input type="text" id="ogType" value="website"><br>

            <label for="ogImage">OG Image URL:</label>
            <input type="text" id="ogImage" value="unset_og_image_url"><br>

            <label for="ogUrl">OG URL:</label>
            <input type="text" id="ogUrl" value="unset_og_url"><br>

            <label for="ogDescription">OG Description:</label>
            <input type="text" id="ogDescription" value="unset_og_description"><br>

            <h3>Twitter Card Settings</h3>
            <label for="twitterEnabled">Enabled:</label>
            <input type="checkbox" id="twitterEnabled"><br>

            <label for="twitterCard">Twitter Card Type:</label>
            <input type="text" id="twitterCard" value="summary"><br>

            <label for="twitterSite">Twitter Site:</label>
            <input type="text" id="twitterSite" value="@unset_twitter_site"><br>

            <label for="twitterCreator">Twitter Creator:</label>
            <input type="text" id="twitterCreator" value="@unset_twitter_creator"><br>

            <label for="twitterTitle">Twitter Title:</label>
            <input type="text" id="twitterTitle" value="unset_twitter_title"><br>

            <label for="twitterDescription">Twitter Description:</label>
            <input type="text" id="twitterDescription" value="unset_twitter_description"><br>

            <label for="twitterImage">Twitter Image URL:</label>
            <input type="text" id="twitterImage" value="unset_twitter_image_url"><br>
        </div>
        <div class="controller-section">
            <h3>Colouring</h3>
            <div class="controller-flex">
                <label for="bgColor">Background</label>
                <input type="color" id="bgColor" name="bgColor">
            </div>
            <div class="controller-flex">
                <label for="complimentColor">Compliment</label>
                <input type="color" id="complimentColor" name="complimentColor">
            </div>
            <div class="controller-flex">
                <label for="accentColor">Accent</label>
                <input type="color" id="accentColor" name="accentColor">
            </div>
            <div class="controller-flex">
                <label for="defaultFont">Default Font</label>
                <input type="color" id="defaultFont" name="defaultFont">
            </div>
            <div class="controller-flex"><label for="accentFont">Accent Font</label>
                <input type="color" id="accentFont" name="accentFont">
            </div>
        </div>
        <div class="controller-section">
            <h3>Founder</h3>
            <label for="controller-avatar-list-media">Avatar</label>
            Avatar Preview is not available, scan and select by name. Scan to start over.
            <span class="controller-span-action" id="controller-avatar-list-media"> Scan</span>
            <br>
            <br>
            <div id="controller-media-list-avatar"></div>
            <br>
            <br>
            <label for="founderFName">First Name</label>
            <input type="text" id="founderFName" name="founderFName">
            <br>
            <label for="founderLName">Last Name</label>
            <input type="text" id="founderLName" name="founderLName">
            <br>
            <label for="founderEmail">Email</label>
            <input type="email" id="founderEmail" name="founderEmail">
            <br>
            <label for="founderBiography">Biography</label>
            <textarea id="founderBiography" name="founderBiography"></textarea>
            <br>
            <h3>Platforms</h3>
            <label for="founderFacebook">Founder Facebook</label>
            <input type="text" id="founderFacebook" name="founderFacebook">
            <br>
            <label for="founderInstagram">Founder Instagram</label>
            <input type="text" id="founderInstagram" name="founderInstagram">
            <br>
            <label for="founderTwitter">Founder Twitter</label>
            <input type="text" id="founderTwitter" name="founderTwitter">
            <br>
        </div>
        <div class="controller-section">
            <h3>General</h3>
            <label for="ctrl-taglines">Taglines</label>
            <textarea id="ctrl-taglines" name="ctrl-taglines"></textarea>
            <br>
            <label for="controller-avatar-list-media-slideshow">SlideShow</label>
            Preview is not available, scan and select by name.
            <span class="controller-span-action" id="controller-avatar-list-media-slideshow"> Scan</span>
            <br>
            <br>
            <div id="controller-media-list-slideshow"></div>
            <br>
            <br>
            <label for="catalogueText">Catalogue Message</label>
            <input type="text" id="catalogueText" name="catalogueText">
            <br>
            <label for="platformsText">Platforms Message</label>
            <input type="text" id="platformsText" name="platformsText">
            <br>
            <label for="reviewsText">Reviews Message</label>
            <input type="text" id="reviewsText" name="reviewsText">
        </div>
        <div class="controller-section">
            <h3>Advanced</h3>
            <label for="animationSpeed">General Animation Speed</label>
            <input type="number" id="animationSpeed" name="animationSpeed" step="0.1" min="0">
            <br>
            <label for="slideShowSpeed">SlideShow Animation Speed</label>
            <input type="number" id="slideShowSpeed" name="taglineSpeed" step="0.1" min="0">
            <br>
            <label for="taglineSpeed">Tagline Animation Speed</label>
            <input type="number" id="taglineSpeed" name="taglineSpeed" step="0.1" min="0">
        </div>

        <input id="controller-save" type="submit" value="Save Configuration">
    </form>
    <h3 class="flexwriting">Create A Product</h3>
    <form class="hidden" id="create-product" action="/submit-form" method="POST">
        <div>
            <label for="title">Title</label>
            <input type="text" id="title" name="title" value="Beef Pastry Pies" required>
        </div>
        <div>
            <label for="unit-quantity">Unit Quantity</label>
            <input type="number" id="unit-quantity" name="unit-quantity" value="10" required>
        </div>
        <div>
            <label for="description">Description</label>
            <textarea id="description" name="description" rows="4"
                required>Pastry pies for sale Pastry pies for sale....</textarea>
        </div>
        <div>
            <label for="charge">Charge (in TTD)</label>
            <input type="number" id="charge" name="charge" value="100" required>
        </div>
        <div>
            <label for="stock">Stock Available</label>
            <input type="number" id="stock" name="stock" value="0" required>
        </div>
        <div>
            <br>
            <label for="controller-product-list-media">Thumbnails</label>
            Preview is not available, scan and select by name.
            <span class="controller-span-action" id="controller-media-list-media-product"> Scan</span>
            <br>
            <br>
            <div id="controller-media-list-product"></div>
            <br>
            <br>
        </div>
        <div>
            <label for="currency">Currency</label>
            <input type="text" id="currency" name="currency" value="TTD" required>
        </div>
        <div>
            <button type="submit">Submit</button>
        </div>
    </form>
    <h3 class="flexwriting">Manage Products</h3>
    <div class="hidden" id="controller-products">
        <form id="controller-products-form">
            <button id="controller-list-products" type="submit">Display</button>
        </form>
    </div>
    <h3 class="flexwriting">Images & Files</h3>
    <div class="hidden" id="controller-media">
        <form id="controller-media-form">
            <button id="controller-list-media" type="submit">Scan</button>
            <span class="controller-span-action" id="controller-upload-media">Upload</span>
            <p id="upload-status"></p>
        </form>
        <div id="controller-media-list"></div>
    </div>
    <p id="controller-version-info"></p>
</div>