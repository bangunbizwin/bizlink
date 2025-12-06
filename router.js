// BizLink Model A Router
// Load canonical content into pretty URL pages

(function () {
    function isPrettyURL() {
        return !location.pathname.endsWith(".html") && location.pathname !== "/";
    }

    async function getCanonicalURL() {
        const el = document.querySelector(".post-body, .post-body entry-content, article");
        if (!el) return null;

        const raw = el.innerText.trim();
        if (!raw.startsWith("http")) return null;

        return raw;
    }

    async function loadCanonical(url) {
        try {
            const res = await fetch(url);
            const html = await res.text();
            const dom = new DOMParser().parseFromString(html, "text/html");

            const body = dom.querySelector(".post-body, article .post-body");
            if (!body) return;

            const target = document.querySelector(".post-body");
            if (target) target.innerHTML = body.innerHTML;

        } catch (e) {
            console.error("BizLink Router Error:", e);
        }
    }

    async function init() {
        if (!isPrettyURL()) return;

        const url = await getCanonicalURL();
        if (!url) return;

        await loadCanonical(url);
    }

    document.addEventListener("DOMContentLoaded", init);
})();
