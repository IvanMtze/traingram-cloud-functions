const functions = require("firebase-functions");
var axios = require('axios');


exports.sendNewCommentNotification = functions.firestore
	.document('users/{user_id}/posts/{post_id}/comments/{comment_id}')
	.onCreate((snap,context)=>{

        var options = {
          method: 'POST',
          url: 'https://traingram.herokuapp.com/api/login',
          headers: {
            'Content-Type': 'application/json'
          },
          data: JSON.stringify({
            "name": "master",
            "password": "mastermaster"
          })

        };
        axios(options).then(function (response) {
            console.log(JSON.stringify(response.data));
            const token = response.data.token;
            const posted_creator_user_id = context.params.user_id;
            const post_id = context.params.user_id;
            const new_comment_id = context.params.comment_id;
            const new_comment_data = snap.data();
            const commented_by_username = new_comment_data.username;
            const commented_text = new_comment_data.text;

            var options = {
              method: 'POST',
              url: 'https://traingram.herokuapp.com/api/notifications',
              headers: {
                'x-access-token':token,
                'Content-Type': 'application/json'
              },
              data: JSON.stringify({
                "title": commented_by_username + " ha comentado.",
                "description": "El usuario" + commented_by_username + " ha agregado un comentario: "+commented_text,
                "user_id": posted_creator_user_id
              })
            };

            axios(options).then( function (response) {
              console.log(response.data);
            });

        });

	});
