module.exports = (server) => {
    const Twit = require("twit");
    let client = new Twit({
        consumer_key: 'CFmkg86f7iXug3xyqQpkWbiDd',
        consumer_secret: 'ToI1pv1oznPSoEnwzlmk8dXKNyjdfPDeP8lfyDigcGb644hsPj',
        access_token: '1014622081-Uiq4U3TbbTowKUYHVz82QOZZWh7gRnvqyXDIAtN',
        access_token_secret: 'Pgjui0or5BxCNmIo6x7piFtNCRlHkYSCqwXH04Q9l3lNL',
        timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
        strictSSL:            true,     // optional - requires SSL certificates to be valid.
    });
    
    let stream = client.stream('statuses/filter', {
        follow: ["1409432647038738432", "1084456172395016193"]
    });
    console.log("Fetching Twitter @upi_fess API...")
    stream.on('tweet', function (tweet) {
        var url = "https://twitter.com/" + tweet.user.screen_name + "/status/" + tweet.id_str;
        let discordChannel = server.client.channels.cache.get("945383223091953675");
        discordChannel.send("***New Tweet from UPIfess!*** :outbox_tray:\n\n>>> " + url);
    });
}
