<script type="text/javascript">

    document.body.onload = () => {

        //Load configuration
        sendAwait("scripts/read-config.php").then(config => {
            try {
                Configuration = JSON.parse(config)
                configureDocument();
            } catch (e) {
                console.log("Configuration: Could not read configuration file...");
                console.log(config);
                console.log(e);
            }
        })

        function configureDocument() {
            return;

            //Load configuration colors
            applyColouring();

            // 2) Initialize media slideshow
            if (Configuration.General.SlideShow) {
                if (Configuration.General.SlideShowList.length > 0) {
                    console.log("Slideshow: Loaded successfully..");
                    document.querySelector("#slideshow").classList.remove("hidden");
                    const mediaslider = mediaSlider(
                        Configuration.General.SlideShowList,
                        document.querySelector("#slideshow"),
                        !0)
                }
            }
        }

    }

    function updateMetaTag(name, content) {
        let metaTag = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
        if (!metaTag) {
            metaTag = document.createElement("meta");
            metaTag.setAttribute(name.startsWith("og:") || name.startsWith("twitter:") ? "property" : "name", name);
            document.head.appendChild(metaTag);
        }
        metaTag.setAttribute("content", content);
    }

    function updateLinkTag(rel, href) {
        let linkTag = document.querySelector(`link[rel="${rel}"]`);
        if (!linkTag) {
            linkTag = document.createElement("link");
            linkTag.setAttribute("rel", rel);
            document.head.appendChild(linkTag);
        }
        linkTag.setAttribute("href", href);
    }

    function toggleOpenGraphMetaTags(enabled) {
        const ogTags = ["og:title", "og:type", "og:image", "og:url", "og:description"];
        ogTags.forEach(tag => {
            let metaTag = document.querySelector(`meta[property="${tag}"]`);
            if (metaTag) {
                metaTag.disabled = !enabled;
            }
        });
    }

    function toggleTwitterCardMetaTags(enabled) {
        const twitterTags = ["twitter:card", "twitter:site", "twitter:creator", "twitter:title", "twitter:description", "twitter:image"];
        twitterTags.forEach(tag => {
            let metaTag = document.querySelector(`meta[name="${tag}"]`);
            if (metaTag) {
                metaTag.disabled = !enabled;
            }
        });
    }
</script>