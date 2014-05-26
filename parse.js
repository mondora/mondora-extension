var stripIdsAndClasses = function (node) {
	node.removeAttribute("id");
	node.removeAttribute("class");
	Array.prototype.forEach.call(node.children, function (child) {
		stripIdsAndClasses(child);
	});
};

var post = {};

post.origin = document.querySelector(".entry-origin a").href;

post.title = document.querySelector(".entry-title").textContent;

var summary = document.querySelector(".entry-summary");
if (summary) {
	post.subtitle = summary.textContent;
}

var author = document.querySelector(".entry-meta .author span");
if (author) {
	post.author = author.textContent;
}

var time = document.querySelector(".entry-meta time");
if (time) {
	post.publishedOn = new Date(time.textContent).getTime();
}

var postContainer = document.querySelector(".entry-content p").parentElement;
stripIdsAndClasses(postContainer);
post.body = postContainer.innerHTML;

console.log(post);
