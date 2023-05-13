module.exports.config = {
	name: "run",
	version: "1.0.2",
	hasPermssion: 2,
	credits: "Mirai Team",
	description: "running shell",
	commandCategory: "Hệ thống",
	usages: "[Script]",
	cooldowns: 5
};

module.exports.run = async function({ api, event, args, Threads, Users, Currencies, models }) {
	const eval = require("eval");
	const axios = require("axios");
	const output = function (a) {
		if (typeof a === "object" || typeof a === "array") {
			if (Object.keys(a).length != 0) a = JSON.stringify(a, null, 4);
			else a = "done!";
		}

		if (typeof a === "number") a = a.toString();
		return api.sendMessage(a, event.threadID, event.messageID);
	}
	const outAttachment = async function (a) {
		try {
			var { data } = await axios.get(a, { responseType: 'stream' });
			api.sendMessage({ attachment: data }, event.threadID, event.messageID);
		}
		catch (e) { 
			output(e) 
		};
	}

	const curl = async function (a, b) {
		if(!b) b = "get";
		if(b != "get" && b != "post" && b != "put" && b != "delete" && b != "patch") return output("Method không hợp lệ!");
		try {
			var { data } = await axios[b](a);
			output(data);
			return data;
		}
		catch (e) {
			output(e);
		}
	}

	const getPathJSON = async function (obj, key, path = '', paths = []) {
		try {
			obj = JSON.parse(JSON.stringify(obj, null, 4));
		}
		catch (e) {
			return output("Định dạng JSON không hợp lệ!");
		}
		for (const prop in obj) {
		  if (prop === key) {
			paths.push({path: `${path}.${prop}`.replace(/^\./, ''), value: obj[prop]});
		  } else if (typeof obj[prop] === 'object') {
			await getPathJSON(obj[prop], key, `${path}.${prop}`, paths);
		  } else if (Array.isArray(obj[prop])) {
			for (let i = 0; i < obj[prop].length; i++) {
			  await getPathJSON(obj[prop][i], key, `${path}.${prop}[${i}]`, paths);
			}
		  }
		}		

		return paths.length ? output(paths) : output("Không tìm thấy key!");
	}
	const getInfoInstagram = async (username) => {
		try {
		  var response = await axios.get(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
			headers: {
			  'x-ig-app-id': 936619743392459
			}
		  })
		  var data = response.data.data;
		  return data.user
		}
		catch (error) {
		  return 404;
		}
	  }
	  
	  const getInfoMediaInstagram = async (url) => {
		if(!url) return 403;
		var regex = /https:\/\/www.instagram.com\/(p|reel)\/([a-zA-Z0-9-_]+)\/?/g;
		var id = regex.exec(url)[2];
		try {
		  var variables = JSON.stringify({
			"shortcode": id,
			"child_comment_count":3,
			"fetch_comment_count":40,
			"parent_comment_count":24,
			"has_threaded_comments":true
		  });
		  var hash = "b3055c01b4b222b8a47dc12b090e4e64"
		  var response = await axios.get("https://www.instagram.com/graphql/query/?query_hash=" + hash + "&variables=" + variables);
		  var data = response.data;
		  return data.data.shortcode_media
		}
		catch (error) {
		  return 404;
		}
	  }

	try {
		args = args.join(" ");
		if(event.type == "message_reply") args = event.messageReply.body;
		const response = await eval(args, { 
			output, 
			api, 
			event, 
			args, 
			Threads, 
			Users, 
			Currencies, 
			outAttachment, 
			curl,
			getPathJSON,
			getInfoMediaInstagram,
			getInfoInstagram
		}, true);
		return output(response);
	}
	catch (e) { 
		return output(e) 
	};
}
