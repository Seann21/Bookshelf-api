let Hapi = require("@hapi/hapi");
let routes = require("./routes");

let init = async () => {
    let server = Hapi.server({
        port: 9000,
        host: "localhost",
        routes: {
            cors: {
                origin: ["*"]
            },
        },
    });

    server.route(routes);

    await server.start();
    console.log(`server berjalan pada ${server.info.uri}`);
};

init();
