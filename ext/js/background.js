var IMPORTING = false;

var addNotification = function () {
	chrome.tabs.insertCSS(null, {
		file: "css/notification.css"
	});
	chrome.tabs.executeScript(null, {
		file: "js/addNotification.js"
	});
};

var removeNotification = function () {
	chrome.tabs.executeScript(null, {
		file: "js/removeNotification.js"
	});
};

var alertError = function (err) {
	chrome.notifications.create("errorNotification", {
        type: "basic",
        title: "Oh snap!",
		message: "An error occurred",
        iconUrl: "img/error.png"
	}, function () {});
};

var handleFail = function (err) {
	removeNotification();
	alertError(err);
	// Reset importing
	IMPORTING = false;
};

var stripClassesAndIds = function (node) {
	node.removeAttribute("id");
	node.removeAttribute("class");
	Array.prototype.forEach.call(node.children, stripClassesAndIds);
};

var parseContent = function (htmlString) {
	var div = document.createElement("div");
	div.innerHTML = htmlString;
	var topLevelNode = div.querySelector("p").parentElement;
	stripClassesAndIds(topLevelNode);
	return topLevelNode.innerHTML;
};

var getPublishedDate = function (dateString) {
	if (dateString) {
		return new Date(dateString).getTime();
	}
};

var parseInsertAndRedirect = function (parsedPost, ceres, tab) {

	// Init collections and users
	var Posts = ceres.getCollection("posts");
	var user = ceres.getCollection("users").reactiveQuery({}).result[0];

	// Construct the post
	var post = {
		userId: user._id,
		map: {},
		authors: [{
			userId: user._id,
			screenName: user.profile.screenName,
			name: user.profile.name,
			pictureUrl: user.profile.pictureUrl
		}],
		title: parsedPost.title,
		body: parseContent(parsedPost.content),
		repost: true,
		original: {
			url: parsedPost.url,
			author: parsedPost.author,
			publishedOn: getPublishedDate(parsedPost.date_published)
		},
		comments: [],
		published: false
	};

	// Insert and redirect
	Posts.insert(post).remote.then(function (postId) {
		// Reset importing
		IMPORTING = false;

		// @if TARGET=='prod'
		var redirectUrl = "http://mondora.com/#!/post/" + postId + "/edit";
		// @endif

		// @if TARGET=='test'
		var redirectUrl = "http://localhost:8080/#!/post/" + postId + "/edit";
		// @endif

		chrome.tabs.update(tab.id, {url: redirectUrl});
	}).fail(handleFail);
};

chrome.browserAction.onClicked.addListener(function (tab) {

	addNotification();
	// Prevent multiple clicks
	if (IMPORTING) {
		return;
	}
	IMPORTING = true;

	// @if TARGET=='prod'
	var ceres = new Asteroid("api.mondora.com", true);
	// @endif

	// @if TARGET=='test'
	var ceres = new Asteroid("localhost:3000");
	// @endif

	ceres.on("connected", function () {
		ceres.resumeLoginPromise.fail(function () {
			ceres.loginWithTwitter();
		});
	});

	ceres.on("login", function () {
		ceres.call("parseWithReadability", tab.url).result.then(function (parsedPost) {
			parseInsertAndRedirect(parsedPost, ceres, tab);
		}).fail(handleFail);
	});

});
